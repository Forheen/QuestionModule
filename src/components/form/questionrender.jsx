import React, { useState } from "react";
import "./questionrender.css"; // Add a separate CSS file for styles if needed
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const QuestionRenderer = ({
  question,
  questionIndex,
  answers,
  onAnswerChange,
  isSubQuestion = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setSelectedDate(formattedDate);
    onAnswerChange(question.id, formattedDate);
  };

  const handleImageUpload = (event, questionId) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onAnswerChange(questionId, fileUrl);
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "Text":
        return (
          <input
            type="text"
            placeholder="Type your answer"
            value={answers[question.id] || ""}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className="text-input"
          />
        );

      case "Choice":
        return (
          <div>
            {question.Choices.map((choice) => (
              <label key={choice.id} className="radio-container">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={answers[question.id] === choice.id}
                  onChange={() => onAnswerChange(question.id, choice.id)}
                />
                {choice.choice_text}
              </label>
            ))}
          </div>
        );

      case "Image":
        return (
          <div className="image-upload-container">
            {answers[question.id] && (
              <img
                src={answers[question.id]}
                alt="Uploaded"
                className="uploaded-image"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, question.id)}
              className="file-input"
            />
          </div>
        );

      case "Date":
        return (
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={handleDateChange}
              placeholderText="Select a date"
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderSubQuestions = () => {
    if (!question.Subquestions) return null;

    return question.Subquestions.map((sub) => {
      const parentChoice = answers[question.id];
      if (parentChoice === sub.choice_id) {
        return (
          <QuestionRenderer
            key={sub.id}
            question={sub}
            answers={answers}
            onAnswerChange={onAnswerChange}
            isSubQuestion={true}
          />
        );
      }
      return null;
    });
  };

  return (
    <div className={`question-container ${isSubQuestion ? "sub-question" : ""}`}>
      <p className="question-text">
        {isSubQuestion ? "" : `${questionIndex}. `}
        {question.question_text}
      </p>
      {renderInput()}
      {renderSubQuestions()}
    </div>
  );
};

export default QuestionRenderer;
