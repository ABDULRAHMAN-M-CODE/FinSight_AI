import type React from "react"
import { type InvestmentAccount } from "./financial";
import { type Goal } from "./financial";
export type GenerateAdviceProps={
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setFinishedProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setFinishedOnboarding:React.Dispatch<React.SetStateAction<boolean>>;
    investmentAccounts:InvestmentAccount[];
    goals:Goal[];
}