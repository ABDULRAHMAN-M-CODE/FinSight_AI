
import { Routes,Route} from 'react-router-dom';
import IntroStepper from './IntroStepper';
import WelcomePage from "./pages/welcomePage";
import Login from "./pages/Login";
import SignUpForm  from "./pages/Signup";
import Questionarry from './pages/Questionarry';
import EmailVerifiedPage  from "./pages/EmailVerifiedPage";

function App() {    
   // [path="/"] is the  default route to be rendered 
   
   return(
    <Routes>
      <Route path='/Login' element={<Login />} />
      <Route path="/" element={<WelcomePage />}/>
      <Route path='/Questionarry' element={<Questionarry />} />
      
      <Route path="/IntroStepper"  element={<IntroStepper />}/>
      <Route path="/Signup"  element={ <SignUpForm /> } />
      <Route path="/verify-email" element={<EmailVerifiedPage  />} />
    </Routes>
  );
      
}
export default App
