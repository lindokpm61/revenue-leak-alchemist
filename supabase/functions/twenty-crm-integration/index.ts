import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CRMIntegrationRequest {
  scenario: 'new_user' | 'existing_user' | 'anonymous';
  userId?: string;
  submissionId?: string;
  tempId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { scenario, userId, submissionId, tempId }: CRMIntegrationRequest = await req.json();
    
    console.log(`Twenty CRM integration: ${scenario} scenario for user ${userId}, submission ${submissionId}`);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get Twenty CRM configuration from secrets
    const twentyCrmUrl = Deno.env.get('TWENTY_CRM_BASE_URL');
    const twentyCrmApiKey = Deno.env.get('TWENTY_CRM_API_KEY');
    
    if (!twentyCrmUrl || !twentyCrmApiKey) {
      console.error('Twenty CRM configuration missing');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Twenty CRM not configured' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    let result;
    
    switch (scenario) {
      case 'new_user':
        result = await handleNewUserScenario(userId!, submissionId!, twentyCrmUrl, twentyCrmApiKey, supabaseClient);
        break;
        
      case 'existing_user':
        result = await handleExistingUserScenario(userId!, submissionId!, twentyCrmUrl, twentyCrmApiKey, supabaseClient);
        break;
        
      case 'anonymous':
        result = { success: true, message: 'Anonymous calculator - no CRM integration needed' };
        break;
        
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
    
    // Log the integration attempt
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_type: 'twenty_crm',
        status: result.success ? 'success' : 'error',
        submission_id: submissionId,
        response_data: result,
        error_message: result.success ? null : result.error
      });
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Twenty CRM integration failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// New User Scenario: Create Company → Contact → Opportunity using user profile + submission data
async function handleNewUserScenario(
  userId: string,
  submissionId: string,
  crmUrl: string,
  apiKey: string,
  supabaseClient: any
) {
  try {
    console.log('Handling new user scenario for user:', userId);
    
    // Get user data from submission (which has email) since we can't access auth.users directly
    const { data: submissionData, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    if (submissionError) throw new Error(`Failed to get submission data: ${submissionError.message}`);
    
    // Create user data object from submission
    // Get user metadata from auth user if available
    let userMetadata = {};
    try {
      const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId);
      if (authUser?.user?.user_metadata) {
        userMetadata = authUser.user.user_metadata;
      }
    } catch (authError) {
      console.log('Could not fetch auth user metadata, using fallback:', authError.message);
    }

    // Store userMetadata for later use in company creation
    const userData = { 
      user: { 
        email: submissionData.contact_email,
        user_metadata: userMetadata
      },
      userMetadata // Store for use in createCrmCompanyFromProfile
    };
    
    
    // Try to get profile data, but don't fail if it doesn't exist (new user)
    const { data: profileData, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Use fallback values if profile doesn't exist yet
    const profile = profileData || {
      actual_company_name: null,
      business_model: null,
      actual_role: null,
      phone: null,
      user_type: null
    };
    
    console.log('Profile data exists:', !!profileData, 'Profile error:', profileError?.message);
    
    // Step 1: Create CRM Company using user profile data
    const companyResult = await createCrmCompanyFromProfile(profile, submissionData, crmUrl, apiKey, supabaseClient, submissionId, userData.userMetadata);
    if (!companyResult.success) {
      return companyResult;
    }
    
    // Step 2: Create CRM Contact using user auth + profile data
    const contactResult = await createCrmContactFromUser(userData.user, profile, companyResult.companyId, crmUrl, apiKey, supabaseClient, submissionId);
    if (!contactResult.success) {
      return contactResult;
    }
    
    // Step 3: Create CRM Opportunity using submission data
    const opportunityResult = await createCrmOpportunityFromSubmission(submissionData, contactResult.contactId, companyResult.companyId, crmUrl, apiKey, supabaseClient);
    
    return {
      success: true,
      companyId: companyResult.companyId,
      contactId: contactResult.contactId,
      opportunityId: opportunityResult.success ? opportunityResult.opportunityId : null,
      errors: opportunityResult.success ? [] : [opportunityResult.error]
    };
    
  } catch (error) {
    console.error('New user scenario failed:', error);
    return { success: false, error: error.message };
  }
}

// Existing User Scenario: Skip Company/Contact, Create new Opportunity only
async function handleExistingUserScenario(
  userId: string,
  submissionId: string,
  crmUrl: string,
  apiKey: string,
  supabaseClient: any
) {
  try {
    console.log('Handling existing user scenario for user:', userId);
    
    // Get existing CRM IDs from previous submissions
    const { data: existingSubmission, error } = await supabaseClient
      .from('submissions')
      .select('twenty_company_id, twenty_contact_id')
      .eq('user_id', userId)
      .not('twenty_company_id', 'is', null)
      .not('twenty_contact_id', 'is', null)
      .limit(1)
      .single();
    
    if (error || !existingSubmission) {
      console.log('No existing CRM records found, creating new records for existing user');
      // Fallback to creating new records like new user scenario
      return await handleNewUserScenario(userId, submissionId, crmUrl, apiKey, supabaseClient);
    }
    
    // Get current submission data
    const { data: submissionData, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    if (submissionError) throw new Error(`Failed to get submission data: ${submissionError.message}`);
    
    // Create new opportunity for existing user
    const opportunityResult = await createCrmOpportunityFromSubmission(
      submissionData, 
      existingSubmission.twenty_contact_id, 
      existingSubmission.twenty_company_id, 
      crmUrl, 
      apiKey, 
      supabaseClient
    );
    
    // Update current submission with existing CRM IDs
    await supabaseClient
      .from('submissions')
      .update({
        twenty_company_id: existingSubmission.twenty_company_id,
        twenty_contact_id: existingSubmission.twenty_contact_id
      })
      .eq('id', submissionId);
    
    return {
      success: true,
      companyId: existingSubmission.twenty_company_id,
      contactId: existingSubmission.twenty_contact_id,
      opportunityId: opportunityResult.success ? opportunityResult.opportunityId : null,
      errors: opportunityResult.success ? [] : [opportunityResult.error]
    };
    
  } catch (error) {
    console.error('Existing user scenario failed:', error);
    return { success: false, error: error.message };
  }
}

async function createCrmCompanyFromProfile(
  profileData: any,
  submissionData: any,
  crmUrl: string, 
  apiKey: string, 
  supabaseClient: any,
  submissionId: string,
  userMetadata: any = {}
) {
  try {
    const companyName = profileData.actual_company_name || submissionData.company_name;
    console.log('Creating Twenty CRM company from profile:', companyName);
    
    // Check if company already exists by name
    try {
      const existingCompanyResponse = await fetch(`${crmUrl}/rest/companies?filter[name][eq]=${encodeURIComponent(companyName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (existingCompanyResponse.ok) {
        const existingResult = await existingCompanyResponse.json();
        console.log('Existing company search result:', existingResult);
        
        if (existingResult.data?.companies && existingResult.data.companies.length > 0) {
          const existingCompanyId = existingResult.data.companies[0].id;
          console.log('Existing Twenty CRM company found:', existingCompanyId);
          
          // Update submission with existing company ID
          await supabaseClient
            .from('submissions')
            .update({
              twenty_company_id: existingCompanyId
            })
            .eq('id', submissionId);
          
          return { success: true, companyId: existingCompanyId, existing: true };
        }
      } else {
        console.log('Company search failed with status:', existingCompanyResponse.status);
        const errorText = await existingCompanyResponse.text();
        console.log('Company search error:', errorText);
      }
    } catch (searchError) {
      console.error('Error searching for existing company:', searchError);
      // Continue to create new company if search fails
    }
    
    // Create new company using GraphQL mutation
    const createCompanyMutation = `
      mutation CreateCompany($data: CompanyCreateInput!) {
        createCompany(data: $data) {
          id
          name
          leadScore
          leadCategory
          annualRecurringRevenue {
            amountMicros
            currencyCode
          }
          totalRevenueLeak {
            amountMicros
            currencyCode
          }
          recoveryPotential {
            amountMicros
            currencyCode
          }
          monthlyMrr {
            amountMicros
            currencyCode
          }
          createdAt
        }
      }
    `;

    const variables = {
      data: {
        name: companyName,
        annualRecurringRevenue: submissionData.current_arr ? {
          amountMicros: Math.round(submissionData.current_arr * 1000000).toString(),
          currencyCode: "USD"
        } : undefined,
        monthlyMrr: submissionData.monthly_mrr ? {
          amountMicros: Math.round(submissionData.monthly_mrr * 1000000).toString(),
          currencyCode: "USD"
        } : undefined,
        totalRevenueLeak: submissionData.total_leak ? {
          amountMicros: Math.round(submissionData.total_leak * 1000000).toString(),
          currencyCode: "USD"
        } : undefined,
        recoveryPotential: submissionData.recovery_potential_70 ? {
          amountMicros: Math.round(submissionData.recovery_potential_70 * 1000000).toString(),
          currencyCode: "USD"
        } : undefined,
        leadScore: submissionData.lead_score || null,
        leadCategory: submissionData.lead_score > 80 ? "ENTERPRISE" : submissionData.lead_score > 60 ? "PREMIUM" : "STANDARD",
        calculatorCompletionDate: new Date().toISOString().split('T')[0],
        monthlyLeads: submissionData.monthly_leads || null,
        employees: 10,
        idealCustomerProfile: submissionData.lead_score > 70,
        domainName: {
          primaryLinkUrl: `https://${companyName.toLowerCase().replace(/\s+/g, '-')}.com`
        }
      }
    };
    
    console.log('Company GraphQL variables:', JSON.stringify(variables, null, 2));
    
    const response = await fetch(`${crmUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: createCompanyMutation,
        variables: variables
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Company creation API error:', response.status, errorText);
      throw new Error(`CRM API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Company creation response:', result);
    const companyId = result.data?.createCompany?.id;
    
    if (!companyId) {
      console.error('No company ID in response:', result);
      throw new Error('No company ID returned from CRM');
    }
    
    console.log('Twenty CRM company created:', companyId);
    
    // Update submission with company ID
    await supabaseClient
      .from('submissions')
      .update({
        twenty_company_id: companyId
      })
      .eq('id', submissionId);
    
    return { success: true, companyId };
    
  } catch (error) {
    console.error('Company creation failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

async function createCrmContactFromUser(
  userData: any,
  profileData: any,
  companyId: string,
  crmUrl: string, 
  apiKey: string, 
  supabaseClient: any,
  submissionId: string
) {
  try {
    const userEmail = userData.email;
    const firstName = userData.user_metadata?.first_name || profileData.actual_company_name?.split(' ')[0] || 'Unknown';
    const lastName = userData.user_metadata?.last_name || 'Contact';
    
    console.log('Creating Twenty CRM contact for user:', userEmail);
    
    // First, check if contact already exists by email
    try {
      const existingContactResponse = await fetch(`${crmUrl}/rest/people?filter[emails][primaryEmail][eq]=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (existingContactResponse.ok) {
        const existingResult = await existingContactResponse.json();
        console.log('Existing contact search result:', existingResult);
        
        if (existingResult.data?.people && existingResult.data.people.length > 0) {
          const existingContactId = existingResult.data.people[0].id;
          console.log('Existing Twenty CRM contact found:', existingContactId);
          
          // Update existing contact with company ID
          try {
            await fetch(`${crmUrl}/rest/people/${existingContactId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                companyId: companyId
              })
            });
          } catch (updateError) {
            console.error('Failed to update contact with company ID:', updateError);
          }
          
          // Update submission with existing CRM contact ID
          await supabaseClient
            .from('submissions')
            .update({
              twenty_contact_id: existingContactId,
              synced_to_self_hosted: true
            })
            .eq('id', submissionId);
          
          return { success: true, contactId: existingContactId, existing: true };
        }
      } else {
        console.log('Contact search failed with status:', existingContactResponse.status);
        const errorText = await existingContactResponse.text();
        console.log('Contact search error:', errorText);
      }
    } catch (searchError) {
      console.error('Error searching for existing contact:', searchError);
      // Continue to create new contact if search fails
    }
    
    // Map industry values to Twenty CRM enum values
    const mapIndustryToTwentyCRM = (industry: string): string => {
      const industryMap: Record<string, string> = {
        'saas': 'SAAS',
        'technology': 'TECHNOLOGY',
        'financial-services': 'FINTECH',
        'healthcare': 'HEALTHCARE',
        'education': 'EDUCATION',
        'retail-ecommerce': 'RETAIL',
        'manufacturing': 'MANUFACTURING',
        'consulting-professional': 'CONSULTING',
        'real-estate': 'REAL_ESTATE',
        'media-marketing': 'MARKETING',
        'hospitality-travel': 'HOSPITALITY',
        'nonprofit': 'NONPROFIT',
        'government': 'GOVERNMENT',
        'other': 'OTHER'
      };
      return industryMap[industry] || 'OTHER';
    };

    // Create new contact using GraphQL mutation
    const createPersonMutation = `
      mutation CreatePerson($data: PersonCreateInput!) {
        createPerson(data: $data) {
          id
          emails {
            primaryEmail
          }
          name {
            firstName
            lastName
          }
          jobTitle
          industry
          companyId
          leadScore
          createdAt
        }
      }
    `;

    const variables = {
      data: {
        emails: {
          primaryEmail: userEmail
        },
        name: {
          firstName: firstName,
          lastName: lastName
        },
        phones: profileData.phone ? {
          primaryPhoneNumber: profileData.phone,
          primaryPhoneCountryCode: "US",
          primaryPhoneCallingCode: "+1"
        } : undefined,
        jobTitle: profileData.actual_role || "Decision Maker",
        industry: mapIndustryToTwentyCRM(profileData.user_type || 'other'),
        emailSequenceStatus: "NOT_STARTED",
        followUpPriority: "PRIORITY_1_URGENT",
        companyId: companyId,
        leadScore: null,
        calculatorResultsUrl: {
          primaryLinkUrl: `https://app.com/results/${submissionId}`
        }
      }
    };
    
    console.log('Contact GraphQL variables:', JSON.stringify(variables, null, 2));
    
    const response = await fetch(`${crmUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: createPersonMutation,
        variables: variables
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Contact creation API error:', response.status, errorText);
      throw new Error(`CRM API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Contact creation response:', result);
    const contactId = result.data?.createPerson?.id;
    
    if (!contactId) {
      console.error('No contact ID in response:', result);
      throw new Error('No contact ID returned from CRM');
    }
    
    console.log('Twenty CRM contact created:', contactId);
    
    // Update submission with CRM contact ID
    await supabaseClient
      .from('submissions')
      .update({
        twenty_contact_id: contactId,
        synced_to_self_hosted: true
      })
      .eq('id', submissionId);
    
    return { success: true, contactId };
    
  } catch (error) {
    console.error('Contact creation failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

async function createCrmOpportunityFromSubmission(
  submissionData: any,
  contactId: string,
  companyId: string,
  crmUrl: string, 
  apiKey: string, 
  supabaseClient: any
) {
  try {
    console.log('Creating Twenty CRM opportunity for submission:', submissionData.id);
    
    // Validate that IDs are proper UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(contactId)) {
      throw new Error(`Invalid contact ID format: ${contactId}`);
    }
    if (!uuidRegex.test(companyId)) {
      throw new Error(`Invalid company ID format: ${companyId}`);
    }
    
    // Create opportunity using submission data
    const opportunityPayload = {
      name: `${submissionData.company_name} - Revenue Recovery Opportunity`,
      amount: {
        amountMicros: Math.round((submissionData.recovery_potential_70 || 0) * 1000000),
        currencyCode: "USD"
      },
      stage: "NEW_LEAD",
      pointOfContactId: contactId,
      companyId: companyId
    };
    
    console.log('Opportunity payload:', JSON.stringify(opportunityPayload, null, 2));
    
    const response = await fetch(`${crmUrl}/rest/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(opportunityPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Opportunity creation API error:', response.status, errorText);
      throw new Error(`CRM API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Opportunity creation response:', result);
    const opportunityId = result.data?.opportunities?.[0]?.id || result.data?.id || result.id;
    
    if (!opportunityId) {
      console.error('No opportunity ID in response:', result);
      throw new Error('No opportunity ID returned from CRM');
    }
    
    console.log('Twenty CRM opportunity created:', opportunityId);
    
    return { success: true, opportunityId };
    
  } catch (error) {
    console.error('Opportunity creation failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}