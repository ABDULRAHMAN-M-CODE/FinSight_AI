import { type FetchDataProps } from "../../Types/FetchDataProps";
export  const FetchData = async ( {payload, url}: FetchDataProps)=>{
    
      //  Example of url : "http://127.0.0.1:8000/demo/demo"        
      const response = await fetch(url, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    
     return response;
};