
import { type FetchDataProps } from "../../Types/FetchDataProps";

export  const FetchData = async ( {payload, url}: FetchDataProps)=>{
    
             
      const response = await fetch(url, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include", 
        body: JSON.stringify(payload),
      });

    
     return response;
};