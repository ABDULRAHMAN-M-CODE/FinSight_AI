

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
          <p id="app_name">FinSight AI</p>
          <div id="Input_Section">
            <div id='Login'>
              <div id='Inputs'>
                <div id="Email_Div">
                  <p id='Email_Label'>Email Address</p>
                  <input id='Email_Input'  placeholder='Chris@gmail.com'/>
                </div>
                <div id='Password_Div'>
                  <div id='Password_Header'>
                    <p id='Password_Label'>Password</p>
                    <Link to="/Forgot_Password" id="Right_text">Forgot Password?</Link>                    
                  </div>
                  <div  id='Password_Input'>
                    <input  id="text" />
                    <button id="Icon_eye_button">
                      <i className='fa fa-eye' id ='Icon_eye'></i>
                    </button>
                  </div>
                </div>
              </div>
              <div id='Button'>
                <div id='Remind_ME'>
                  <input  type='checkbox' id="Tick"/>
                  <p id="Keep_me_signed_in">Keep me signed in</p>
                </div>
                <button id='Login_Button'>Login</button>
              </div>
            </div>
            <div id='Divider_2'>
              <div  id="Line_10"></div>
              <div id="Sign_in_with">
                <p id="or_sign_in_with">or sign in with</p>

              </div>
            </div>
            <button id="Button_Secondry">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google G" width="30" height="30"  id="gogle_icon"/>

              <p id="Continue_With_Google">Continue With Google</p>
            </button>
          </div>
          
        </div>
        <Link to="/Signup" id="Creat_account">Create an account?</Link>
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
