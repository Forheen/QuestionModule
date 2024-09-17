
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CSP_form from './Pages/CSP_form/CSP_form'
// import Home from './Pages/Home';
// import 'bootstrap/dist/css/bootstrap.min.css'; 



function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path='/' Component={Home}/> */}
      <Route  path='/csp' Component={CSP_form}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
