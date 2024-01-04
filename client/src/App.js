import './App.css';
import React, {useContext} from 'react';
import { BrowserRouter as Router, HashRouter,  Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import Dashboard from './pages/dashboard/Dashboard';
import PriceTable from './pages/priceTable/PriceTable';
import MaterialGroup from './pages/materialGroups/MaterialGroup';
import UserAdministration from './pages/userAdministration/UserAdministration';
import Templates from './pages/templates/Templates';
import Languages from './pages/languages/Languages'
import Customers from './pages/customers/Customers';
import Quotations from './pages/quotations/Quotations';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ChangePassword from './pages/forgetPassword/ChangePassword';
import ForgetPassword from './pages/forgetPassword/ForgetPassword';
import { Context } from './context/Context';
import EmailVerify from './pages/forgetPassword/EmailVerify';

function App() {

  const { user } = useContext(Context);

  return (
    <HashRouter>
      {user && <Header/>}
      <Routes>
        <Route exact path="/" element={user ? <Dashboard/> : <Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/changePassword/:token" element={<ChangePassword />}></Route>
        <Route exact path="/emailVerify" element={<EmailVerify />}></Route>
        <Route exact path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route exact path="/dashboard" element={user ? <Dashboard/> : <Login/> }></Route>
        <Route exact path="/quotation" element={user ? <Quotations/> : <Login/> }></Route>
        <Route exact path="/quotation/:id" element={user ? <Quotations/> : <Login/> }></Route>
        <Route exact path="/priceTable" element={user ? <PriceTable/> : <Login/> }></Route>
        <Route exact path="/materialGroup" element={user ? <MaterialGroup/> : <Login/> }></Route>
        <Route exact path="/userAdministration" element={user ? <UserAdministration /> : <Login/> }></Route>
        <Route exact path="/templates" element={user ? <Templates /> : <Login/> }></Route>
        
        <Route exact path="/customers" element={user ? <Customers /> : <Login/> }></Route>
        <Route exact path="/languages" element={user ? <Languages /> : <Login/> }></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
