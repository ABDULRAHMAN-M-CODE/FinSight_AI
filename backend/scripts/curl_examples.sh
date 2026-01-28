#!/usr/bin/env bash
# Curl examples to exercise the API (adjust host/port if different)

HOST="http://localhost:8000"

echo "1) Submit questionnaire (signup_completed true) -> creates user + user_financial_data"
curl -s -X POST "$HOST/questionnaire/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "household_income": 6000.00,
    "income_sources": [{"source":"salary","amount":6000}],
    "monthly_budget": 3500.00,
    "investment_accts": [{"account_name":"Brokerage","current_value":15000}],
    "outstanding_debts": [{"name":"student_loan","balance":10000,"monthly_payment":150,"interest_rate":0.05}],
    "signup_completed": true
  }' | jq

echo
echo "2) Run a simulation (replace USER_ID with value from step1 or seed script)"
echo "Example payload below (replace USER_ID)"
cat <<EOF
curl -s -X POST "$HOST/simulations/run" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID",
    "scenario_text": "What if I invest $15k in high-risk stocks for 5 years instead of paying off my student loan?",
    "run_async": true,
    "max_iterations": 12
  }' | jq
EOF
echo

echo "3) Get simulation history"
echo "curl \"$HOST/simulations/history?user_id=USER_ID\" | jq"

echo
echo "4) Trigger alerts monitor for a user"
echo "curl -s -X POST \"$HOST/alerts/monitor\" -H \"Content-Type: application/json\" -d '{\"user_id\":\"USER_ID\"}' | jq"

echo
echo "Notes:"
echo "- Use jq to pretty-print JSON responses (install jq if needed)"
echo "- Replace USER_ID with actual UUID returned by seed or questionnaire endpoint"