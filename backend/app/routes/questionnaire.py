from fastapi import APIRouter, HTTPException, status

from app.schemas.questionnaire_schemas import QuestionnaireSubmit

# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")

@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
    data: QuestionnaireSubmit,
):
    try:
        pass  # remove once business logic is implemented

       
       #Note: in the report, we should mention that we followed 'clean code principles' in both the frontend and backend, this will give us advantage.
       
       # ###########################################################
       # THE FLOW IS  BASICALLY 4 STEPS ONLY ( ORDER MATTERS !!!) :
       # ###########################################################
        
        #1- 'AHMAD'  should make a only a single function call - the function should be  defined in another file- that does the following only:

        # **** Store all submitted user's info "data" in the  appropriate database tables.*****
  

        #2- 'ABD'  should make a  single function call - Function is already implmented in another file-  that does the following:
        # *** call the LLM and store it's result in varaible. if the variable needs parsing, I will do it.*****
        
        
        #3- 'AHMAD'  should make a single function call - the function should be  defined in another file- that does the following only:
        #*** Store the AI result in the Database***********


        #4- 'ABD' returns the advice to the frontend only after ahamd finishes storing it in the database.



    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}
