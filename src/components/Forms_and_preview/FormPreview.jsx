import React from "react";
import "./FormPreview.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import QuestionRender from "../Form_render/QuestionRender";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const FormPreview = () => {
  const navigate = useNavigate(); // Initialize navigate

  const location = useLocation(); // Get location object
  const formData = location.state?.formData; // Access formData from state
  const [answers, setAnswers] = useState({});

  console.log(formData);
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
};

  const renderInput = (question, questionIndex) => {
    switch (question.type) {
      case "Text":
        return (
          <input
            type="text"
            placeholder="Type your answer"
            className="text-input"
            readOnly
          />
        );

      case "Choice":
        return (
          <div>
            {Array.isArray(question.choices) && question.choices.length > 0 ? (
              question.choices.map((choice, choiceIndex) => (
                <div
                  key={choice.choice_text || choiceIndex}
                  className="choice-container"
                >
                  <label className="radio-container">
                    <input
                      type="radio"
                      name={`question-${question.id || questionIndex}`}
                      disabled
                    />
                    {choice.choice_text}
                  </label>

                  {/* Render subquestions for this choice */}
                  {choice.subquestions && choice.subquestions.length > 0 && (
                    <div className="subquestions-container">
                      {choice.subquestions.map((sub, subIndex) => (
                        <div key={subIndex} className="sub-question">
                          <p className="sub-question-text">
                            {sub.question_text}
                          </p>
                          {renderInput(sub, subIndex)}{" "}
                          {/* Recursively render subquestion */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No choices available</p>
            )}
          </div>
        );

      case "Image":
        return (
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              disabled
            />
          </div>
        );

      case "Date":
        return (
          <div className="date-picker-container">
            <DatePicker
              placeholderText="Select a date"
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
              disabled
            />
          </div>
        );

      default:
        return <p className="unsupported-type">Unsupported question type</p>;
    }
  };

  const renderSubQuestions = (subquestions, questionIndex) => {
    if (!Array.isArray(subquestions) || subquestions.length === 0) {
      return null;
    }

    return subquestions.map((sub, index) => (
      <div
        key={sub.id || `${questionIndex}-sub-${index}`}
        className="sub-question"
      >
        {renderQuestion(sub, index + 1, true)}
      </div>
    ));
  };

  const renderQuestion = (question, questionIndex, isSubQuestion = false) => {
    return (
      <div
        key={question.id || `${questionIndex}-question`}
        className={`question-container ${isSubQuestion ? "sub-question" : ""}`}
      >
        <p className="question-text">
          {isSubQuestion ? "" : `${questionIndex}. `}
          {question.question_text || "No question text provided"}
        </p>
        {renderInput(question, questionIndex)}
        {renderSubQuestions(question.subquestions, questionIndex)}
      </div>
    );
  };

  return (
    <div className="overlayPreview">
      <div className="overlay-content">
        {/* Back Button */}
        {/* <button className="back-button" onClick={() => navigate(-1)}>← Back</button> */}
        {/* <ArrowBackIosIcon className="back-button" onClick={() => navigate(-1)} /> */}
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIosIcon />
        </IconButton>

        {/* Close Button */}
        {/* <button className="close-button" onClick={onClose}>×</button> */}

        <h2>Form Preview</h2>
        <div className="form-container">
          {/* Render questions */}
          
            <div className="formQuestions">
              {formData.questions.map((question, index) => (
                <QuestionRender
                  key={question.id}
                  question={question}
                  questionIndex={index + 1}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
