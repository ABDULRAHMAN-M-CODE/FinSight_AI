
import { Routes,Route} from 'react-router-dom';
import IntroStepper from './pages/IntroStepper';
import WelcomePage from "./pages/welcomePage";
import Login from "./pages/Login";
import SignUpForm  from "./pages/Signup";
import EmailVerification from './pages/EmailVerification';
import Questionarry from './pages/Questionarry';
import PostSignup from './pages/PostSignup';
import DataCollectionIntro from './pages/DataCollectionIntro';
function App() {    
   // [path="/"] is the  default route to be rendered 
   
   return(
    <Routes>
      <Route path="/" element={<WelcomePage />}/>
      <Route path='/Login' element={<Login />} />
      <Route path='/Questionarry' element={<Questionarry />} />
      <Route path="/EmailVerification" element={<EmailVerification/>}/>
      <Route path="/IntroStepper"  element={<IntroStepper />}/>
      <Route path="/Signup"  element={ <SignUpForm /> } />
      <Route path="/PostSignup" element={<PostSignup />}/>
      <Route path="/DataCollectionIntro" element={<DataCollectionIntro />}/>
    </Routes>
  );
      
}
export default App
