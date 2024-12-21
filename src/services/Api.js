

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CREATE_FORM = import.meta.env.VITE_CREATE_FORM;


// form creation api
export const Form_Creation = async (formPayload) => {
  try {

    const response = await fetch(`${BASE_URL}${CREATE_FORM}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formPayload),
    });
    if (!response.ok) {
      const errorDetails = await response.text(); // Capture server response
      console.error("Submission error:", errorDetails);
      throw new Error("Failed to submit the form: " + errorDetails);
    }
    return response;
  }
  catch (error) {
    console.log("Form Creation API call failed", error);
  }
}

// login api
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