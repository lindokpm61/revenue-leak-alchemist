import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Target, Zap, BarChart3 } from "lucide-react";
import { CalculatorData, Calculations } from "../useCalculatorData";

interface ExecutiveSummaryProps {
  data: CalculatorData;
  calculations: Calculations;
  formatCurrency: (amount: number) => string;
}

export const ExecutiveSummary = ({ data, calculations, formatCurrency }: ExecutiveSummaryProps) => {
  // Safe access helper
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const currentARR = safeNumber(data.companyInfo?.currentARR);
  const potentialRecovery70 = safeNumber(calculations.potentialRecovery70);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Total Revenue Leak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-destructive leading-none mb-2">
            {formatCurrency(calculations.totalLeakage)}
          </p>
          <p className="text-sm text-muted-foreground">annual loss</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-revenue-success" />
            Recovery 70%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-revenue-success leading-none mb-2">
            {formatCurrency(calculations.potentialRecovery70)}
          </p>
          <p className="text-sm text-muted-foreground">conservative estimate</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Recovery 85%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary leading-none mb-2">
            {formatCurrency(calculations.potentialRecovery85)}
          </p>
          <p className="text-sm text-muted-foreground">optimistic estimate</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-revenue-success" />
            ROI Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-revenue-success leading-none mb-2">
            {currentARR > 0 
              ? Math.round((potentialRecovery70 / currentARR) * 100)
              : 0}%
          </p>
          <p className="text-sm text-muted-foreground">of current ARR</p>
        </CardContent>
      </Card>
    </div>
  );
};