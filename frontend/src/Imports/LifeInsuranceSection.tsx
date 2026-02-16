import React from 'react';
import { Shield, Plus, Trash } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';


import type { InsuranceInfo } from '../Types/InsuranceInfo';
interface LifeInsuranceSectionProps {
  insuranceList: InsuranceInfo[];
  onUpdate: (insuranceList: InsuranceInfo[]) => void;
}

export const LifeInsuranceSection: React.FC<LifeInsuranceSectionProps> = ({
  insuranceList,
  onUpdate
}) => {

  const updateField = (index: number, field: keyof InsuranceInfo, value: string) => {
    const updatedList = [...insuranceList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    onUpdate(updatedList);
  };

  const addInsurance = () => {
    onUpdate([
      ...insuranceList,
      { insurance_type: '', death_benefit: 0, cash_value: 0, monthly_premium: 0 }
    ]);
  };

  const removeInsurance = (index: number) => {
    const updatedList = insuranceList.filter((_, i) => i !== index);
    onUpdate(updatedList);
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
      <CardContent className="space-y-6">
        {insuranceList.map((insurance, index) => (
          <div key={index} className="border p-4 rounded-md space-y-4 relative">
            {insuranceList.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => removeInsurance(index)}
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
            <div className="space-y-2">
              <Label htmlFor={`insurance-type-${index}`}>Insurance Type</Label>
              <Input
                id={`insurance-type-${index}`}
                pattern="[A-Za-z\s]+"
                placeholder="e.g., Term, Whole Life, Universal"
                value={insurance.insurance_type}
                onChange={(e) => updateField(index, 'insurance_type', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`death-benefit-${index}`}>Death Benefit</Label>
                <Input
                  id={`death-benefit-${index}`}
                  placeholder="$500,000"
                  value={insurance.death_benefit}
                  onChange={(e) => updateField(index, 'death_benefit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cash-value-${index}`}>Cash Value</Label>
                <Input
                  id={`cash-value-${index}`}
                  placeholder="$12,000"
                  value={insurance.cash_value}
                  onChange={(e) => updateField(index, 'cash_value', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`monthly-premium-${index}`}>Monthly Premium</Label>
                <Input
                  id={`monthly-premium-${index}`}
                  placeholder="$125"
                  value={insurance.monthly_premium}
                  onChange={(e) => updateField(index, 'monthly_premium', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addInsurance} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Another Policy
        </Button>
      </CardContent>
    </Card>
  );
};
