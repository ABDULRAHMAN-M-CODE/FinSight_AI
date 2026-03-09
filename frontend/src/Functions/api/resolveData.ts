import type z from "zod";

import { getParsedData } from "./reusable_functions/getParsedData";

/**
 * @param  T                       Return type of the extracted data from the overall parsed Object.
 * @param   ZT                     zod object schema definition for the whole stored object in the local storage, (e.g. typeof FullAdviceSchema, typeof LimitedAdviceSchema, etc.)
 * @param localStorageKey          String that specifies  which exact data to retrive from the local storage, (e.g. "fullAdvice", "limitedAdvice", etc.)
 * @param schema                   Zod Schema that specifies the expected shape of the stored data, used internally for run-time validation, (e.g. "FullAdviceSchema", "LimitedAdviceSchema")
 * @param defaultData        Specifies fallback if data does not exist in local storage or if run time validation fails 
 * @param extractor                extracts specific data of type "T|null|undefined" from the overall stored data (the parsed object);Specifies exact sub-data or fields to be extracted from the overall data
 * @returns                        Either a stored, meaningful data or a fallback,default data. 
 */
export const resolveData=<T, ZT extends z.ZodType >(
    localStorageKey:string, 
    schema:ZT, 
    defaultData:T,
    extractor:(parsedData:z.infer<ZT>|null)=>T|undefined|null 
  ):T=>{
      
      
      const parsedData:z.infer<ZT>|null=getParsedData(localStorageKey,schema);
      
       if (!parsedData) return defaultData;  // If data does not even exist, consider  the defaults
       const extractedData:T|undefined|null=extractor(parsedData);
       return extractedData??defaultData // If data exist but it's not correct, consider the defaults    
}

