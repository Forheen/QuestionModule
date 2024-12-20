import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "./form.css";
import QuestionRenderer from "../../components/form/questionrender";

export default function Form() {
  const [state, setState] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userCode, setUserCode] = useState(null);
  const [allForms, setAllForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [items,setItems]=useState(null);
  const [selectedCsp ,setSelectedCsp]=useState(null);

  // Fetch user code on login
  const fetchUserCode = async () => {
    setLoadingLogin(true);
    try {
      const response = await axios.post(
        `https://bcadmin.drishtee.in/api/Login`,
        new URLSearchParams({
          username,
          password,
          token: "drishtee",
          FCMID: "",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.status === 200) {
        const userCode = response.data.Data[0].modified_by;
        setUserCode(userCode);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoadingLogin(false);
    }
  };

  // Fetch available forms when userCode is available
  useEffect(() => {
    const fetchForms = async () => {
      if (!userCode) return;

      setLoadingItems(true);
      try {
        const response = await fetch(
          `http://testinterns.drishtee.in/api/forms/allforms`
        );
        const data = await response.json();
        setAllForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    const fetchCsp=async()=>{
      if(userCode)
      {

      
      try {
        const response = await axios.get(
          `https://bcadmin.drishtee.in/api/GetCSPUser/GetCSPUserLists?userid=${userCode}`,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (response.status === 200 && response.data.Data2) {
          setItems(response.data.Data2.map(item => ({
            value: item.cspcode,
            label: item.cspname
          })));
        } else if (response.data.Message === "No records found") {
          console.warn("No records found");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoadingItems(false);
      }
    };
  }
 

    fetchForms();
    fetchCsp();
  }, [userCode]);
  const handleFormSelect2=(event)=>
  {
      const csp_code=event.target.value;
      setSelectedCsp(csp_code);
  }

  // Fetch form details when a form is selected
  const handleFormSelect = async (event) => {
    const formId = event.target.value;
    setSelectedForm(formId);

    if (formId) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://testinterns.drishtee.in/api/forms/getform/${formId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();
        const sortedQuestions = data.questions.sort(
          (a, b) => a.main_order - b.main_order
        );
        setFormData({ ...data, questions: sortedQuestions });
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Validate and submit the form
  const handleSubmit = async () => {
    const isFormValid = formData.questions.every(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    );

    if (!isFormValid) {
      alert("Please answer all the questions before submitting.");
      return;
    }

    const submissionPayload = {
      form_id: selectedForm,
      csp_code: selectedCsp,
      answers: Object.entries(answers).map(([questionId, answer]) => {
        const isChoice =
          typeof answer === "string" &&
          formData.questions.find((q) => q.id === questionId)?.type === "Choice";
        return isChoice
          ? { question_id: questionId, choice_id: answer }
          : { question_id: questionId, answer_text: answer };
      }),
    };

    try {
      const response = await fetch(
        "http://testinterns.drishtee.in/forms/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="mainContainer" style={{ marginLeft: state ? "20%" : 0 }}>
      <AppDrawer onChange={setState} />

      <div className="upperDiv">
        <div className="detailsContainer">
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter the Email of CSP holder"
            className="inputField"
            style={{
              width: '30%',
              padding: '10px 15px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)')}
            onBlur={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="inputField"
            style={{
              width: '30%',
              padding: '10px 15px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)')}
            onBlur={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
          />
          <button className="btn" onClick={fetchUserCode}>
            Fetch Forms
          </button>
        

        {loadingLogin && (
            <CircularProgress
              size={24}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
              }}
            />
          )}
          {!loadingLogin && loadingItems && (
            <CircularProgress
              size={24}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
              }}
            />
          )}
        {!loadingLogin && !loadingItems && (
          <select
            className="dropDown"
            value={selectedForm}
            onChange={handleFormSelect}
            style={{
              width: '200px',
              padding: '10px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              fontSize: '14px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)';
              e.target.style.backgroundColor = '#e0f7fa';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
            <option value="">Select a form</option>
            {allForms.map((form, index) => (
              <option key={form.id} value={form.id}>
                {index + 1}. {form.name}
              </option>
            ))}
          </select>
        )}
                {!loadingLogin && !loadingItems && items &&(
          <select
            className="dropDown"
            value={selectedCsp}
            onChange={handleFormSelect2}
            style={{
              width: '200px',
              padding: '10px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              fontSize: '14px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)';
              e.target.style.backgroundColor = '#e0f7fa';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
              <option value="">Select an option</option>
              {items.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
        )}
        </div>
      

      {loading && <CircularProgress />}
      {formData && formData.questions && (
        <div className="formQuestions">
          {formData.questions.map((question, index) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              questionIndex={index + 1}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          ))}
          <div className="btn2">

          <button className="btn" onClick={handleSubmit}>
            Submit Form
          </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
