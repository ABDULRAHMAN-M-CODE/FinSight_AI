import { type setupProps } from "../../../Types/setupProps";
export const setup=({e, setIsLoading}:setupProps )=>{
        // Setup : responsibility 1
      e.preventDefault();
      setIsLoading(true);
}