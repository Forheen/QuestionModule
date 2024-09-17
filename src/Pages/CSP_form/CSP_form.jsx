import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer"; 
import "./CSP_form.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

function CSP_form() {
  const [State, setState] = useState(false);

  // Initialize questions from localStorage or default to an empty array
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions
      ? JSON.parse(savedQuestions)
      : [{ question: "", type: "text", options: [], subQuestions: [] }];
  });

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  // Placeholder for form creation logic
  const handleFormCreate = () => {
    console.log("Form Created with Questions:", questions);
  };

  return (
    <div className="main">
      <div
        className="outerContainer"
        style={{ marginLeft: State === true ? "20%" : 0 }}
      >
        <AppDrawer onChange={setState} />
        <div className="innerContainer">
          <div className="questionDetails">
            <div className="questionDiv">
              <input className="text" type="text" placeholder="Name : " />
            </div>
            <div className="questionDiv">
              <input className="text" type="number" placeholder="Version : " />
            </div>
          </div>

          {questions.length > 0 ? (
            questions.map((question, qIndex) => (
              <div key={qIndex} className="questionBlock">
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
                        <h4 style={{ fontSize: "18px", marginTop: "3px" }}>
                          Question type
                        </h4>
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
                      </select>
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
                      style={{ width: "30px", height: "30px" }}
                      src="../public/trash.png"
                      onClick={() => handleDeleteQuestion(qIndex, setQuestions)}
                    />
                  </div>
                </div>

                {question.type === "Yes/No" && (
                  <>
                    {["Yes", "No"].map((option, oIndex) => (
                      <div key={oIndex}>
                        <div className="optionBoxExtended">
                          <div className="optionBox">
                            <input
                              className="questionInput"
                              type="text"
                              value={option}
                              disabled
                            />
                            {question.subQuestions[oIndex] &&
                              question.subQuestions[oIndex].map(
                                (subQuestion, sIndex) => (
                                  <div
                                    key={sIndex}
                                    className="subQuestionBlock"
                                  >
                                    <div className="subQuestionBox">
                                      <div className="subQuestionIndex">
                                        <h3>{sIndex + 1}</h3>
                                      </div>
                                      <input
                                        className="questionInput"
                                        style={{ width: "80%" }}
                                        type="text"
                                        placeholder={`Subquestion ${
                                          sIndex + 1
                                        }`}
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
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                          }}
                                          src="../public/trash.png"
                                          onClick={(e) =>
                                            handleDeleteSubQuestion(
                                              qIndex,
                                              oIndex,
                                              sIndex,
                                              setQuestions
                                            )
                                          }
                                        />
                                      </div>
                                    </div>

                                    <div className="subQuestionOptionBox">
                                      <input
                                        placeholder="Type"
                                        className="disableInput"
                                        style={{ paddingLeft: "10%" }}
                                        disabled
                                      />
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
                                      </select>
                                      {subQuestion.type === "options" && (
                                        <input
                                          className="optionCount"
                                          type="number"
                                          placeholder="Number of Options"
                                          onChange={(e) => (
                                            qIndex,
                                            oIndex,
                                            sIndex,
                                            e,
                                            setQuestions
                                          )}
                                        />
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {question.type === "options" && (
                  <>
                    {question.options.map((option, oIndex) => (
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
                              style={{ marginBottom: "2%" }}
                              onClick={() =>
                                handleAddSubQuestion(
                                  qIndex,
                                  oIndex,
                                  setQuestions
                                )
                              }
                            >
                              <h4
                                style={{ fontSize: "18px", marginTop: "3px" }}
                              >
                                Add Sub Question
                              </h4>
                            </div>
                            {question.subQuestions[oIndex] &&
                              question.subQuestions[oIndex].map(
                                (subQuestion, sIndex) => (
                                  <div
                                    key={sIndex}
                                    className="subQuestionBlock"
                                  >
                                    <div className="subQuestionBox">
                                      <div className="subQuestionIndex">
                                        <h3>{sIndex + 1}</h3>
                                      </div>
                                      <input
                                        className="questionInput"
                                        style={{ width: "80%" }}
                                        type="text"
                                        placeholder={`Subquestion ${
                                          sIndex + 1
                                        }`}
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
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                          }}
                                          src="../public/trash.png"
                                          onClick={() =>
                                            handleDeleteSubQuestion(
                                              qIndex,
                                              oIndex,
                                              sIndex,
                                              setQuestions
                                            )
                                          }
                                        ></img>
                                      </div>
                                    </div>

                                    <div className="subQuestionOptionBox">
                                      <input
                                        placeholder="Type"
                                        className="disableInput"
                                        style={{ paddingLeft: "10%" }}
                                        disabled
                                      ></input>
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
                                    <div className="subOptionHandle">
                                      {subQuestion.type === "options" && (
                                        <>
                                          {subQuestion.options.map(
                                            (opt, optIndex) => (
                                              <div
                                                key={optIndex}
                                                className="optionBlock"
                                              >
                                                <div className="subOptionExtended">
                                                  <input
                                                    className="questionInput"
                                                    type="text"
                                                    style={{ width: "30%" }}
                                                    placeholder={`Sub-Option ${
                                                      optIndex + 1
                                                    }`}
                                                    value={opt}
                                                    onChange={(e) => {
                                                      const updatedOptions = [
                                                        ...subQuestion.options,
                                                      ];
                                                      updatedOptions[optIndex] =
                                                        e.target.value;
                                                      handleAddOptionToSubQuestion(
                                                        qIndex,
                                                        oIndex,
                                                        sIndex
                                                      );
                                                      setQuestions(
                                                        (prevQuestions) => {
                                                          const newQuestions = [
                                                            ...prevQuestions,
                                                          ];
                                                          newQuestions[
                                                            qIndex
                                                          ].subQuestions[
                                                            oIndex
                                                          ][sIndex].options =
                                                            updatedOptions;
                                                          return newQuestions;
                                                        }
                                                      );
                                                    }}
                                                  />
                                                  <div
                                                    className="icon"
                                                    style={{
                                                      marginLeft: "1%",
                                                      width: "45px",
                                                      height: "45px",
                                                    }}
                                                  >
                                                    <img
                                                      style={{
                                                        width: "30px",
                                                        height: "30px",
                                                      }}
                                                      src="../public/trash.png"
                                                      onClick={() =>
                                                        handleDeleteOptionFromSubQuestion(
                                                          qIndex,
                                                          oIndex,
                                                          sIndex,
                                                          optIndex,
                                                          setQuestions
                                                        )
                                                      }
                                                    ></img>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                          <div className="icon">
                            <img
                              style={{ width: "30px", height: "30px" }}
                              src="../public/trash.png"
                              onClick={() => {
                                setQuestions((prevQuestions) => {
                                  const newQuestions = [...prevQuestions];
                                  const currentOptions = [
                                    ...newQuestions[qIndex].options,
                                  ];
                                  currentOptions.splice(oIndex, 1);
                                  newQuestions[qIndex] = {
                                    ...newQuestions[qIndex],
                                    options: currentOptions,
                                  };
                                  return newQuestions;
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="noQuestionBox">
              <p>No questions available. Please add some questions.</p>
            </div>
          )}

          <div className="addBtn">
            <img
              style={{ width: "45px", height: "45px" }}
              src="/public/add.png"
              onClick={() => addQuestion(setQuestions)}
            />
          </div>

          <div className="createBtn">
            <button
              className="btn btn-success"
              style={{ width: "20%" }}
              onClick={handleFormCreate}
            >
              Create Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CSP_form;
