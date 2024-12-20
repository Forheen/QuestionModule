import React, { useState } from "react";
import "./LoginPage.css";
import { Login } from "../services/Api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
// import { Navigation } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginPage({ navigation }) {
  const [loginState, setLoginState] = useState(false); //false for admin true for superadmin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const Base = import.meta.env.VITE_BASE_URL;
  const Admin = import.meta.env.VITE_ADMIN_LOGIN;
  const SuperAdmin = import.meta.env.VITE_SUPERADMIN_LOGIN;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(Base);
 


  const changeState = () => {
    setLoginState((prevState) => !prevState); // Toggle login state
  };

  const submit = async () => {
    // Clear the message before making the API request

    const endpoint = loginState
      ? `${Base}${SuperAdmin}`
      : `${Base}${Admin}`;
    const payload = { email, password };

    try {
      setLoading(true);
      const response = await Login(endpoint, payload);

      if (response.data?.token) {
        console.log(response.data.token);
        const decodeToken = jwtDecode(response.data.token);
        console.log(decodeToken.role);
        dispatch(setToken({token : response.data.token,role : decodeToken.role})); // Store token in Redux
        alert("Login successful");
        navigate("/csp");
      } else {
        alert("Login failed: Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    } finally {
      setLoading(false);
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
