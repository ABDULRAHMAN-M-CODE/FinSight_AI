




import './App.css'
function WelcomePage(){
      return(
      <div id="WelcomePage">
        <div id="Frame_133539">
            <div id="Text">
              <p id='Welcoming'>Welcome to FinSight AI</p>
              <p id="describe_services">Unlock personalized financial insights, track your goals, and get smart, AI-powered recommendations tailored just for you—all in one easy-to-use app</p>
            </div>
            <div id="Split_Line"></div>
            <button id='Continue' onClick={()=>}>Start Your Journey</button>
        </div>
      </div>
    );
}
function App() {
  
  
    if (=="Welcome_Page"){
        return(
        <WelcomePage   />
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
