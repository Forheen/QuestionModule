import React from "react";
import "../../components/form/questionrender.css"; // Add a separate CSS file for styles if needed
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RenderQuestion = ({ question, questionIndex, isSubQuestion = false }) => {
  const renderInput = () => {
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
            {Array.isArray(question.Choices) && question.Choices.length > 0 ? (
              question.Choices.map((choice) => (
                <label key={choice.id || choice.choice_text} className="radio-container">
                  <input
                    type="radio"
                    name={`question-${question.id || questionIndex}`}
                    disabled
                  />
                  {choice.choice_text}
                </label>
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

  const renderSubQuestions = () => {
    if (!Array.isArray(question.Subquestions) || question.Subquestions.length === 0) {
      return null;
    }

    return question.Subquestions.map((sub, index) => (
      <RenderQuestion
        key={sub.id || `${questionIndex}-${index}`}
        question={sub}
        isSubQuestion={true}
      />
    ));
  };

  return (
    <div className={`question-container ${isSubQuestion ? "sub-question" : ""}`}>
      <p className="question-text">
        {isSubQuestion ? "" : `${questionIndex}. `}
        {question.question_text || "No question text provided"}
      </p>
      {renderInput()}
      {renderSubQuestions()}
    </div>
  );
};

export default RenderQuestion;
