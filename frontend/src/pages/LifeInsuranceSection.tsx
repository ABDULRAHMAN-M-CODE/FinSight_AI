import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import type { InsuranceInfo } from '../types/financial';

interface LifeInsuranceSectionProps {
  insurance: InsuranceInfo;
  onUpdate: (insurance: InsuranceInfo) => void;
}

export const LifeInsuranceSection: React.FC<LifeInsuranceSectionProps> = ({ 
  insurance, 
  onUpdate 
}) => {
  const updateField = (field: keyof InsuranceInfo, value: string) => {
    onUpdate({ ...insurance, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Life Insurance Coverage</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Details about your life insurance policies
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="insurance-type">Insurance Type</Label>
          <Input
            id="insurance-type"
            pattern="[A-Za-z\s]+"
            placeholder="e.g., Term, Whole Life, Universal"
            value={insurance.insurance_type}
            onChange={(e) => updateField('insurance_type', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="death-benefit">Death Benefit</Label>
            <Input
              id="death-benefit"
              placeholder="$500,000"
              value={insurance.death_benefit}
              onChange={(e) => updateField('death_benefit', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cash-value">Cash Value</Label>
            <Input
              id="cash-value"
              placeholder="$12,000"
              value={insurance.cash_value}
              onChange={(e) => updateField('cash_value', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly-premium">Monthly Premium</Label>
            <Input
              id="monthly-premium"
              placeholder="$125"
              value={insurance.monthly_premium}
              onChange={(e) => updateField('monthly_premium', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
