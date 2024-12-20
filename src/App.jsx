
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import CSP_form from './Pages/CSP_form/CSP_form'
import Report_Page from './Pages/Report/Report_Page'
// import Home from './Pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Form from './Pages/CSP_form2/form';
import LoginPage from './Authstack/LoginPage';
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../src/redux/store";
import AdminRoute from './AdminStack/adminRoute';



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={LoginPage}/>
      <Route  path='/csp' element={
        <AdminRoute allowedRoles={['superadmin']}>
          <CSP_form/>
        </AdminRoute>
      }/>
      <Route  path='/report' Component={Report_Page}/>
      <Route path='/product2form' Component={Form}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
