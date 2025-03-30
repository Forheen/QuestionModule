import axios from "axios";
// import { useSelector } from 'react-redux';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CREATE_FORM = import.meta.env.VITE_CREATE_FORM;
const PRODUCT_ENDPOINT = import.meta.env.VITE_PRODUCTS_ENDPOINT;
const GET_FORM = import.meta.env.VITE_GET_FORM;
const SUBMIT_FORM = import.meta.env.VITE_SUBMIT_FORM;
const GETALL_FORMS = import.meta.env.VITE_GETALL_FORMS;
const GETALL_SUBMISSIONS = import.meta.env.VITE_GETALL_SUBMISSIONS;
const GET_REPORT_BY_PRODUCT_UUID = import.meta.env.VITE_GET_REPORT_BY_PRODUCT_UUID ;
const GET_REPORT_BY_CSPCODE_DATE = import.meta.env.VITE_GET_REPORT_BY_PRODUCT_UUID_AND_DATE;



// form creation api
export const Form_Creation = async (formPayload) => {
  try {
    console.log(JSON.stringify(formPayload));

    const response = await fetch(`${BASE_URL}${CREATE_FORM}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
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

// product fetch
export const fetchProduct = async (token) => {
  console.log("BASE_URL:", BASE_URL);
  console.log("PRODUCT_ENDPOINT:", PRODUCT_ENDPOINT);
  console.log("Token:", token);
  try {
    const response = await axios.get(`${BASE_URL}${PRODUCT_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Product fetch failed:", error);
    throw error; // Re-throw to handle it in the calling function
  }
};

// from render api's

export const submit = async (submissionPayload) => {
  try {
      const response = await fetch(
          `${BASE_URL}${SUBMIT_FORM}`,
          {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(submissionPayload),
          }
      );

      const data = await response.json();

      if (!response.ok) {
          console.error("Submission failed:", data);
          throw new Error(data.message || "Failed to submit the form");
      }

      return response;
  } catch (error) {
      console.error("Error submitting form:", error);
      throw error;

  }
};


export const getForm = async (formId) => {
  try {

      const response = await fetch(`${BASE_URL}${GET_FORM}/${formId}`);
      if (!response.ok) {
          throw new Error("Failed to fetch form data");
      }
      return response;
  }

  catch (error) {
      console.error("Error fetching form details:", error);
  }
}

// fetch forms by uuid

export const fetchFormByUUID = async (uuid) => {
  try {
    const response = await axios.get(`${BASE_URL}${GETALL_FORMS}/${uuid}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Form fetch failed:", error);
    throw error; // Re-throw to handle it in the calling function
  }
}

//fetch all forms by product
export const fetchFormByProduct = async (uuid) => {
  try {
    const response = await fetch(`${BASE_URL}${GETALL_FORMS}/${uuid}`);
    if (!response.ok) {
      throw new Error(`Error fetching forms: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// submission list 
export const fetchSubmissionListById = async (formId) => {
  console.log("Form ID:", formId);
  const url = `${BASE_URL}${GETALL_SUBMISSIONS}`; // No need to append formId in URL

  console.log("Fetching URL:", url);

  try {
    const response = await axios.post(`${BASE_URL}${GETALL_SUBMISSIONS}/${formId}`, { 
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    return await response.data;
  } catch (error) {
    console.error("Error fetching form details:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// fetch csp report by product id
export const fetchCSPReportByProductID = async (code, productID) => {
  try {
    const response = await axios.post(`${BASE_URL}${GET_REPORT_BY_PRODUCT_UUID}`, {
      csp_code: code,
      productID: productID,
    });

    console.log("Selected Submission Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  }
};

export const fetchCSPReportByProductIDandDate = async (code, date,productID) => {
  try {
    const response = await axios.post(`${BASE_URL}${GET_REPORT_BY_CSPCODE_DATE}`, {
      csp_code: code,
      date : date,
      product_id: productID,

    });

    console.log("Selected Submission Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  }
};