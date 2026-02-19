import { type extractAndSaveDataToLocalStorageProps } from "../../../Types/extractAndSaveDataToLocalStorageProps";

/**
 * 
 * @param response : Result of  of the 'FetchData' function  
 * @param dataNameKey : local storage stores data in key : value fashion. user can specify any key he wants
 *  
 */
export const extractAndSaveDataToLocalStorage = async <T>({response, localStorageKey}:extractAndSaveDataToLocalStorageProps) => {
    const data: T = await response.json();
    localStorage.setItem(localStorageKey, JSON.stringify(data));
};