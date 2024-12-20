// import React, { useState, useEffect } from "react";
// import AppDrawer from "../../components/AppDrawer";
// import "./CSP_form.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   handleOptionCountChange,
//   handleAddSubQuestion,
//   handleDeleteSubQuestion,
//   handleSubQuestionOptionCountChange,
//   handleAddOptionToSubQuestion,
//   addQuestion,
//   handleDeleteOptionFromSubQuestion,
//   handleDeleteQuestion,
//   handleQuestionChange,
//   handleQuestionTypeChange,
//   handleOptionChange,
//   handleSubQuestionChange,
//   handleSubQuestionTypeChange,
// } from "./CSP_form.utils";

// function CSP_form() {
//   const [State, setState] = useState(false);

//   // Initialize questions from localStorage or default to an empty array
//   const [questions, setQuestions] = useState(() => {
//     const savedQuestions = localStorage.getItem("questions");
//     return savedQuestions
//       ? JSON.parse(savedQuestions)
//       : [{ question: "", type: "text", options: [], subQuestions: [] }];
//   });

//   useEffect(() => {
//     localStorage.setItem("questions", JSON.stringify(questions));
//   }, [questions]);

//   // Placeholder for form creation logic
//   const handleFormCreate = () => {
//     console.log("Form Created with Questions:", questions);
//   };

//   return (
// <div className="main">
//   <div className="outerContainer" style={{ marginLeft: State ? "20%" : 0 }}>
//     <AppDrawer onChange={setState} />
//     <div className="innerContainer">
//       <div className="questionDetails">
//         <div className="questionDiv">
//           <input className="text" type="text" placeholder="Name:" />
//         </div>
//         <div className="questionDiv">
//           <input className="text" type="number" placeholder="Version:" />
//         </div>
//       </div>
import * as bootstrap from 'bootstrap';
import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import "./CSP_form.css";
import {
  handleOptionCountChange,
  handleAddSubQuestion,
  handleDeleteSubQuestion,
  handleSubQuestionOptionCountChange,
  handleAddOptionToSubQuestion,
  addQuestion,
  handleDeleteOptionFromSubQuestion,
  handleDeleteQuestion,
  handleQuestionChange,
  handleQuestionTypeChange,
  handleOptionChange,
  handleSubQuestionChange,
  handleSubQuestionTypeChange,
} from "./CSP_form.utils";

import { Form_Creation } from "../../services/Api";

function CSP_form() {
  const [State, setState] = useState(false);
  const [formName, setFormName] = useState("");
  const [formVersion, setFormVersion] = useState(1);
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions
      ? JSON.parse(savedQuestions)
      : [{ question: "", type: "text", options: [], subQuestions: [] }];
  });

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const submitForm = async () => {
    // const formPayload = {
    //   name: formName,
    //   description: "A survey to check the APIs",
    //   version: formVersion,
    //   status: "active",
    //   questions: questions.map((q) => {
    //     // Determine question type (Yes/No, Options, Text, or Image)
    //     const isYesNo = q.type === "Yes/No";
    //     const isOptions = q.type === "options";
    //     const isImage = q.type === "Image";
    //     const isDate = q.type === "Date";

    //     // Handle Choices (for Yes/No or Options)
    //     const choices = isYesNo
    //       ? ["Yes", "No"].map((option, oIndex) => ({
    //           choice_text: option,
    //           score: oIndex === 0 ? 5 : 2, // Example scoring for Yes/No
    //           subquestions: q.subQuestions[oIndex]?.map((subQ) => ({
    //             question_text: subQ.subQuestion,
    //             type:
    //               subQ.type === "options"
    //                 ? "Choice"
    //                 : subQ.type === "Image"
    //                 ? "Image"
    //                 : subQ.type === "Date"
    //                 ? "Date"
    //                 : "Text",
    //             is_choice: subQ.type === "options",
    //           })),
    //         }))
    //       : isOptions
    //       ? q.options.map((opt, oIndex) => ({
    //           choice_text: opt,
    //           score: oIndex === 0 ? 5 : 2, // Example scoring
    //           subquestions: q.subQuestions[oIndex]?.map((subQ) => ({
    //             question_text: subQ.subQuestion,
    //             type:
    //               subQ.type === "options"
    //                 ? "Choice"
    //                 : subQ.type === "Image"
    //                 ? "Image"
    //                 : subQ.type === "Date"
    //                 ? "Date"
    //                 : "Text",
    //             is_choice: subQ.type === "options",
    //           })),
    //         }))
    //       : undefined; // No choices for Text or Image type

    //     return {
    //       question_text: q.question,
    //       type:
    //         isOptions || isYesNo
    //           ? "Choice"
    //           : isImage
    //           ? "Image"
    //           : isDate
    //           ? "Date"
    //           : "Text",
    //       is_choice: isOptions || isYesNo,
    //       choices: choices,
    //     };
    //   }),
    // };

    let mainOrderCounter = 0; // Counter for main_order

    // Helper function to process subquestions
    const processSubQuestions = (subQuestions, parentId) => {
      return subQuestions?.map((subQ, subIndex) => ({
        question_text: subQ.subQuestion,
        type:
          subQ.type === "options"
            ? "Choice"
            : subQ.type === "Image"
            ? "Image"
            : subQ.type === "Date"
            ? "Date"
            : "Text",
        is_choice: subQ.type === "options",
        score: null,
        main_order: ++mainOrderCounter,
        parent_id: parentId,
        choice_id: null,
        choices:
          subQ.type === "options"
            ? subQ.options?.map((opt, oIndex) => ({
                choice_text: opt,
                score: oIndex === 0 ? 5 : 2, // Example scoring
              }))
            : undefined,
      }));
    };
  
    const formPayload = {
      name: formName,
      description: "A survey to check the APIs",
      product_uuid: "bbf98b4b-517d-407a-b4d6-5eb169152577",
      version: formVersion,
      status: "active",
      questions: questions.map((q) => {
        const isYesNo = q.type === "Yes/No";
        const isOptions = q.type === "options";
        const isImage = q.type === "Image";
        const isDate = q.type === "Date";
  
        const choices = isYesNo
          ? ["Yes", "No"].map((option, oIndex) => ({
              choice_text: option,
              score: oIndex === 0 ? 5 : 2,
              subquestions: processSubQuestions(q.subQuestions[oIndex], option),
            }))
          : isOptions
          ? q.options.map((opt, oIndex) => ({
              choice_text: opt,
              score: oIndex === 0 ? 5 : 2,
              subquestions: processSubQuestions(q.subQuestions[oIndex], opt),
            }))
          : undefined;
  
        return {
          question_text: q.question,
          type:
            isOptions || isYesNo
              ? "Choice"
              : isImage
              ? "Image"
              : isDate
              ? "Date"
              : "Text",
          is_choice: isOptions || isYesNo,
          score: null,
          main_order: ++mainOrderCounter,
          parent_id: null,
          choice_id: null,
          choices,
        };
      }),
    };
  
    // Submit the formPayload to the API or use it as needed
    console.log(formPayload);

    try {
      const response = await Form_Creation(formPayload);

      if (!response.ok) {
        const errorDetails = await response.text(); // Capture server response
        console.error("Submission error:", errorDetails);
        throw new Error("Failed to submit the form: " + errorDetails);
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      alert("Form Submitted successfully!!");
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Form submission unsuccessfull !!");
    }
  };

  return (
    <div className="main">
      <div className="outerContainer" style={{ marginLeft: State ? "20%" : 0 }}>
        <AppDrawer onChange={setState} />
        <div className="innerContainer">
          <div className="questionDetails">
            <div className="questionDiv">
              <input
                className="text"
                type="text"
                placeholder="Name:"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="questionDiv">
              <input
                className="text"
                type="number"
                placeholder="Version:"
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
              />
            </div>
          </div>

          {questions.length > 0 ? (
            questions.map((question, qIndex) => (
              <div key={qIndex} className="questionBlock">
                {/* Question Block */}
                <div className="questionBox">
                  <div className="questionIndex">
                    <h3>{qIndex + 1}</h3>
                  </div>
                  <div className="question">
                    <input
                      className="questionInput"
                      type="text"
                      placeholder={`Question ${qIndex + 1}`}
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, e, setQuestions)
                      }
                    />
                    <div className="optionBoxOrganised">
                      <div className="questionType">
                        <h4 className="label">Question Type</h4>
                      </div>
                      <select
                        className="option"
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionTypeChange(qIndex, e, setQuestions)
                        }
                      >
                        <option value="text">Text</option>
                        <option value="options">Options</option>
                        <option value="Yes/No">Yes/No</option>
                        <option value="Image">Image</option>
                        <option value="Date">Date</option>
                      </select>

                      {/* Dynamic Options Count Input */}
                      {question.type === "options" && (
                        <input
                          className="optionCount"
                          type="number"
                          placeholder="Number of Options"
                          onChange={(e) =>
                            handleOptionCountChange(qIndex, e, setQuestions)
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="icon">
                    <img
                      className="icon-img"
                      style={{ width: "30px", height: "30px" }}
                      src="../public/trash.png"
                      onClick={() => handleDeleteQuestion(qIndex, setQuestions)}
                      alt="Delete"
                    />
                  </div>
                </div>

                {question.type === "Yes/No" &&
                  ["Yes", "No"].map((option, oIndex) => (
                    <div key={oIndex}>
                      <div className="optionBoxExtended">
                        <div className="optionBox">
                          <input
                            className="questionInput"
                            type="text"
                            value={option}
                            disabled
                          />

                          {/* Subquestions for Yes/No */}
                          {question.subQuestions[oIndex]?.map(
                            (subQuestion, sIndex) => (
                              <div key={sIndex} className="subQuestionBlock">
                                <div className="subQuestionBox">
                                  <div className="subQuestionIndex">
                                    <h3>{sIndex + 1}</h3>
                                  </div>
                                  <input
                                    className="questionInput"
                                    type="text"
                                    style={{ width: "80%" }}
                                    placeholder={`Subquestion ${sIndex + 1}`}
                                    value={subQuestion.subQuestion}
                                    onChange={(e) =>
                                      handleSubQuestionChange(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        e,
                                        setQuestions
                                      )
                                    }
                                  />
                                  <div
                                    className="icon"
                                    style={{
                                      margin: "0",
                                      width: "45px",
                                      height: "45px",
                                    }}
                                  >
                                    <img
                                      className="icon-img"
                                      src="../public/trash.png"
                                      style={{ width: "30px", height: "30px" }}
                                      onClick={() =>
                                        handleDeleteSubQuestion(
                                          qIndex,
                                          oIndex,
                                          sIndex,
                                          setQuestions
                                        )
                                      }
                                      alt="Delete"
                                    />
                                  </div>
                                </div>

                                {/* Subquestion Type and Option Count */}
                                <div className="subQuestionOptionBox">
                                  <select
                                    className="option"
                                    value={subQuestion.type}
                                    onChange={(e) =>
                                      handleSubQuestionTypeChange(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        e,
                                        setQuestions
                                      )
                                    }
                                  >
                                    <option value="text">Text</option>
                                    <option value="options">Options</option>
                                    <option value="Yes/No">Yes/No</option>
                                    <option value="Image">Image</option>
                                    <option value="Date">Date</option>
                                  </select>

                                  {subQuestion.type === "options" && (
                                    <input
                                      className="optionCount"
                                      type="number"
                                      placeholder="Number of Options"
                                      onChange={(e) =>
                                        handleSubQuestionOptionCountChange(
                                          qIndex,
                                          oIndex,
                                          sIndex,
                                          e,
                                          setQuestions
                                        )
                                      }
                                    />
                                  )}
                                </div>

                                {/* Handling Options within Subquestions */}
                                {subQuestion.type === "options" &&
                                  subQuestion.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="optionBlock">
                                      <div className="subOptionExtended">
                                        <input
                                          className="questionInput"
                                          type="text"
                                          style={{ width: "80%" }}
                                          placeholder={`Sub-Option ${
                                            optIndex + 1
                                          }`}
                                          value={opt}
                                          onChange={(e) =>
                                            handleOptionChange(
                                              qIndex,
                                              oIndex,
                                              optIndex,
                                              e,
                                              setQuestions
                                            )
                                          }
                                        />
                                        <div className="icon">
                                          <img
                                            className="icon-img"
                                            src="../public/trash.png"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            onClick={() =>
                                              handleDeleteOptionFromSubQuestion(
                                                qIndex,
                                                oIndex,
                                                sIndex,
                                                optIndex,
                                                setQuestions
                                              )
                                            }
                                            alt="Delete"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )
                          )}

                          {/* Add Subquestion Button for Yes/No Options */}
                          <div className="addBtn">
                            <button
                              className="btn btn-add"
                              style={{
                                backgroundColor: " #8065EB",
                                color: "white",
                              }}
                              onClick={() =>
                                handleAddSubQuestion(
                                  qIndex,
                                  oIndex,
                                  setQuestions
                                )
                              }
                            >
                              Add Subquestion
                            </button>
                          </div>

                          {/* Add Option Button for Subquestions */}
                          {question.subQuestions[oIndex]?.map(
                            (subQuestion, sIndex) =>
                              subQuestion.type === "options" && (
                                <div key={sIndex} className="addOptionBlock">
                                  {/* <button
                                    className="btn btn-add-option"
                                    style={{backgroundColor:' #8065EB',color:'white'}}
                                    onClick={() =>
                                      handleAddOptionToSubQuestion(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        setQuestions
                                      )
                                    }
                                  >
                                    Add Option to Subquestion
                                  </button> */}
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Handling Regular Options */}
                {question.type === "options" &&
                  question.options.map((option, oIndex) => (
                    <div key={oIndex} className="optionBlock">
                      <div className="optionBoxExtended">
                        <div className="optionBox">
                          <input
                            className="questionInput"
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                e,
                                setQuestions
                              )
                            }
                          />
                          <div
                            className="questionType"
                            onClick={() =>
                              handleAddSubQuestion(qIndex, oIndex, setQuestions)
                            }
                          >
                            <h4 className="addSubQuestion">Add Sub Question</h4>
                          </div>

                          {/* Subquestions for Regular Options */}
                          {question.subQuestions[oIndex]?.map(
                            (subQuestion, sIndex) => (
                              <div key={sIndex} className="subQuestionBlock">
                                <div className="subQuestionBox">
                                  <div className="subQuestionIndex">
                                    <h3>{sIndex + 1}</h3>
                                  </div>
                                  <input
                                    className="questionInput"
                                    type="text"
                                    style={{ width: "80%" }}
                                    placeholder={`Subquestion ${sIndex + 1}`}
                                    value={subQuestion.subQuestion}
                                    onChange={(e) =>
                                      handleSubQuestionChange(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        e,
                                        setQuestions
                                      )
                                    }
                                  />
                                  <div
                                    className="icon"
                                    style={{
                                      margin: "0",
                                      width: "45px",
                                      height: "45px",
                                    }}
                                  >
                                    <img
                                      className="icon-img"
                                      src="../public/trash.png"
                                      style={{ width: "30px", height: "30px" }}
                                      onClick={() =>
                                        handleDeleteSubQuestion(
                                          qIndex,
                                          oIndex,
                                          sIndex,
                                          setQuestions
                                        )
                                      }
                                      alt="Delete"
                                    />
                                  </div>
                                </div>

                                {/* Subquestion Type and Option Count */}
                                <div className="subQuestionOptionBox">
                                  <select
                                    className="option"
                                    value={subQuestion.type}
                                    onChange={(e) =>
                                      handleSubQuestionTypeChange(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        e,
                                        setQuestions
                                      )
                                    }
                                  >
                                    <option value="text">Text</option>
                                    <option value="options">Options</option>
                                    <option value="Yes/No">Yes/No</option>
                                    <option value="Image">Image</option>
                                    <option value="Date">Date</option>
                                  </select>

                                  {subQuestion.type === "options" && (
                                    <input
                                      className="optionCount"
                                      type="number"
                                      placeholder="Number of Options"
                                      onChange={(e) =>
                                        handleSubQuestionOptionCountChange(
                                          qIndex,
                                          oIndex,
                                          sIndex,
                                          e,
                                          setQuestions
                                        )
                                      }
                                    />
                                  )}
                                </div>

                                {/* Handling Options within Subquestions */}
                                {subQuestion.type === "options" &&
                                  subQuestion.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="optionBlock">
                                      <div className="subOptionExtended">
                                        <input
                                          className="questionInput"
                                          type="text"
                                          style={{ width: "80%" }}
                                          placeholder={`Sub-Option ${
                                            optIndex + 1
                                          }`}
                                          value={opt}
                                          onChange={(e) =>
                                            handleOptionChange(
                                              qIndex,
                                              oIndex,
                                              optIndex,
                                              e,
                                              setQuestions
                                            )
                                          }
                                        />
                                        <div className="icon">
                                          <img
                                            className="icon-img"
                                            src="../public/trash.png"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            onClick={() =>
                                              handleDeleteOptionFromSubQuestion(
                                                qIndex,
                                                oIndex,
                                                sIndex,
                                                optIndex,
                                                setQuestions
                                              )
                                            }
                                            alt="Delete"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )
                          )}

                          {/* Add Subquestion Button for Regular Options */}
                          {/* <div className="addBtn">
                            <button
                              className="btn btn-add"
                              onClick={() =>
                                handleAddSubQuestion(qIndex, oIndex, setQuestions)
                              }
                            >
                              Add Subquestion
                            </button>
                          </div> */}

                          {/* Add Option Button for Subquestions */}
                          {question.subQuestions[oIndex]?.map(
                            (subQuestion, sIndex) =>
                              subQuestion.type === "options" && (
                                <div key={sIndex} className="addOptionBlock">
                                  {/* <button
                                    className="btn btn-add-option"
                                    onClick={() =>
                                      handleAddOptionToSubQuestion(
                                        qIndex,
                                        oIndex,
                                        sIndex,
                                        setQuestions
                                      )
                                    }
                                  >
                                    Add Option to Subquestion
                                  </button> */}
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <div className="noQuestionBox">No questions available</div>
          )}

          {/* Add Question Button */}
          <div className="addBtn">
            <img
              style={{ width: "45px", height: "45px" }}
              src="/public/add.png"
              onClick={() => addQuestion(setQuestions)}
            />
          </div>

          {/* Create Form Button */}
          <div className="createBtn">
          <button className="btn btn-primary" type="submit" onClick={submitForm}>Create Form</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CSP_form;
