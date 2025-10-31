


import { useDispatch, useSelector, type UseSelector } from 'react-redux';
import { setPage } from './mainSlice';
import './App.css'
import { Routes,Route,BrowserRouter,useNavigate } from 'react-router-dom';

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
      <div>
        <p>login</p>
      </div>
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
