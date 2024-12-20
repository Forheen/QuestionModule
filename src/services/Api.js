// const BASE_URL = import.meta.env.BASE_URL;
// const CREATE_FORM = import.meta.env.CREATE_FORM;

import axios from "axios";
import { setToken } from "../redux/authSlice";
import { useDispatch } from "react-redux";



export const Form_Creation = async (formPayload)=>
{
    try{
      //  console.log(BASE_URL);
      //  console.log(CREATE_FORM);

        const response = await fetch("http://testinterns.drishtee.in/api/forms/createform", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formPayload),
          });
          if(!response.ok)
          {
            const errorDetails = await response.text(); // Capture server response
            console.error("Submission error:", errorDetails);
            throw new Error("Failed to submit the form: " + errorDetails);
          }
          return response;
    }
    catch(error)
    {
        console.log("Form Creation API call failed",error);
    }
}

// export const Login=async(endpoint,payload)=>
// {
//       try {
//         console.log(endpoint);
//         const response = await axios.post(endpoint, payload);
//         console.log("Login successful:", response);
//         return response;
//       } catch (error) {
//         console.error("Login failed:", error.response?.data || error.message);
//       }
// }

export const Login = async (endpoint, payload) => {
  try {
    console.log("Login endpoint:", endpoint);
    const response = await axios.post(endpoint, payload);

    console.log("Login successful:", response);
    return response;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error; // Re-throw the error for handling in the calling component
  }
};