import React, { useState } from "react";
import "./render_module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const QuestionRender = ({
  question,
  questionIndex,
  answers,
  scores,
  onAnswerChange,
  onScoreChange,
  onQuestionTextChange, // Function to handle text update externally
  isSubQuestion = false,
}) => {
  const [questionText, setQuestionText] = useState(question.question_text || "");

  const handleScoreChange = (id, value) => {
    onScoreChange(id, Number(value));
  };

  const handleImageUpload = (e, questionId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onAnswerChange(questionId, reader.result);
    reader.readAsDataURL(file);
  };

  const renderScoreField = (id, isChoice = false) => (
    <div className="score-container">
      <label htmlFor={`score-${id}`} className="score-label">
        {isChoice ? "Choice Score:" : "Score:"}
      </label>
      <input
        type="number"
        id={`score-${id}`}
        className="score-input"
        value={scores[id] || ""}
        onChange={(e) => handleScoreChange(id, e.target.value)}
      />
    </div>
  );

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
              <div key={choice.id} className="choice-container">
                <label className="radio-container">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choice.id}
                    checked={answers[question.id] === choice.id}
                    onChange={() => onAnswerChange(question.id, choice.id)}
                  />
                  {choice.choice_text}
                </label>
                {renderScoreField(choice.id, true)}

                {/* Subquestions */}
                {choice.Subquestions &&
                  answers[question.id] === choice.id &&
                  choice.Subquestions.map((sub) => (
                    <QuestionRender
                      key={sub.id}
                      question={sub}
                      questionIndex={questionIndex}
                      answers={answers}
                      scores={scores}
                      onAnswerChange={onAnswerChange}
                      onScoreChange={onScoreChange}
                      isSubQuestion={true}
                      onQuestionTextChange={onQuestionTextChange}
                    />
                  ))}
              </div>
            ))}
          </div>
        );

      case "Image":
        return (
          <div className="image-upload-container">
            {answers[question.id] && (
              <img src={answers[question.id]} alt="Uploaded" className="uploaded-image" />
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
          <DatePicker
            selected={answers[question.id] ? new Date(answers[question.id]) : null}
            onChange={(date) => onAnswerChange(question.id, date.toISOString().split("T")[0])}
            placeholderText="Select a date"
            dateFormat="yyyy-MM-dd"
            className="date-picker-input"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`question-container ${isSubQuestion ? "sub-question" : ""}`}>
      {/* Editable Question Text */}
      <input
        type="text"
        value={questionText}
        onChange={(e) => {
          setQuestionText(e.target.value);
          onQuestionTextChange(question.id, e.target.value); // Notify parent
        }}
        className="question-text-input"
      />

      {renderInput()}

      {/* Render score field for non-choice questions and subquestions */}
      {question.type !== "Choice" && renderScoreField(question.id)}

      {/* Render nested subquestions */}
      {question.Subquestions?.map((sub) => (
        <QuestionRender
          key={sub.id}
          question={sub}
          questionIndex={questionIndex}
          answers={answers}
          scores={scores}
          onAnswerChange={onAnswerChange}
          onScoreChange={onScoreChange}
          isSubQuestion={true}
          onQuestionTextChange={onQuestionTextChange}
        />
      ))}
    </div>
  );
};

export default QuestionRender;
