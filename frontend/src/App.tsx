import { useState } from 'react'


import './App.css'

function App() {
  
  const [page,setPage]=useState("Welcome_Page")
    if (page=="Welcome_Page"){
    return(
      <div id="WelcomePage">
        <div id="Frame_133539">
            <div id="Text">
              <p id='Welcoming'>Welcome to FinSight AI</p>
              <p id="describe_services">Unlock personalized financial insights, track your goals, and get smart, AI-powered recommendations tailored just for you—all in one easy-to-use app</p>
            </div>
            <div id="Split_Line"></div>
            <button id='Continue'>Start Your Journey</button>
        </div>
      </div>
    );
  }
  else{
    return(
      <div>
        <p>Continue......</p>
      </div>
    );
  }
  
}

export default App
