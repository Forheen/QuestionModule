import React from "react";
import "./Form_preview_update.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import QuestionRender from "./render_module";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";


const FormPreviewUpdate = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
const METADATA_UPDATE = import.meta.env.VITE_UPDATE_MATADATA;
const QUESTION_SCORE_UPDATE = import.meta.env.VITE_UPDATE_QUESTION_SCORE;
const CHOICE_SCORE_UPDATE = import.meta.env.VITE_UPDATE_CHOICE_SCORE;
const QUESTION_TEXT_UPDATE = import.meta.env.VITE_UPDATE_QUESTION_TEXT;
  const navigate = useNavigate(); // Initialize navigate
  const token = useSelector((state) => state.auth.token);

  const location = useLocation(); // Get location object
  const formData = location.state?.formData; // Access formData from state
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({}); // State to store scores
  const [questionTexts , setQuestionTexts] = useState({}); // State to store question scores
  const [title, setTitle] = useState(formData.name || ""); // State to store title
  const [description, setDescription] = useState(
    formData.description || ""
  ); // State to store description

  console.log(formData);
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onQuestionTextChange = (id, text) => {
    setQuestionTexts((prev) => ({ ...prev, [id]: text }));
  };

  // question text update 
  const updateQuestionText = async (id, text) => {
    try {
        console.log(QUESTION_TEXT_UPDATE);
      const response = await fetch(
        `${BASE_URL}${QUESTION_TEXT_UPDATE}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, question_text: text }),
        }
      );
      if (!response.ok) throw new Error("Failed to update question text");
      console.log("Question text updated successfully");
    } catch (error) {
      console.error("Error updating question text:", error);
    }
  };
  
  
// score update
const updateScoreAPI = async (id, score, type, retries = 3) => {
    const endpoint =
      type === "choice"
        ? `${BASE_URL}${CHOICE_SCORE_UPDATE}`
        : `${BASE_URL}${QUESTION_SCORE_UPDATE}`;
  
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, score }),
        });
  
        if (!response.ok) {
          throw new Error(`Attempt ${attempt}: Failed to update ${type} score`);
        }
  
        console.log(`${type} score updated successfully`);
        return; // Exit function if successful
      } catch (error) {
        console.error(`Error updating ${type} score:`, error);
        if (attempt === retries) {
          alert(`Failed to update ${type} score for ID: ${id}`);
        }
      }
    }
  };
  


  //title update 
    const updateTitle = async (id, value) => {
      try {
        const response = await fetch(
          `${BASE_URL}${METADATA_UPDATE}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({ id, name: value }),
          }
        );
        if (!response.ok) throw new Error("Failed to update title");
        console.log("Title updated successfully");
      } catch (error) {
        console.error("Error updating title:", error);
      }
    };
  //description update
  const updateDescription = async (id, value) => {
    try {
      const response = await fetch(
        `${BASE_URL}${METADATA_UPDATE}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({ id, description: value }),
      }
    );
    if (!response.ok) throw new Error("Failed to update title");
    console.log("Title updated successfully");
  } catch (error) {
    console.error("Error updating title:", error);
  }
};
const handleSubmit = async () => {
    // Extract choice IDs and their types
    const choiceIds = formData.questions
      .filter(q => q.is_choice && q.Choices) // Get only choice-based questions
      .flatMap(q => q.Choices.map(choice => ({ id: choice.id, type: q.type })));
  
    try {
      // Update question texts
      for (const [id, text] of Object.entries(questionTexts)) {
        await updateQuestionText(id, text);
      }
  
      // Update scores
      const scorePromises = Object.entries(scores)
        .filter(([id, score]) => score !== "" && score !== null && score !== undefined)
        .map(([id, score]) => {
            const findQuestion = (questions, id) => {
                return questions.some(q => 
                  q.id === id || (q.Subquestions && findQuestion(q.Subquestions, id))
                );
              };
              
              const isQuestion = findQuestion(formData.questions, id);
          console.log(isQuestion);
          const isChoice = formData.questions.some((q) =>
            q.Choices?.some((c) => c.id === id)
          );

         
  
          let type;
          if (isQuestion) {
            type = "question";
          } else if (isChoice) {
            type = "choice";
          } else {
            console.error(`Unknown type for ID: ${id}`);
            return null; // Skip unknown IDs
          }
  
          console.log(`Updating ${type} score for ID: ${id} with score: ${score}`);
          return updateScoreAPI(id, score, type);
        })
        .filter(Boolean); // Remove any null values
  
      await Promise.all(scorePromises);
      console.log(scorePromises);
  
      // Handle different types and call the appropriate API
    //   for (const choice of choiceIds) {
    //     switch (choice.type) {
    //       case "Choice":
    //         await submitChoiceAPI(choice.id);
    //         break;
    //       case "Text":
    //         await submitTextAPI(choice.id);
    //         break;
    //       case "Date":
    //         await submitDateAPI(choice.id);
    //         break;
    //       default:
    //         console.error(`Unknown type: ${choice.type} for ID: ${choice.id}`);
    //     }
    //   }
  
      // Update title & description only on submit
      if (title !== formData.name) {
        await updateTitle(formData.id, title);
      }
      if (description !== formData.description) {
        await updateDescription(formData.id, description);
      }
  
      alert("Form updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while updating the form.");
    }
  };
  
  
  
  

  const handleScoreChange = (id, value, type) => {
    setScores((prev) => ({ ...prev, [id]: value }));
    // updateScoreAPI(id, value, type);
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

  const renderScoreField = (questionId) => {
    return (
      <div className="score-container">
        <label htmlFor={`score-${questionId}`} className="score-label">
          Score:
        </label>
        <input
          type="number"
          id={`score-${questionId}`}
          className="score-input"
          value={scores[questionId] || ""}
          onChange={(e) => handleScoreChange(questionId, e.target.value)}
        />
      </div>
    );
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
        <input
        type="text"
        value={questionTexts[question.id] || question.question_text || ""}
        onChange={(e) => onQuestionTextChange(question.id, e.target.value)}
        className="question-text-input"
      />
        {renderInput(question, questionIndex)}
        {renderScoreField(question.id)} {/* Render score field */}
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

        <h2>Form Update</h2>
        <div className="form-title">
          <h3>{formData.name || "No title provided"}</h3>
          <p>{formData.description || "No description provided"}</p>
          <input
            type="text"
            placeholder="Type your answer"
            value={title}
            onChange={onTitleChange}
            className="text-input-title"
            editable
          />
          <input
            type="text"
            placeholder="Type your answer"
            value={description}
            onChange={onDescriptionChange}
            className="text-input-title"
          />
        </div>
        <div className="form-container">
          {/* Render questions */}

          <div className="formQuestions">
            {formData.questions.map((question, index) => (
              <QuestionRender
                key={question.id}
                question={question}
                questionIndex={index + 1}
                answers={answers}
                scores={scores}
                onAnswerChange={handleAnswerChange}
                onScoreChange={handleScoreChange} // Pass the score handler
                onQuestionTextChange={onQuestionTextChange}
              />
            ))}
            {/* <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button> */}
            <div className="submit-button-container">

                <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewUpdate;
