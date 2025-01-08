import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal"; // Import MUI Modal
import Button from "@mui/material/Button"; // Import MUI Button
import QuestionRender from '../../components/Form_render/QuestionRender'
import { submit, getForm } from '../../services/Api';
import "./Render.css";
import { Login } from "../../services/Api";
import {jwtDecode} from 'jwt-decode'; // Correct import


export default function Render() {
    const [formData, setFormData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formVisible, setFormVisible] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get("formId");
    const CSP_Code = urlParams.get("CSP_Code");
    const token = urlParams.get("token");
    console.log(formId, CSP_Code, token);

    useEffect(() => {
        const verifyToken = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setIsAuthorized(false);
                    return;
                }

                // Decode token and check role
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'user') {
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [token]);



    useEffect(() => {
        if (!isAuthorized) {
            return;
        }
        const fetchFormDetails = async () => {
            setLoading(true); // Start loading
            try {
                const response = await getForm(formId);
                if (!response.ok) {
                    throw new Error("Failed to fetch form data");
                }
                const data = await response.json();
                const sortedQuestions = data.questions.sort(
                    (a, b) => a.main_order - b.main_order
                );
                setFormData({ ...data, questions: sortedQuestions });
            } catch (error) {
                console.error("Error fetching form details:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchFormDetails();
    }, [formId, isAuthorized]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (!formData || !formData.questions) return;

        const isFormValid = formData.questions.every(
            (q) => answers[q.id] !== undefined && answers[q.id] !== ""
        );

        if (!isFormValid) {
            alert("Please answer all the questions before submitting.");
            return;
        }

        const submissionPayload = {
            form_id: formId,
            csp_code: CSP_Code,
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
            const response = await submit(submissionPayload);
            if (!response.ok) {
                throw new Error("Failed to submit the form");
            }
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting the form. Please try again.");
        }
    };

    const handleClose = () => {
        setSuccess(false); // Close modal
        setFormVisible(false); // Hide form
    };

    if (loading) {
        return (
            <div className="loadingContainer">
                <CircularProgress />
                <p style={{ color: 'white' }}>Loading form, please wait...</p>
            </div>
        );
    }
    if (!isAuthorized) {
        return null;
    }

    if (!formVisible) {
        return (
            <div className="thankYouMessage">
                <div className="msgContainer">
                    <h1>Thank You for Your Submission!</h1>
                    <p>
                        We sincerely appreciate you taking the time to fill out this form.
                        Your feedback and input are invaluable to us and will help us to improve and grow.
                        If you have any further questions or feedback, feel free to reach out to us anytime.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mainContainer">
            <div className="upperDiv">
                {formData && formData.questions && (
                    <div className="formQuestions">
                        <div className="CSPcode">
                            <input
                                type="text"
                                placeholder="Enter your CSP Code"
                                value={`Csp Code : ${CSP_Code}`}
                                className="text-input"
                                disabled
                            />
                        </div>
                        {formData.questions.map((question, index) => (
                            <QuestionRender
                                key={question.id}
                                question={question}
                                questionIndex={index + 1}
                                answers={answers}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                        <div className="submitDiv">

                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit Form
                        </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* MUI Modal */}
            <Modal open={success} onClose={handleClose}>
                <div className="modalContainer">
                    <h2>Thank You!</h2>
                    <p>Thank you for completing the form!</p>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
