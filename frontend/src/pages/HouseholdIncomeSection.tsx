import React from 'react';
import { Home } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';
import type { HouseholdMember } from '../types/financial';

interface HouseholdIncomeSectionProps {
  members: HouseholdMember[];
  onUpdate: (members: HouseholdMember[]) => void;
}

export const HouseholdIncomeSection: React.FC<HouseholdIncomeSectionProps> = ({ 
  members, 
  onUpdate 
}) => {
  const updateMember = (index: number, field: keyof HouseholdMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    onUpdate(updatedMembers);
  };

  const addMember = () => {
    onUpdate([...members, { member_name: '', annual_income: 0, income_source: '' }]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Household Income</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Tell us about the annual income sources for each member of your household
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="space-y-3 pb-4 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`member-name-${index}`}>Member Name</Label>
                <Input
                  id={`member-name-${index}`}
                  type='text'
                  pattern="^[A-Za-z\s]+$"
                  placeholder="e.g., John Doe"
                  value={member.member_name}
                  onChange={(e) => updateMember(index, 'member_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`member-income-${index}`}>Annual Income</Label>
                <Input
                  id={`member-income-${index}`}
                  type='number'
                  placeholder="$120,000"
                  value={member.annual_income}
                  onChange={(e) => updateMember(index, 'annual_income', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`member-source-${index}`}>Income Source</Label>
              <Input
                id={`member-source-${index}`}
                pattern="^[A-Za-z\s]+$"
                placeholder="e.g., Salary, Business, Investments"
                value={member.income_source}
                onChange={(e) => updateMember(index, 'income_source', e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button variant="link" onClick={addMember} className="p-0">
          + Add another household member
        </Button>
      </CardContent>
    </Card>
  );
};
