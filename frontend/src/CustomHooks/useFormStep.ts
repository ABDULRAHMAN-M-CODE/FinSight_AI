import { type SubmittedUserInfoDuringDemo } from "../Types/SubmittedUserInfoDuringDemo";
export default function useFormStep({investment_accounts,financial_goals }: SubmittedUserInfoDuringDemo){
   const payload = {
    investment_accounts: investment_accounts,
    financial_goals:financial_goals, 
   };

   const url="http://127.0.0.1:8000/demo/demo"
   
   const localStorageKey="Demo_Data";
   return {
    payload,
    url,
    localStorageKey
   }

}