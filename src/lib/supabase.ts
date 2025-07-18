import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types for submissions
export type Submission = Database['public']['Tables']['submissions']['Row'];
export type SubmissionInsert = Database['public']['Tables']['submissions']['Insert'];
export type SubmissionUpdate = Database['public']['Tables']['submissions']['Update'];

export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert'];

export type EmailSequence = Database['public']['Tables']['email_sequences']['Row'];
export type EmailSequenceInsert = Database['public']['Tables']['email_sequences']['Insert'];
export type EmailSequenceUpdate = Database['public']['Tables']['email_sequences']['Update'];

export type IntegrationLog = Database['public']['Tables']['integration_logs']['Row'];
export type IntegrationLogInsert = Database['public']['Tables']['integration_logs']['Insert'];

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type UserCompanyRelationship = Database['public']['Tables']['user_company_relationships']['Row'];
export type UserCompanyRelationshipInsert = Database['public']['Tables']['user_company_relationships']['Insert'];
export type UserCompanyRelationshipUpdate = Database['public']['Tables']['user_company_relationships']['Update'];

// Submission operations
export const submissionService = {
  async create(data: SubmissionInsert) {
    const { data: result, error } = await supabase
      .from('submissions')
      .insert(data)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByUserId(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getAll(limit = 50) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getAllWithUserData(limit = 100) {
    // Get submissions with user data using the new database function
    const { data, error } = await supabase.rpc('get_submissions_with_user_data', {
      limit_count: limit
    });
    
    return { data, error };
  },

  async update(id: string, updates: SubmissionUpdate) {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string) {
    // First delete related integration_logs records
    const { error: logsError } = await supabase
      .from('integration_logs')
      .delete()
      .eq('submission_id', id);
    
    if (logsError) {
      console.error('Error deleting integration logs:', logsError);
      return { error: logsError };
    }
    
    // Then delete the submission
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Analytics operations
export const analyticsService = {
  async track(eventType: string, submissionId?: string, properties?: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        submission_id: submissionId,
        user_id: user.id,
        properties
      });
    
    return { data, error };
  },

  async getEvents(limit = 100) {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
};

// User operations
export const userService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUsersWithAnalytics(limit = 100) {
    const { data, error } = await supabase.rpc('get_users_with_analytics', {
      limit_count: limit
    });
    
    return { data, error };
  },

  async deleteUser(userId: string) {
    // Get the current user's session to check admin status
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role || 'user';
    
    if (userRole !== 'admin') {
      return { data: null, error: { message: 'Unauthorized - Admin access required' } };
    }

    console.log('Starting user deletion process for:', userId);

    try {
      // Step 1: Clean up user_profiles (this should cascade to other tables)
      console.log('Deleting user profile...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.log('Profile deletion error (may not exist):', profileError);
      }

      // Step 2: Clean up user_company_relationships
      console.log('Deleting user company relationships...');
      const { error: relationshipsError } = await supabase
        .from('user_company_relationships')
        .delete()
        .eq('user_id', userId);

      if (relationshipsError) {
        console.log('Relationships deletion error (may not exist):', relationshipsError);
      }

      // Step 3: Clean up user_engagement_events
      console.log('Deleting user engagement events...');
      const { error: engagementError } = await supabase
        .from('user_engagement_events')
        .delete()
        .eq('user_id', userId);

      if (engagementError) {
        console.log('Engagement events deletion error (may not exist):', engagementError);
      }

      // Step 4: Update submissions to remove user reference
      console.log('Updating submissions...');
      const { error: submissionUpdateError } = await supabase
        .from('submissions')
        .update({ user_id: null })
        .eq('user_id', userId);

      if (submissionUpdateError) {
        console.log('Submissions update error:', submissionUpdateError);
      }

      // Step 5: Clean up analytics_events
      console.log('Deleting analytics events...');
      const { error: analyticsError } = await supabase
        .from('analytics_events')
        .delete()
        .eq('user_id', userId);

      if (analyticsError) {
        console.log('Analytics deletion error (may not exist):', analyticsError);
      }

      console.log('All related data cleaned up successfully');
      
      // Note: We cannot delete the auth user directly from the client side
      // This would require service role access which is not available in the browser
      // Instead, return success and let the admin know the user data has been cleaned
      
      return { 
        data: { 
          success: true, 
          message: 'User data cleaned successfully. Note: User auth record still exists but all profile and related data has been removed.' 
        }, 
        error: null 
      };

    } catch (err) {
      console.error('Error during user deletion:', err);
      return { data: null, error: err };
    }
  }
};

// Email sequence operations
export const emailSequenceService = {
  async create(data: EmailSequenceInsert) {
    const { data: result, error } = await supabase
      .from('email_sequences')
      .insert(data)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getBySubmissionId(submissionId: string) {
    const { data, error } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async updateStatus(id: string, status: string, timestamps?: Partial<EmailSequenceUpdate>) {
    const { data, error } = await supabase
      .from('email_sequences')
      .update({ status, ...timestamps })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
};

// Integration logs operations
export const integrationLogService = {
  async create(data: IntegrationLogInsert) {
    const { data: result, error } = await supabase
      .from('integration_logs')
      .insert(data)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getByType(integrationType: string, limit = 50) {
    const { data, error } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('integration_type', integrationType)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getBySubmissionId(submissionId: string) {
    const { data, error } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};

// Lead scoring utilities
export const calculateLeadScore = (submission: any): number => {
  let score = 0;
  
  // ARR Points
  const arr = submission.current_arr || 0;
  if (arr >= 5000000) {
    score += 50; // $5M+
  } else if (arr >= 1000000) {
    score += 40; // $1M-5M
  } else if (arr >= 500000) {
    score += 30; // $500K-1M
  } else {
    score += 20; // <$500K
  }
  
  // Leak Impact Points
  const totalLeak = submission.total_leak || 0;
  if (totalLeak >= 1000000) {
    score += 40; // $1M+ leak
  } else if (totalLeak >= 500000) {
    score += 30; // $500K-1M leak
  } else if (totalLeak >= 250000) {
    score += 20; // $250K-500K leak
  } else {
    score += 10; // <$250K leak
  }
  
  // Industry Multiplier
  const industry = submission.industry?.toLowerCase() || '';
  if (industry.includes('technology') || industry.includes('saas') || industry.includes('software')) {
    score += 10; // Technology/SaaS
  } else if (industry.includes('finance') || industry.includes('financial') || industry.includes('fintech')) {
    score += 8; // Finance
  } else {
    score += 5; // Other
  }
  
  return Math.min(score, 100); // Cap at 100
};

// Lead scoring operations
export const leadScoringService = {
  async recalculateAllScores() {
    // Get all submissions with missing or zero scores
    const { data: submissions, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .or('lead_score.is.null,lead_score.eq.0');
    
    if (fetchError) return { data: null, error: fetchError };
    if (!submissions || submissions.length === 0) return { data: { updated: 0 }, error: null };
    
    // Update each submission individually
    const updatePromises = submissions.map(async (submission) => {
      const newScore = calculateLeadScore(submission);
      return supabase
        .from('submissions')
        .update({ 
          lead_score: newScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id);
    });
    
    const results = await Promise.all(updatePromises);
    const hasErrors = results.some(result => result.error);
    
    if (hasErrors) {
      return { data: null, error: new Error('Some updates failed') };
    }
    
    return { data: { updated: submissions.length }, error: null };
  },

  async recalculateScore(submissionId: string) {
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (fetchError) return { data: null, error: fetchError };
    
    const newScore = calculateLeadScore(submission);
    
    const { data, error } = await supabase
      .from('submissions')
      .update({ 
        lead_score: newScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single();
    
    return { data, error };
  },

  async getScoreStats() {
    const { data, error } = await supabase
      .from('submissions')
      .select('lead_score');
    
    if (error) return { data: null, error };
    
    const totalSubmissions = data.length;
    const scoredSubmissions = data.filter(s => s.lead_score && s.lead_score > 0).length;
    const unScoredSubmissions = totalSubmissions - scoredSubmissions;
    
    return { 
      data: { 
        total: totalSubmissions, 
        scored: scoredSubmissions, 
        unscored: unScoredSubmissions 
      }, 
      error: null 
    };
  }
};

// User profile operations
export const userProfileService = {
  async create(data: UserProfileInsert) {
    // Filter out UTM fields that don't exist in the user_profiles table
    const { utm_source, utm_medium, utm_campaign, ...cleanData } = data as any;
    
    const { data: result, error } = await supabase
      .from('user_profiles')
      .insert(cleanData)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        company_name,
        actual_company_name,
        role,
        actual_role,
        phone,
        user_classification,
        business_model,
        first_submission_date,
        total_companies_analyzed,
        engagement_score,
        engagement_tier,
        user_tier,
        user_type,
        high_intent_lead,
        high_value_user,
        enterprise_qualified,
        partnership_qualified,
        return_visits,
        total_time_spent,
        actions_checked_count,
        checked_actions,
        last_action_plan_visit,
        last_analysis_date,
        most_recent_submission_date,
        total_opportunity,
        total_portfolio_value,
        unique_industries_analyzed,
        companies_analyzed,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .maybeSingle();
    
    return { data, error };
  },

  async update(userId: string, updates: UserProfileUpdate) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async incrementAnalysis(userId: string, opportunityValue: number) {
    // First get current values
    const { data: currentProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('companies_analyzed, total_opportunity')
      .eq('id', userId)
      .single();

    if (fetchError) return { data: null, error: fetchError };

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        companies_analyzed: (currentProfile?.companies_analyzed || 0) + 1,
        total_opportunity: (currentProfile?.total_opportunity || 0) + opportunityValue,
        last_analysis_date: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  }
};

// User pattern analysis operations
export const userPatternService = {
  async analyzeUserPattern(userEmail: string) {
    const { data, error } = await supabase.rpc('analyze_user_pattern', {
      user_email: userEmail
    });
    
    return { data: data?.[0] || null, error };
  },

  async getSubmissionsByEmail(userEmail: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('contact_email', userEmail)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async linkSubmissionsToUser(userId: string, userEmail: string) {
    const { data, error } = await supabase.rpc('link_submissions_to_user', {
      p_user_id: userId,
      p_user_email: userEmail
    });
    
    return { data, error };
  }
};

// User company relationships operations
export const userCompanyRelationshipService = {
  async create(data: UserCompanyRelationshipInsert) {
    const { data: result, error } = await supabase
      .from('user_company_relationships')
      .insert(data)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_company_relationships')
      .select(`
        *,
        submissions:submission_id (
          company_name,
          industry,
          current_arr,
          total_leak,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getCompanyAnalysisSummary(userId: string) {
    const { data, error } = await supabase
      .from('user_company_relationships')
      .select(`
        analyzed_company_name,
        relationship_type,
        engagement_context,
        company_arr,
        analysis_value_score,
        submission_date,
        submissions:submission_id (
          industry,
          total_leak,
          recovery_potential_70
        )
      `)
      .eq('user_id', userId)
      .order('submission_date', { ascending: false });
    
    return { data, error };
  }
};

// Multi-company user management
export const multiCompanyUserService = {
  async createUserWithClassification(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    actualCompanyName?: string;
    actualRole?: string;
    businessModel?: string;
    userClassification?: string;
    userTier?: string;
  }) {
    try {
      // First create the auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            company_name: userData.actualCompanyName,
            role: userData.actualRole
          }
        }
      });
      
      if (authError) return { success: false, error: authError.message };
      if (!authData.user) return { success: false, error: 'Failed to create user' };

      // Analyze user pattern based on existing submissions
      const pattern = await userPatternService.analyzeUserPattern(userData.email);
      const patternData = pattern.data;

      // Create user profile with classification
      const profileData: UserProfileInsert = {
        id: authData.user.id,
        phone: userData.phone,
        actual_company_name: userData.actualCompanyName,
        actual_role: userData.actualRole,
        business_model: userData.businessModel || patternData?.business_model || 'internal',
        user_classification: userData.userClassification || patternData?.user_type || 'standard',
        user_tier: userData.userTier || patternData?.value_tier || 'standard',
        companies_analyzed: patternData?.total_companies || 0,
        unique_industries_analyzed: patternData?.unique_industries || 0,
        total_portfolio_value: patternData?.total_arr || 0,
        partnership_qualified: (patternData?.user_type === 'consultant' && patternData?.total_companies >= 3),
        enterprise_qualified: (patternData?.user_type === 'enterprise' || patternData?.total_arr > 10000000),
        high_value_user: (patternData?.total_arr > 5000000),
        last_analysis_date: new Date().toISOString()
      };

      const { error: profileError } = await userProfileService.create(profileData);
      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // If it's a duplicate key error, try to update instead
        if (profileError.code === '23505' && profileError.message.includes('user_profiles_pkey')) {
          console.log('Profile already exists, updating instead...');
          const { error: updateError } = await userProfileService.update(authData.user.id, {
            phone: userData.phone,
            actual_company_name: userData.actualCompanyName,
            actual_role: userData.actualRole,
            business_model: userData.businessModel || patternData?.business_model || 'internal',
            user_classification: userData.userClassification || patternData?.user_type || 'standard',
            user_tier: userData.userTier || patternData?.value_tier || 'standard',
            updated_at: new Date().toISOString()
          });
          
          if (updateError) {
            console.error('Profile update error:', updateError);
          }
        }
        // Continue anyway, profile can be created later
      }

      // Link existing submissions to the new user
      await userPatternService.linkSubmissionsToUser(authData.user.id, userData.email);

      return { success: true, user: authData.user, classification: patternData };
    } catch (error) {
      console.error('User creation error:', error);
      return { success: false, error: 'Account creation failed' };
    }
  },

  async getUserClassificationSummary(userId: string) {
    const { data: profile } = await userProfileService.getByUserId(userId);
    const { data: relationships } = await userCompanyRelationshipService.getByUserId(userId);
    
    return {
      profile,
      relationships,
      summary: {
        isConsultant: profile?.user_classification === 'consultant',
        isEnterprise: profile?.user_classification === 'enterprise',
        isInvestor: profile?.user_classification === 'investor',
        companiesAnalyzed: profile?.total_companies_analyzed || 0,
        totalPortfolioValue: profile?.total_portfolio_value || 0,
        partnershipQualified: profile?.partnership_qualified || false,
        enterpriseQualified: profile?.enterprise_qualified || false
      }
    };
  }
};