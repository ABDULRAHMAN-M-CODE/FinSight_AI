import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { type  Debt } from '../Types/Debt';

interface OutstandingDebtsSectionProps {
  debts: Debt[];
  onUpdate: (debts: Debt[]) => void;
}

export const OutstandingDebtsSection: React.FC<OutstandingDebtsSectionProps> = ({ 
  debts, 
  onUpdate 
}) => { const updateDebt = (id: number, field: keyof Debt, value: string|number) => {
    const updatedDebts = debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    );
    onUpdate(updatedDebts);
  };

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now(),
      type: '',
      balance: 0,
      monthly_payment:0,
      interest_rate: 0
    };
    onUpdate([...debts, newDebt]);
  };

  const removeDebt = (id: number) => {
    if (debts.length > 1) {
      onUpdate(debts.filter(debt => debt.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Outstanding Debts</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              List any debts including balances, monthly payments, and interest rates
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {debts.map((debt) => (
          <div key={debt.id} className="space-y-3 p-4 border border-gray-200 rounded-lg relative">
            {debts.length > 1 && (
              <IconButton
                variant="danger"
                onClick={() => removeDebt(debt.id)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            )}
            <div className="space-y-2">
              <Label htmlFor={`debt-type-${debt.id}`}>Debt Type</Label>
              
              {/**  problem : make this select element instead of input */}
              <Input
                id={`debt-type-${debt.id}`}
                pattern="[A-Za-z\s]+"
                placeholder="e.g., Mortgage, Student Loan, Credit Card"
                value={debt.type}
                onChange={(e) => updateDebt(debt.id, 'type',e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`debt-balance-${debt.id}`}>Balance</Label>
                <Input
                  id={`debt-balance-${debt.id}`}
                  type='number'
                  placeholder="$350,000"
                  value={debt.balance}
                  onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value)) }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`debt-payment-${debt.id}`}>Monthly Payment</Label>
                <Input
                  id={`debt-payment-${debt.id}`}
                  type='number'
                  placeholder="$2,100"
                  min={(debt.balance*(debt.interest_rate))+1} /** it's a rule that governs the value of the monthly_payment  to ensure the debt is paidoff eventually */
                  value={debt.monthly_payment}
                  onChange={(e) => updateDebt(debt.id, 'monthly_payment', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`debt-rate-${debt.id}`}>Interest Rate</Label>
                <Input
                  id={`debt-rate-${debt.id}`}
                  type='number'
                  min={0}
                  max={1}
                  step={0.001}
                  placeholder="0.001, 0.002,etc..."
                  value={debt.interest_rate}
                  onChange={(e) => updateDebt(debt.id, 'interest_rate', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="link" onClick={addDebt} className="p-0">
          + Add another debt
        </Button>
      </CardContent>
    </Card>
  );
};
