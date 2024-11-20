
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CSP_form from './Pages/CSP_form/CSP_form'
// import Report_Page from './Pages/Report/Report_Page'
// import Home from './Pages/Home';
// import 'bootstrap/dist/css/bootstrap.min.css'; 



function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path='/' Component={Home}/> */}
      <Route  path='/' Component={CSP_form}/>
      {/* <Route  path='/report' Component={Report_Page}/> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
