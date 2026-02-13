import { ArrowRight } from "lucide-react";

export default function BackAndContinueButtons({handleBack}:{handleBack:()=>void}){
    return(
               <div className="flex gap-4 justify-center translate-y-12">
                  <button
                    onClick={handleBack}
                    type="button"
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors flex items-center gap-2  disabled:cursor-not-allowed disabled:opacity-50"
                  >
                      Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>        
    )
}