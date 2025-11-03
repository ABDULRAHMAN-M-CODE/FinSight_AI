

import { Link } from "react-router";
import { useDispatch } from 'react-redux';
import { setPage } from './mainSlice';
import './App.css'
import { Routes,Route,useNavigate } from 'react-router-dom';

function WelcomePage(){
  const dispatch=useDispatch();    
  const navigate=useNavigate();
  return(
      <div id="WelcomePage">
        <div id="Frame_133539">
            <div id="Text">
              <p id='Welcoming'>Welcome to FinSight AI</p>
              <p id="describe_services">Unlock personalized financial insights, track your goals, and get smart, AI-powered recommendations tailored just for you—all in one easy-to-use app</p>
            </div>
            <div id="Split_Line"></div>
            <button id='Continue' onClick={()=>{
              dispatch(setPage("continue...."))
              navigate("/Login")
            }}>Start Your Journey</button>
        </div>
      </div>
    );

  }
  function Login(){
    return(
      <>
        <div id='Login_Frame'>
          <p>FinSight AI</p>
          <div id="Input_Section">
            <div id='Login'>
              <div id='Inputs'>
                <div id="Email_Div">
                  <p id='Email_Label'></p>
                  <input id='Email_Input'  placeholder='Chris@gmail.com'/>
                </div>
                <div id='Password_Div'>
                  <div id='Password_Header'>
                    <p id='Password_Label'></p>
                    <Link to="/Forgot_Password">Forgot Password?</Link>;                    
                  </div>
                  <div  id='Password_Input'>
                    <input />
                    <button>
                      <i className='fa fa-eye'></i>
                    </button>
                  </div>
                </div>
              </div>
              <div id='Buttons'>
                <div id='Remind_ME'>
                  <input  type='checkbox'/>
                  <p>Keep me signed in</p>
                </div>
                <button id='Login_Button'>Login</button>
              </div>
            </div>
            <div id='Divider_2'>
              <hr />
              <div>
                <p>or sign in with</p>
              </div>
            </div>
            <div id="Continue_With_Google">
              <img />
              <p></p>
            </div>
          </div>
        </div>
        <button id="Create_Account_Button">Create an account</button>
      </>
    );
  }
function App() {
  
    
    
        return(
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path='/Login' element={<Login />} />
          </Routes>
        
        );
      

  
}

export default App
