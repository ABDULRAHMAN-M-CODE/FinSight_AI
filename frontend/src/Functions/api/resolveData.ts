import { type FullServiceAdviceContract } from "../../Types/FullServiceAdviceContract";
import { getParsedData } from "./reusable_functions/getParsedData";
export const resolveData=<T, >(
    defaultData:T,
    extractor:(data:FullServiceAdviceContract|null)=>T|undefined|null 
  ):T=>{
      
      const parsedData:FullServiceAdviceContract|null=getParsedData();
      
       if (!parsedData) return defaultData;  
       const extractedData:T|undefined|null=extractor(parsedData);
       return extractedData??defaultData    
}