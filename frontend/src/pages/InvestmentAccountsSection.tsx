import React from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';

import { IconButton } from './IconButton';
import type { InvestmentAccount } from './financial';

interface InvestmentAccountsSectionProps {
  accounts: InvestmentAccount[];
  onUpdate: (accounts: InvestmentAccount[]) => void;
}

export const InvestmentAccountsSection: React.FC<InvestmentAccountsSectionProps> = ({ 
  accounts, 
  onUpdate 
}) => {
  const updateAccount = (id: string, field: keyof InvestmentAccount, value: string | boolean) => {
    const updatedAccounts = accounts.map(acc => 
      acc.id === id ? { ...acc, [field]: value } : acc
    );
    onUpdate(updatedAccounts);
  };

  const addAccount = () => {
    const newAccount: InvestmentAccount = {
      id: Date.now().toString(),
      accountName: '',
      accountType: '',
      currentBalance: '',
      isActive: true
    };
    onUpdate([...accounts, newAccount]);
  };

  const removeAccount = (id: string) => {
    if (accounts.length > 1) {
      onUpdate(accounts.filter(acc => acc.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Investment Accounts</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              List your investment accounts and their current balances
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account, index) => (
          <div key={account.id} className="space-y-3 p-4 border border-gray-200 rounded-lg relative">
            {accounts.length > 1 && (
              <IconButton
                variant="danger"
                onClick={() => removeAccount(account.id)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`account-name-${account.id}`}>Account Name</Label>
                <Input
                  id={`account-name-${account.id}`}
                  name={`accounts[${index}][name]`}
                  placeholder="e.g., Vanguard 401(k)"
                  value={account.accountName}
                  onChange={(e) => updateAccount(account.id, 'accountName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`account-type-${account.id}`}>Account Type</Label>

              <select
                id={`account-type-${account.id}`}
                name={`accounts[${index}][type]`}
                required
                value={account.accountType} // <- controlled
                onChange={(e) => updateAccount(account.id, 'accountType', e.target.value)} // <- update state
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select account type</option>
                <option value="401k">401(k)</option>
                <option value="Roth401k">Roth 401(k)</option>
                <option value="IRA">IRA</option>
                <option value="RothIRA">Roth IRA</option>
                <option value="SEPIRA">SEP IRA</option>
                <option value="SimpleIRA">Simple IRA</option>
                <option value="Brokerage">Brokerage Account</option>
                <option value="529Plan">529 College Savings Plan</option>
                <option value="HSA">Health Savings Account (HSA)</option>
                <option value="Trust">Trust Account</option>
                <option value="Joint">Joint Account</option>
                <option value="Custodial">Custodial Account</option>
                <option value="Annuity">Annuity</option>
                <option value="CD">Certificate of Deposit (CD)</option>
                <option value="MoneyMarket">Money Market Account</option>
                <option value="Savings">Savings Account</option>
                <option value="Checking">Checking Account</option>
                <option value="Other">Other</option>
              </select>
            
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`account-balance-${account.id}`}>Current Balance</Label>
                
                <Input
                  
                  id={`account-balance-${account.id}`}

                  name={`accounts[${index}][current_balance]`}
                  placeholder="$85,000"
                  type='number'
                  value={account.currentBalance}
                  onChange={(e) => updateAccount(account.id, 'currentBalance', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`account-status-${account.id}`}>Account Status</Label>
                <div className="flex items-center gap-3 h-10">
                    <input 
                      type="checkbox" 
                      name={`accounts[${index}][is_active]`} // Pydantic shcema expects 'is_active'
                      checked={account.isActive}
                      onChange={(e) => updateAccount(account.id, 'isActive', e.target.checked)}
                    />
                  
                  <span className="text-sm text-gray-700">
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button variant="link" onClick={addAccount} className="p-0" type='button'>
          + Add another investment account
        </Button>
      </CardContent>
    </Card>
  );
};
