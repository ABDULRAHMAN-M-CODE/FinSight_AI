import React from "react";
//import { useNavigate } from "react-router";
import {  Slider } from "./ui";

export type SubjectiveQuestionsType={
    questionId: number;
    questionTitle: string;
    questionText: string;
    questionWeight:number;
    answerOptions: {
        answerOptionText: string;
        answerOptionValue: number;
    }[];
}[]

export type SubjectiveQuestionAnswer={
  questionId:number;
  answerValue:number; // should I rename this 
}
type   RiskAssessmentProps={
  answers: SubjectiveQuestionAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction< SubjectiveQuestionAnswer[]  > >;
  sliderValue: number;
  setSliderValue: React.Dispatch< React.SetStateAction< number > >;
  subjectiveQuestions:SubjectiveQuestionsType;
}
function useRiskAssessment( setAnswers:  React.Dispatch<React.SetStateAction<SubjectiveQuestionAnswer[]>>  ){
  
  const handleSelectChange = (questionId: number, answerValue:number) => {
      setAnswers(prevAnswers=>

        prevAnswers.map(prevAnswer=>
          prevAnswer.questionId==questionId ? {...prevAnswer, answerValue} : prevAnswer
        )
      )
        
      
  };


  return{
    handleSelectChange,
  }
}


export default function RiskAssessment({answers,setAnswers,sliderValue,setSliderValue,subjectiveQuestions}:RiskAssessmentProps ) {


  const {handleSelectChange}=useRiskAssessment(setAnswers);

  return (
    <div className="max-w-4xl mx-auto w-full">
     
      <div className={`bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden`}>
        
        <div className={`px-6 py-5 border-b border-gray-100 `}>
          <h3 className={`text-lg font-semibold text-gray-900 `}>Personalize your portfolio recommendations</h3>
          <p className="text-sm text-gray-500 mt-1">We need  you to answer some  subjective questions to select the best-fit Investemnts that matches your prefrences and needs</p>
        </div>
 
        <div className={`p-6 `}>
        
            {/** question to chatGPT: I want to add the question here along with it's input, it's style must be compatible witheverything else, don't ever change my code, just give me the division element I should put here */}
            
            {/* Compact layout for questions 1-10, instead of making label and select element for each question manually */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/** map means : for each question 'q', generate JSX  to be rendered */}
              {subjectiveQuestions.map((q) => (
                <div key={q.questionId} className="flex flex-col space-y-2">
                  
                  {/** Question title and content  */}
                  <div>
                    <span className="font-semibold text-sm text-gray-900 block">{q.questionTitle}</span>
                        <label htmlFor={`q-${q.questionId}`} className={`block text-sm font-medium text-gray-700 mb-1 `}>
                            {q.questionText}
                        </label>
                  </div>
                  
                  {/** Dropdown */}
                  <select
                    className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white `}
                    id={q.questionId+""}
                    value={answers[q.questionId].answerValue ?? ""} // note 2 : answers is treated as array here ? even though we have declared it to be record ?
                    
                    onChange={(e) =>
                      
                       handleSelectChange(q.questionId, Number(e.target.value))
                    
                    }

                    
                  >
                    <option value="" disabled >Select an option</option> 
                    {q.answerOptions.map((answerOption) => (
                      <option key={answerOption.answerOptionValue} value={answerOption.answerOptionValue}>
                        {answerOption.answerOptionText}
                      </option>
                    ))}

                    
                  </select>

                
                </div>
              
              ))}

            </div>

            {/* Question 11: Slider */}
            <div className="pt-6 border-t border-gray-100">
             
              <span className="font-semibold text-sm text-gray-900 block mb-1">11. Assessing Your Risk Comfort Level</span>
             
              <label htmlFor="q-11" className="text-sm text-gray-600 mb-4 block">
                  On a scale of 1 to 10, where 1 represents a very cautious approach and 10 represents a very high willingness to take risks, how would you rate yourself in terms of your comfort level with taking risks?
              </label>
    
              <div className="px-2 max-w-lg">
                
                <Slider
                  id="q-11"
                  min={1}
                  max={10}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                />
                
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>1 (Cautious)</span>
                  <span className="text-blue-600 font-bold text-sm">Selected: {sliderValue}</span>
                  <span>10 (High Risk)</span>
                </div>

              </div>
            </div>

          
          
          
          
          
{/*             <div className="pt-6 border-t border-gray-100">
              
              <span className="font-semibold text-sm text-gray-900 block mb-1">
                12. Desired Annual Return
              </span>

              <label htmlFor="target-return" className="text-sm text-gray-600 mb-4 block">
                What annual return (%) would you like your investment to target?
                <br />
                <span className="text-gray-400 text-xs">
                  Typical range: 2% (very safe) to 15% (high growth). Higher values involve significantly higher risk.
                </span>
              </label>

              <div className="px-2 max-w-lg">
                
                <input
                  id="target-return"
                  type="number"
                  min={2}
                  max={20}
                  step={0.5}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 8"
                />

                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>Low (2–5%)</span>
                  <span className="text-blue-600 font-bold text-sm">
                    Selected: {sliderValue}%
                  </span>
                  <span>High (10–15%+)</span>
                </div>

              </div>
            </div> */}









              
              

          
        </div>
      
      
      </div>

    
    </div>
  );
}