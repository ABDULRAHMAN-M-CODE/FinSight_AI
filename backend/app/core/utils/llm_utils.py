from langchain.agents import create_agent

from langchain.agents.structured_output import ToolStrategy
from typing import Type, TypeVar
from pydantic import BaseModel

# Create LLM agent
# Note: OPENAI_API_KEY is internally loaded via environment variables

# input is restricted * bounded* ; it must always be a pydantic models.
T=TypeVar("T", bound=BaseModel)


def call_llm(model:str ,user_context:str, system_prompt:str, response_format: Type[T], role:str, prompt:str   )->T: # the function returns  data with the desired shape "desired pydantic schema"
    """
    Docstring for call_llm
    
    :param model: specifies LLM model
    :type model: strs
    
    :param user_context: LLM generates it's response based on this context, it could be new financial info, or new financial info + history of past financial info and recommendation.
    :type user_context: str; output of 'model_dump_json()' is always string
    
    :param system_prompt: main prompt for the LLM. it defines rules, ,tone, costraints, beahvior, and context that the LLM must always follow no matter what.  
    :type system_prompt: str

    :param response_format: The Desired shape of the data returned by the LLM
    :type response_format: Type[T] ; a class, not instance of class
    
    :param role: a role could be 'user'
    :type role: str

    :param prompt:The dynamic user's request or question. 
    :type prompt: str

    :return: Actual Structured data that is returned by the LLM
    :rtype: T; An instance of the desired outcome (instance of the specified pydantic class/ schema)
    # Note : no need to define the  data shape (pydantic schema) to be sent to the LLM; reason is : user_context is always validated, thus computed data is always in the right shape (because the calculations will never happen unless the client provides data that follows the agreed upon  data contract), thus LLM always recives data in the exact shape we want
    # Note : what is not guaranteed is the  quality  of the data that is sent to the LLM , current implmentation does not support  this   
    """
    agent = create_agent(
        model=model,
        system_prompt=system_prompt,
        response_format=ToolStrategy(response_format)#static strategy
    )

    # Invoke the LLM with user financial data
    response = agent.invoke({
        "messages": [
            {
                "role": role,
                "content": (
                    prompt+":"+user_context
                )
            }
        ]
    })

    # ToolStrategy always returns "structured_response" , see documentation !
    typed_response:T=response ["structured_response"]
    return  typed_response
    
    

