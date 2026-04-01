import { type extractAndSaveDataToLocalStorageProps } from "../../../Types/extractAndSaveDataToLocalStorageProps";

/**
 * 
 * @param response : Result of  of the 'FetchData' function  before doing response.json()
 * @param dataNameKey :Local storage stores data in ' key : value' fashion. user can specify any key he wants
 * Function usage  example :  await extractAndSaveDataToLocalStorage< specify type here > (specify the two parameters here)
 */

// Problem : specify the  type that this function return, I think it must be void.

export const extractAndSaveDataToLocalStorage = async <T>({response, localStorageKey}:extractAndSaveDataToLocalStorageProps) => {
    const data: T = await response.json();// extracting
    localStorage.setItem(localStorageKey, JSON.stringify(data));// storing response as key:value in the local storage
};