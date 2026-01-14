Currently , I have 8 Tables in the Data base for my System : 
TABLE 1: goals
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: goals                                                             │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ user_id           │ UUID         │ AUTO (from auth system)              │
│ goal_name         │ VARCHAR(255) │ 👤 USER PROVIDED (form input)        │
│ goal_type         │ VARCHAR(50)  │ 👤 USER PROVIDED (short/long term)   │
│ target_amount     │ DECIMAL      │ 👤 USER PROVIDED (form input)        │
│ current_amount    │ DECIMAL      │ 🖥️ BACKEND COMPUTED (from accounts)  │
│ deadline          │ DATE         │ 👤 USER PROVIDED (form input)        │
│ created_at        │ TIMESTAMP    │ AUTO-GENERATED (database)            │
│ updated_at        │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘

NOTES:
- current_amount: Backend tracks/aggregates from linked accounts or manual updates
- Backend updates current_amount whenever user saves money toward this goal

TABLE 2: ai_goal_insights
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: ai_goal_insights                                                  │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ goal_id           │ UUID         │ FOREIGN KEY → goals.id               │
│ user_id           │ UUID         │ FOREIGN KEY → users                  │
│ ai_insight        │ TEXT         │ 🤖 AI COMPUTED (LLM generates)       │
│ generated_at      │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘

NOTES:
- ai_insight: Only generated for goals that are "behind schedule"
- AI analyzes: (target_amount - current_amount) vs (deadline - today) vs savings_rate
- Example: "At your current savings rate of $500/month, you're $2,000 short..."


TABLE 3: health_score_snapshots
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: health_score_snapshots                                            │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ user_id           │ UUID         │ FOREIGN KEY → users                  │
│ overall_score     │ INTEGER      │ 🖥️ BACKEND COMPUTED (formula)        │
│ calculated_at     │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘

BACKEND CALCULATION FORMULA:
overall_score = weighted average of:
  - Cash Flow Score (33%): based on savings_rate from existing data
  - Debt Score (33%): based on outstanding_debts debt-to-income ratio
  - Goals Score (33%): average progress across all goals
  
USES EXISTING DATA:
  - monthly_income, monthly_expenses, savings_rate
  - outstanding_debts (balance, monthly_payment, interest_rate)
  - goals (current_amount, target_amount, deadline)

TABLE 4: ai_reassurance_messages
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: ai_reassurance_messages                                           │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ user_id           │ UUID         │ FOREIGN KEY → users                  │
│ message_text      │ TEXT         │ 🤖 AI COMPUTED (LLM generates)       │
│ generated_at      │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘

NOTES:
- message_text: Personalized reassurance based on health score
- AI analyzes overall financial picture and generates encouraging message
- Example: "You're making solid progress! Your 18% savings rate is above average..."


TABLE 5: limited_advice (Already Exists)
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: limited_advice                                                    │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ user_id           │ UUID         │ FOREIGN KEY                          │
│ monthly_income    │ DECIMAL      │ 👤 USER PROVIDED                     │
│ monthly_expenses  │ DECIMAL      │ 👤 USER PROVIDED                     │
│ savings_rate      │ DECIMAL      │ 🖥️ BACKEND COMPUTED                  │
│ savings_cta       │ TEXT         │ 🤖 AI COMPUTED                       │
│ recommendations   │ JSONB        │ 🤖 AI COMPUTED                       │
│ projections       │ JSONB        │ 🖥️ BACKEND COMPUTED                  │
└───────────────────┴──────────────┴──────────────────────────────────────┘
TABLE 6: user_financial_


TABLE 6: user_financial_data (Already Exists)
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: user_financial_data                                               │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ user_id           │ UUID         │ FOREIGN KEY                          │
│ household_income  │ DECIMAL      │ 👤 USER PROVIDED                     │
│ income_sources    │ JSONB        │ 👤 USER PROVIDED                     │
│ monthly_budget    │ DECIMAL      │ 👤 USER PROVIDED                     │
│ investment_accts  │ JSONB        │ 👤 USER PROVIDED                     │
│ outstanding_debts │ JSONB        │ 👤 USER PROVIDED                     │
│ life_insurance    │ JSONB        │ 👤 USER PROVIDED                     │
└───────────────────┴──────────────┴──────────────────────────────────────┘

DEBT FIELDS (within JSONB):
  - balance: 👤 USER PROVIDED
  - monthly_payment: 👤 USER PROVIDED
  - interest_rate: 👤 USER PROVIDED
  - annual_interest_cost: 🖥️ BACKEND COMPUTED (balance × interest_rate)

TABLE 7: investment_accounts
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: investment_accounts                                               │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ user_id           │ UUID         │ FOREIGN KEY → users.id               │
│ account_name      │ VARCHAR(255) │ 👤 USER PROVIDED                     │
│ account_type      │ VARCHAR(50)  │ 👤 USER PROVIDED                     │
│ current_value     │ DECIMAL      │ 👤 USER PROVIDED                     │
│ risk_level        │ VARCHAR(20)  │ 🤖 AI COMPUTED                       │
│ is_active         │ BOOLEAN      │ 👤 USER PROVIDED (default: true)     │
│ created_at        │ TIMESTAMP    │ AUTO-GENERATED (database)            │
│ updated_at        │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘

TABLE 8: investment_performance_snapshots
┌─────────────────────────────────────────────────────────────────────────┐
│ TABLE: investment_performance_snapshots                                  │
├───────────────────┬──────────────┬──────────────────────────────────────┤
│ FIELD             │ TYPE         │ SOURCE                               │
├───────────────────┼──────────────┼──────────────────────────────────────┤
│ id                │ UUID         │ AUTO-GENERATED (database)            │
│ user_id           │ UUID         │ FOREIGN KEY → users.id               │
│ snapshot_year     │ INTEGER      │ 🖥️ BACKEND COMPUTED                  │
│ snapshot_date     │ DATE         │ 🖥️ BACKEND COMPUTED                  │
│ portfolio_value   │ DECIMAL      │ 🖥️ BACKEND COMPUTED                  │
│ return_percentage │ DECIMAL      │ 🖥️ BACKEND COMPUTED                  │
│ risk_level        │ VARCHAR(20)  │ 🖥️ BACKEND COMPUTED                  │
│ created_at        │ TIMESTAMP    │ AUTO-GENERATED (database)            │
└───────────────────┴──────────────┴──────────────────────────────────────┘