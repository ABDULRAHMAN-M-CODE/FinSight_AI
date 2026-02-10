import React from 'react';
import { Home } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';

interface MonthlyBudgetSectionProps {
  budget: string;
  onUpdate: (budget: string) => void;
}

export const MonthlyBudgetSection: React.FC<MonthlyBudgetSectionProps> = ({ 
  budget, 
  onUpdate 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Household Budget</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              What is your total monthly household spending?
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="monthly-budget">Monthly Budget</Label>
          <Input
            id="monthly-budget"
            placeholder="$8,500"
            value={budget}
            onChange={(e) => onUpdate(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Include all housing, food, transportation, utilities, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
