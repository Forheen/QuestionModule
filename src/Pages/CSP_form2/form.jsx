import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import { fetchProduct } from "../../services/Api";
import { useSelector } from "react-redux";
import Button from '@mui/material/Button';
import "./form.css";

export default function Form() {

  const token = useSelector((state) => state.auth.token);
  const [productData, setProductData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [state, setState] = useState(null);
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [userCode, setUserCode] = useState(null);
  // const [allForms, setAllForms] = useState([]);
  // const [selectedForm, setSelectedForm] = useState("");
  // const [formData, setFormData] = useState(null);
  // const [answers, setAnswers] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [loadingLogin, setLoadingLogin] = useState(false);
  // const [loadingItems, setLoadingItems] = useState(false);
  // const [items,setItems]=useState(null);
  // const [selectedCsp ,setSelectedCsp]=useState(null);

  // // Fetch user code on login
  // const fetchUserCode = async () => {
  //   setLoadingLogin(true);
  //   try {
  //     const response = await axios.post(
  //       `https://bcadmin.drishtee.in/api/Login`,
  //       new URLSearchParams({
  //         username,
  //         password,
  //         token: "drishtee",
  //         FCMID: "",
  //       }),
  //       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  //     );

  //     if (response.status === 200) {
  //       const userCode = response.data.Data[0].modified_by;
  //       setUserCode(userCode);
  //     } else {
  //       throw new Error(response.data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     alert("Login failed. Please check your credentials.");
  //   } finally {
  //     setLoadingLogin(false);
  //   }
  // };

  // // Fetch available forms when userCode is available
  // useEffect(() => {
  //   const fetchForms = async () => {
  //     if (!userCode) return;

  //     setLoadingItems(true);
  //     try {
  //       const response = await fetch(
  //         `http://testinterns.drishtee.in/api/forms/allforms`
  //       );
  //       const data = await response.json();
  //       setAllForms(data);
  //     } catch (error) {
  //       console.error("Error fetching forms:", error);
  //     } finally {
  //       setLoadingItems(false);
  //     }
  //   };

  //   const fetchCsp=async()=>{
  //     if(userCode)
  //     {

      
  //     try {
  //       const response = await axios.get(
  //         `https://bcadmin.drishtee.in/api/GetCSPUser/GetCSPUserLists?userid=${userCode}`,
  //         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //       );

  //       if (response.status === 200 && response.data.Data2) {
  //         setItems(response.data.Data2.map(item => ({
  //           value: item.cspcode,
  //           label: item.cspname
  //         })));
  //       } else if (response.data.Message === "No records found") {
  //         console.warn("No records found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching items:", error);
  //     } finally {
  //       setLoadingItems(false);
  //     }
  //   };
  // }
 

  //   fetchForms();
  //   fetchCsp();
  // }, [userCode]);
  // const handleFormSelect2=(event)=>
  // {
  //     const csp_code=event.target.value;
  //     setSelectedCsp(csp_code);
  // }

  // // Fetch form details when a form is selected
  // const handleFormSelect = async (event) => {
  //   const formId = event.target.value;
  //   setSelectedForm(formId);

  //   if (formId) {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `http://testinterns.drishtee.in/api/forms/getform/${formId}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch form data");
  //       }
  //       const data = await response.json();
  //       const sortedQuestions = data.questions.sort(
  //         (a, b) => a.main_order - b.main_order
  //       );
  //       setFormData({ ...data, questions: sortedQuestions });
  //     } catch (error) {
  //       console.error("Error fetching form:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // // Handle answer changes
  // const handleAnswerChange = (questionId, value) => {
  //   setAnswers((prev) => ({ ...prev, [questionId]: value }));
  // };

  // // Validate and submit the form
  // const handleSubmit = async () => {
  //   const isFormValid = formData.questions.every(
  //     (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  //   );

  //   if (!isFormValid) {
  //     alert("Please answer all the questions before submitting.");
  //     return;
  //   }

  //   const submissionPayload = {
  //     form_id: selectedForm,
  //     csp_code: selectedCsp,
  //     answers: Object.entries(answers).map(([questionId, answer]) => {
  //       const isChoice =
  //         typeof answer === "string" &&
  //         formData.questions.find((q) => q.id === questionId)?.type === "Choice";
  //       return isChoice
  //         ? { question_id: questionId, choice_id: answer }
  //         : { question_id: questionId, answer_text: answer };
  //     }),
  //   };

  //   try {
  //     const response = await fetch(
  //       "http://testinterns.drishtee.in/forms/submit",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(submissionPayload),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to submit the form");
  //     }

  //     alert("Form submitted successfully!");
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("There was an error submitting the form. Please try again.");
  //   }
  // };
    useEffect(() => {
      let timeout;
  
      if (token) {
        timeout = setTimeout(async () => {
          try {
            const response = await fetchProduct(token);
            setProductData(response.products);
          } catch (err) {
            console.error("Error fetching product:", err);
          }
        }, 300);
      }
  
      return () => clearTimeout(timeout); // Cleanup
    }, [token]);
    console.log(productData);

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
  };


  return (
    <div className="mainContainer" style={{ marginLeft: state ? "20%" : 0 }}>
      <AppDrawer onChange={setState} />

      <div className="upperDiv">
        <div className="detailsContainer">
        <div className="uuidSelect">
            <select
              className="uuidSelectBox"
              value={selectedProductId}
              onChange={handleProductChange}
            >
              <option value="" disabled>
                Select a Product
              </option>
              {productData.map((product) => (
                <option key={product.product_uuid} value={product.product_uuid}>
                  {product.product_name}
                </option>
              ))}
            </select>
            <Button variant="contained">Contained</Button>
          </div>
        </div>
     
      </div>
    </div>
  );
}
