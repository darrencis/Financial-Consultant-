# HiveTwin Backend

Canadian personal finance app backend. User profile input → AI investment recommendations → commit tracking.

## Run

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Set OPENAI_API_KEY
uvicorn main:app --reload --port 8000
```

## Postman Test Flow

1. **POST** `http://localhost:8000/api/users`  
   Body: `{"name":"John","persona":"employed","annual_income":72000,"province":"BC","age":28,"financial_goals":"Save for a house","existing_savings":5000,"monthly_rent":2000,"monthly_expenses":500,"tfsa_room":7000,"rrsp_room":15000}`  
   → Save the `id` from response

2. **GET** `http://localhost:8000/api/rates`  
   → Verify rates are loading (check `is_fallback`)

3. **POST** `http://localhost:8000/api/users/{user_id}/inflows`  
   Body: `{"amount":5000,"source":"salary","notes":"Monthly paycheck"}`  
   → Save the `id` from response

4. **POST** `http://localhost:8000/api/users/{user_id}/inflows/{inflow_id}/recommend`  
   → Returns 2–4 recommendation cards. Save `card_id`, `account_type`, `annual_return_pct`

5. **POST** `http://localhost:8000/api/users/{user_id}/commit`  
   Body: `{"inflow_id":"...","card_id":"...","amount":3000,"account_type":"tfsa","annual_return_pct":6.5}`

6. **GET** `http://localhost:8000/api/users/{user_id}/dashboard`

7. **GET** `http://localhost:8000/api/health`

## Smoke Test

```bash
cd backend && python -m tests.smoke_test
```
 
## Seed Data

```bash
cd backend && python seed.py
```
