import type React from "react"
import { type InvestmentAccount } from "./InvestmentAccount";
import { type Goal } from "./Goal";

export type FetchDataProps={
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setFinishedProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setFinishedOnboarding:React.Dispatch<React.SetStateAction<boolean>>;
    investmentAccounts:InvestmentAccount[];
    goals:Goal[];
}