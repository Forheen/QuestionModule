import React, { useState } from "react";
import "./LoginPage.css";
import { Login } from "../services/Api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAlert } from "../components/Alert/AlertContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

export default function LoginPage({ navigation }) {
  const [loginState, setLoginState] = useState(false); //false for admin true for superadmin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Base = import.meta.env.VITE_BASE_URL;
  const Admin = import.meta.env.VITE_ADMIN_LOGIN;
  const SuperAdmin = import.meta.env.VITE_SUPERADMIN_LOGIN;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {showAlert} = useAlert();
  const [showPassword, setShowPassword] = useState(false);


  console.log(Base);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const changeState = () => {
    setLoginState((prevState) => !prevState);
  };

  const submit = async () => {
    const endpoint = loginState ? `${Base}${SuperAdmin}` : `${Base}${Admin}`;
    const payload = { email, password };

    try {
      setLoading(true);
      const response = await Login(endpoint, payload);

      if (response.data?.token) {
        console.log(response.data.token);
        const decodeToken = jwtDecode(response.data.token);
        console.log(decodeToken.role);
        dispatch(
          setToken({ token: response.data.token, role: decodeToken.role })
        );
        showAlert("success", "Login Successful");
        navigate("/csp");
      } else {
        showAlert("error", "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      showAlert("error", "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
        {loading ?
        (
          <Box sx={{ display: 'flex'}}>
          <CircularProgress />
        </Box>
        ):
        (
          <>
          <div className="overlay">
        {loginState ? (
          <h1 id="text">Login as Super Admin</h1>
        ) : (
          <h1 id="text">Login as Admin</h1>
        )}
            <TextField
              size="small"
              // id="emailInput"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              InputProps={{
                style: {
                  backgroundColor: "white",
                   // Set background color to white
                },
              }}
              sx={{
                marginBottom: 2, // Space between the fields
              }}
            />

            {/* Password field with visibility toggle */}
            <TextField
              size="small"
              // id="exampleInputPassword1"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                style: {
                  backgroundColor: "white", // Set background color to white
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: 2, // Space between the fields
              }}
            />
        <div className="btnClass">
          <button
            type="button"
            onClick={submit}
            className="btn btn-primary"
            id="btn"
          >
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
          </>
        )}
    </div>
  );
}
