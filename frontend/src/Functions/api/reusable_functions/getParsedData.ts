import { type FullServiceAdviceContract } from "../../../Types/FullServiceAdviceContract";
import { getFullAdviceSchema } from "./getFullAdviceSchema";

export const getParsedData=():FullServiceAdviceContract|null=>{
    const fullAdviceSchema= getFullAdviceSchema();// run time validation
    
    // saved is a string to be parsed later
    const saved: string|null = localStorage.getItem("fullAdvice"); // what must be the type of the save constant ?
    let parsedData: FullServiceAdviceContract | null = null;
    
    // if this block is not executed, default data will feed the UI to prevent UI failure.
    if (saved){ // checks the existence of the data
      try{
        const raw=JSON.parse(saved);
        const result=fullAdviceSchema.safeParse(raw); // run time validation, checks the correctness of the  existing data
        if(result.success){
          console.log("nice!. run time validation succeed!")
          parsedData=result.data;
        }
        if (!result.success) {
            console.error("Zod Validation Errors:", result.error.format());
          }
      }catch(error){
        console.log("JSON.parse() parsing failed",error);
        parsedData=null;
      }
      
    }
    return parsedData
}