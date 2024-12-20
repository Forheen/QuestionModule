import React, { useState } from "react";
import "./LoginPage.css";
import { Login } from "../services/Api";

export default function LoginPage() {
  const [loginState, setLoginState] = useState(false); //false for admin true for superadmin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
 


  const changeState = () => {
    setLoginState((prevState) => !prevState); // Toggle login state
  };

  const submit = async () => {
    // Clear the message before making the API request

    const endpoint = loginState
      ? "http://testinterns.drishtee.in/api/superadmin/login"
      : "http://testinterns.drishtee.in/api/admin/login-admin";
    const payload = { email, password };

    try {
      setLoading(true);
      const response = await Login(endpoint, payload);

      // Assuming a successful response contains a status code or specific data
      if (response.statusText='OK') {
        setLoading(false);
        alert("Login successful")
        
      }
      else{
        alert("Login unsuccessful")
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      
    }
  };

  return (
    <div className="main">
      <div className="overlay">
        {loginState ? (
          <h1 id="text">Login as Super Admin</h1>
        ) : (
          <h1 id="text">Login as Admin</h1>
        )}
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="btnClass">
          <button type="button" onClick={submit} className="btn btn-primary" id="btn">
            Login
          </button>
          {loginState ? (
            <a id="link" href="#" onClick={changeState}>
              Login as Admin
            </a>
          ) : (
            <a id="link" href="#" onClick={changeState}>
              Login as Superadmin
            </a>
          )}
        </div>
       
      </div>
    </div>
  );
}
