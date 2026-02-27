import type z from "zod";

// Context: This function was hard to make, because I'm a novice, I wrote two codes that do the same Logic ;getting data from local storage and feed it to the UI, in the past I wrote individual codes to get data from different local storage locations, now single function -in theory- can handle this 
export const getParsedData=< ZT extends z.ZodType>(localStorageKey:string,schema:ZT):z.infer<ZT>|null=>{
       
    const saved: string|null = localStorage.getItem(localStorageKey); 
    let parsedData:z.infer<ZT> | null = null;
    
    // if this 'if-statement' block is not executed, default data will feed the UI to prevent UI failure.
    
    if (saved){ // checks the 'existence' of the data
      try{
        const raw=JSON.parse(saved); // returns unknown object
        const result=schema.safeParse(raw); // run time validation on the unknown data, checks the 'correctness' of the  existing data
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