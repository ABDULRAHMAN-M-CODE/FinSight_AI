import React from 'react';
import { Home , Trash2} from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';
import type { HouseholdMember } from '../Types/HouseHoldMember';
import { IconButton } from './IconButton';
interface HouseholdIncomeSectionProps {
  members: HouseholdMember[];
  onUpdate: (members: HouseholdMember[]) => void;
}

/**
 * 
 * @param members : array of cards , each card is a memeber
 * @param onUpdate :function that updates the array to add or remove members
 * @returns 
 */
/** this function currently mixes Logic with rendering, now it works ,  we must Separate them  for better redablity */
export const HouseholdIncomeSection: React.FC<HouseholdIncomeSectionProps> = ({ 
  members, 
  onUpdate 
}) => {
  /**Logic */
  const updateMember = (index: number, field: keyof HouseholdMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    onUpdate(updatedMembers);
  };

  // new array  contains a  copy version "spreaded"  of  the old members and add additional fresh memebr object.

    const addMember = () => {
      const newMeber: HouseholdMember = {
        id: Date.now(), /** to make all id's unique, give all field a specific value of the number of milliseconds ellapsed since 1970 */
        member_name: '',
        annual_income: 0,
        income_source: ''
      };
      onUpdate([...members, newMeber]);
    };

  // render all memebrs except the unwanted 'removed' member.
  const removeMember = (id: number) => {
    if (members.length > 1) {
      onUpdate(members.filter(m => m.id !== id));
    }
  };

  /**Rendering */
  return (
    <Card>

      {/**Logo or icon and some text exist here */}
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
     
     {/** Inputs are here */}
      <CardContent className="space-y-4">
        
        {members.map((member, index) => (
          
          <div key={index} className="space-y-3 pb-4 border-b last:border-b-0 relative">
            
            {/**Conditionally rendering  for  the trash icon  , relative to it's parent */}
            {members.length > 1 && (
              <IconButton
                variant="danger"
                onClick={() => removeMember(member.id)}
                className="absolute -top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            )}
            
            {/**member name */}
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
            
            {/** Income source */}
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

        ))} {/** end of the map function */}
        
        {/** add another card or member */}
        <Button variant="link" onClick={addMember} className="p-0">
          + Add another household member
        </Button>

      </CardContent>

    </Card>
  );
};
