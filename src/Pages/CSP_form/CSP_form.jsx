import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import "./CSP_form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  handleAddQuestion,
  handleDeleteQuestion,
  handleAddSubQuestion,
  handleDeleteSubQuestion,
  handleAddOption,
  handleAddSubOption,
  handleDeleteOption,
  handleDeleteSubOption,
  handleFormCreate,
  handleOptionChange,
  handleQuestionChange,
  handleQuestionTypeChange,
  handleSubOptionChange,
  handleSubQuestionChange,
  handleSubQuestionTypeChange,
} from "../../utils/CSP_form.utils";

function CSP_form() {
  const [State, setState] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions
      ? JSON.parse(savedQuestions)
      : [{ question: "", type: "text", options: [], subQuestions: [] }];
  });
  const [isQuestion, setIsQuestion] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (questions.length === 0) {
      setIsQuestion(false);
    } else {
      setIsQuestion(true);
    }
  }, [questions]);

  return (
    <>
      <div className="main">
        <AppDrawer onChange={setState}></AppDrawer>

        <div
          className="outerContainer"
          style={{ marginLeft: State === true ? "20%" : 0 }}
        >
          <div className="innerContainer">
            <div className="questionDiv">
              <h1 style={{ fontSize: 20 }}>1. Add form name : </h1>
              <input type="text" placeholder="Enter form name"></input>
            </div>
            <div className="questionDiv">
              <h1 style={{ fontSize: 20 }}>2. Add form version : </h1>
              <input type="number" placeholder="Enter version"></input>
            </div>
            <div className="questionDiv" style={{ width: "90%" }}>
              <h1 style={{ fontSize: 20 }}>3. Add Questions : </h1>
              <div style={{}}>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleAddQuestion(questions, setQuestions)}
                >
                  Add Question
                </button>
              </div>
            </div>
            {questions.map((question, index) => (
              <div key={index} style={{ marginTop: "1%" }}>
                <h3 style={{ fontSize: 25 }}>Question {index + 1}</h3>
                <div>
                  <div className="question">
                    <input
                      className="questionInput"
                      type="text"
                      placeholder={`Question ${index + 1}`}
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(index, e, questions, setQuestions)
                      }
                    />
                    <select
                      className="option"
                      value={question.type}
                      onChange={(e) =>
                        handleQuestionTypeChange(
                          index,
                          e,
                          questions,
                          setQuestions
                        )
                      }
                    >
                      <option value="text">Text</option>
                      <option value="yesno">Yes/No</option>
                      <option value="image">Image</option>
                      <option value="options">Options</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    class="btn btn-danger mx-2 "
                    onClick={() =>
                      handleDeleteQuestion(index, questions, setQuestions)
                    }
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() =>
                      handleAddSubQuestion(index, questions, setQuestions)
                    }
                  >
                    Add Subquestion
                  </button>
                </div>

                {question.type === "options" && (
                  <div className="questionOptionBox">
                    {question.options.map((option, optionIndex) => (
                      <div className="questionOptionItem" key={optionIndex}>
                        <h1 style={{ fontSize: 20, marginRight: "2%" }}>
                          {optionIndex + 1}
                        </h1>
                        <input
                          className="questionOptionInput"
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e,
                              questions,
                              setQuestions
                            )
                          }
                        />
                        <button
                          type="button"
                          class="btn btn-danger mx-2 "
                          onClick={() =>
                            handleDeleteOption(
                              index,
                              optionIndex,
                              questions,
                              setQuestions
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      class="btn btn-info my-3 mx-4"
                      onClick={() =>
                        handleAddOption(index, questions, setQuestions)
                      }
                    >
                      Add Option
                    </button>
                  </div>
                )}

                {question.subQuestions.map((subQuestion, subIndex) => (
                  <div
                    key={subIndex}
                    style={{ marginLeft: "20px", marginTop: "10px" }}
                  >
                    <h4>
                      Subquestion {index + 1}.{subIndex + 1}
                    </h4>
                    <div className="subquestion">
                      <input
                        type="text"
                        placeholder={`Subquestion ${index + 1}.${subIndex + 1}`}
                        value={subQuestion.subQuestion}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            index,
                            subIndex,
                            e,
                            questions,
                            setQuestions
                          )
                        }
                        style={{
                          width: "30rem",
                          padding: ".5%",
                          borderRadius: 10,
                        }}
                      />
                      <select
                        className="option"
                        style={{ padding: ".5%" }}
                        value={subQuestion.type}
                        onChange={(e) =>
                          handleSubQuestionTypeChange(
                            index,
                            subIndex,
                            e,
                            questions,
                            setQuestions
                          )
                        }
                      >
                        <option value="text">Text</option>
                        <option value="yesno">Yes/No</option>
                        <option value="image">Image</option>
                        <option value="options">Options</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      class="btn btn-danger mx-2 my-2 "
                      onClick={() =>
                        handleDeleteSubQuestion(
                          index,
                          subIndex,
                          questions,
                          setQuestions
                        )
                      }
                    >
                      Delete
                    </button>

                    {subQuestion.type === "options" && (
                      <div className="subquestionOptionBox">
                        {subQuestion.options.map((option, optionIndex) => (
                          <div
                            className="subquestionOptionItem"
                            key={optionIndex}
                          >
                            <h1 style={{ fontSize: 20, marginRight: "2%" }}>
                              {optionIndex + 1}
                            </h1>
                            <input
                              className="subquestionOptionInput"
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleSubOptionChange(
                                  index,
                                  subIndex,
                                  optionIndex,
                                  e,
                                  questions,
                                  setQuestions
                                )
                              }
                            />

                            <button
                              type="button"
                              class="btn btn-danger mx-2 "
                              onClick={() =>
                                handleDeleteSubOption(
                                  index,
                                  subIndex,
                                  optionIndex,
                                  questions,
                                  setQuestions
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          class="btn btn-info my-3 mx-4"
                          onClick={() =>
                            handleAddSubOption(
                              index,
                              subIndex,
                              questions,
                              setQuestions
                            )
                          }
                        >
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            {!isQuestion || (
              <div className="btnDiv">
                <button
                  type="button"
                  class="btn btn-dark"
                  onClick={handleFormCreate}
                >
                  Create Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CSP_form;
