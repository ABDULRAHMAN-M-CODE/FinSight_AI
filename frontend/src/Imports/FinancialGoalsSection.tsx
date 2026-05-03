import React from 'react';
import { Target, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';
import { Select } from './Select';
import { IconButton } from './IconButton';
import { type Goal } from '../Types/Goal';

interface FinancialGoalsSectionProps {
  goals: Goal[];
  onUpdate: (goals: Goal[]) => void;
  isLoading:boolean
}

export const FinancialGoalsSection: React.FC<FinancialGoalsSectionProps> = ({ 
  goals, 
  onUpdate,
  isLoading 
}) => {
  const updateGoal = (id: number, field: keyof Goal, value: Goal[keyof Goal] )=> {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    );
    onUpdate(updatedGoals);
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now(),
      name: '',
      type: 'short-term',
      target_amount: 0,
      deadline: ''
    };
    onUpdate([...goals, newGoal]);
  };

  const removeGoal = (id: number) => {
    if (goals.length > 1) {
      onUpdate(goals.filter(goal => goal.id !== id));
    }
  };

  return (
    <Card>

      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Financial Goals</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Share your short-term and long-term financial objectives
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
       
        {goals.map((goal, index) => (
          
            /** this container must be 'relative' for the trash icon to be visiable */
          <div key={goal.id} className="space-y-3 p-4 border border-gray-200 rounded-lg relative">
            
            {/**conditionally render the trash icon only when there is more than one card */}
            {goals.length > 1 && (
              <IconButton
                variant="danger"
                onClick={() => removeGoal(goal.id)}
                className="absolute top-2 right-2"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`goal-name-${goal.id}`}>Goal Name</Label>
                <Input
                  id={`goal-name-${goal.id}`}
                  name={`goals[${index}][name]`}
                  placeholder="e.g., Build emergency fund"
                  type='text'
                  value={goal.name}
                  onChange={(e) => updateGoal(goal.id, 'name',   e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`goal-type-${goal.id}`}>Goal Type</Label>
                <Select
                  id={`goal-type-${goal.id}`}
                  name={`goals[${index}][type]`}
                  value={goal.type}
                  onChange={(e) => updateGoal(goal.id, 'type', e.target.value as 'short-term' | 'long-term')}
                  disabled={isLoading}
                >
                  <option value="short-term">Short-term (0-5 years)</option>
                  <option value="long-term">Long-term (5+ years)</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`goal-amount-${goal.id}`}>Target Amount</Label>
                <Input
                  id={`goal-amount-${goal.id}`}
                  name={`goals[${index}][target_amount]`}
                  placeholder="$50,000"
                  value={goal.target_amount}
                  disabled={isLoading}
                  type='number'
                  onChange={(e) => updateGoal(goal.id, 'target_amount', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`goal-deadline-${goal.id}`}>Deadline</Label>
                <Input
                  id={`goal-deadline-${goal.id}`}
                  name={`goals[${index}][deadline]`}
                  type="date"
                  disabled={isLoading}
                  value={goal.deadline}
                  onChange={(e) => updateGoal(goal.id, 'deadline', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="link" onClick={addGoal} className="p-0" type='button' disabled={isLoading}>
          + Add another goal
        </Button>
      
      </CardContent>
    </Card>
  );
};
