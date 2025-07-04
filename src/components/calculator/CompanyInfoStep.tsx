import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyInfo } from "./useCalculatorData";
import { Building2, Mail, DollarSign } from "lucide-react";

interface CompanyInfoStepProps {
  data: CompanyInfo;
  onUpdate: (updates: Partial<CompanyInfo>) => void;
}

export const CompanyInfoStep = ({ data, onUpdate }: CompanyInfoStepProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Company Information
          </CardTitle>
          <CardDescription>
            Tell us about your company to provide personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={data.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="Enter your company name"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder="your.email@company.com"
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={data.industry} onValueChange={(value) => onUpdate({ industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="services">Professional Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-arr">Current Annual Recurring Revenue (ARR)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-arr"
                type="number"
                value={data.currentARR || ""}
                onChange={(e) => onUpdate({ currentARR: Number(e.target.value) })}
                placeholder="1000000"
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <p className="text-sm text-muted-foreground">Enter your annual recurring revenue in USD</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-revenue-success">110%</div>
              <p className="text-sm text-muted-foreground">Average NRR Benchmark</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">78%</div>
              <p className="text-sm text-muted-foreground">Gross Margin Benchmark</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-revenue-warning">32%</div>
              <p className="text-sm text-muted-foreground">Growth Rate Benchmark</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};