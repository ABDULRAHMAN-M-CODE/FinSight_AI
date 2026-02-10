import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


// font related
import '@fortawesome/fontawesome-free/css/all.min.css';

// React Router related
import { BrowserRouter } from 'react-router-dom' 

 // Redux Related
import { Provider } from 'react-redux'
import store from './store'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <Provider store={store}> {/** for redux to work , Provider is needed */}
       <App />      
     </Provider>
    </BrowserRouter>
  </StrictMode>,
)
