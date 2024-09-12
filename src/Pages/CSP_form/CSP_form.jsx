import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import "./CSP_form.css"; // Assuming the styles are in this file
import "bootstrap/dist/css/bootstrap.min.css";

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

  // Handles changing the number of options for a main question
  const handleOptionCountChange = (qIndex, e) => {
    const optionCount = parseInt(e.target.value, 10);
    if (isNaN(optionCount) || optionCount < 1) return;

    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentQuestion = { ...newQuestions[qIndex] };

      currentQuestion.options = Array(optionCount)
        .fill("")
        .map((opt, idx) => currentQuestion.options[idx] || "");

      currentQuestion.subQuestions = Array(optionCount)
        .fill()
        .map((_, idx) => currentQuestion.subQuestions[idx] || []);

      newQuestions[qIndex] = currentQuestion;
      return newQuestions;
    });
  };

  // Adds a subquestion to a specific option
  const handleAddSubQuestion = (qIndex, oIndex) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];

      if (!newQuestions[qIndex].subQuestions[oIndex]) {
        newQuestions[qIndex].subQuestions[oIndex] = [];
      }

      const subQuestionsArray = newQuestions[qIndex].subQuestions[oIndex];

      if (
        subQuestionsArray.length === 0 ||
        subQuestionsArray.every((sq) => sq.subQuestion.trim() !== "")
      ) {
        subQuestionsArray.push({
          subQuestion: "",
          type: "text",
          options: [],
        });
      }

      return newQuestions;
    });
  };

  // Handles deleting a specific subquestion
  const handleDeleteSubQuestion = (qIndex, oIndex, sIndex) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];

      const updatedSubQuestions = currentSubQuestions.filter(
        (_, index) => index !== sIndex
      );

      newQuestions[qIndex].subQuestions[oIndex] =
        updatedSubQuestions.length > 0 ? updatedSubQuestions : [];

      return newQuestions;
    });
  };

  // Handles changing the number of options for a subquestion
  const handleSubQuestionOptionCountChange = (qIndex, oIndex, sIndex, e) => {
    const optionCount = parseInt(e.target.value, 10);
    if (isNaN(optionCount) || optionCount < 1) return;

    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];
      const currentSubQuestion = { ...currentSubQuestions[sIndex] };

      currentSubQuestion.options = Array(optionCount)
        .fill("")
        .map((opt, idx) => currentSubQuestion.options[idx] || "");

      currentSubQuestions[sIndex] = currentSubQuestion;
      newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
      return newQuestions;
    });
  };

  // Handles adding an option to a subquestion
  const handleAddOptionToSubQuestion = (qIndex, oIndex, sIndex) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];
      const currentSubQuestion = { ...currentSubQuestions[sIndex] };

      currentSubQuestion.options = [...currentSubQuestion.options, ""];

      currentSubQuestions[sIndex] = currentSubQuestion;
      newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
      return newQuestions;
    });
  };

  // Handles deleting an option from a subquestion
  const handleDeleteOptionFromSubQuestion = (
    qIndex,
    oIndex,
    sIndex,
    optIndex
  ) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];
      const currentSubQuestion = { ...currentSubQuestions[sIndex] };

      const updatedOptions = currentSubQuestion.options.filter(
        (_, index) => index !== optIndex
      );

      currentSubQuestion.options = updatedOptions;

      currentSubQuestions[sIndex] = currentSubQuestion;
      newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
      return newQuestions;
    });
  };

  // Handles adding a new question
  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", type: "text", options: [], subQuestions: [] },
    ]);
  };

  // Handles deleting a specific question
  const handleDeleteQuestion = (qIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, index) => index !== qIndex)
    );
  };

  // Handles changing the main question text
  const handleQuestionChange = (qIndex, e) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[qIndex] = { ...newQuestions[qIndex], question: value };
      return newQuestions;
    });
  };

  // Handles changing the question type
  const handleQuestionTypeChange = (qIndex, e) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentQuestion = { ...newQuestions[qIndex], type: value };

      if (value === "options" && !currentQuestion.options.length) {
        currentQuestion.options = [""];
        currentQuestion.subQuestions = [[]];
      } else if (value !== "options") {
        currentQuestion.options = [];
        currentQuestion.subQuestions = [];
      }

      newQuestions[qIndex] = currentQuestion;
      return newQuestions;
    });
  };

  // Handles changing the option text
  const handleOptionChange = (qIndex, oIndex, e) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentOptions = [...newQuestions[qIndex].options];
      currentOptions[oIndex] = value;
      newQuestions[qIndex] = {
        ...newQuestions[qIndex],
        options: currentOptions,
      };
      return newQuestions;
    });
  };

  // Handles changing the subquestion text
  const handleSubQuestionChange = (qIndex, oIndex, sIndex, e) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];
      currentSubQuestions[sIndex] = {
        ...currentSubQuestions[sIndex],
        subQuestion: value,
      };
      newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
      return newQuestions;
    });
  };

  // Handles changing the subquestion type
  const handleSubQuestionTypeChange = (qIndex, oIndex, sIndex, e) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      const currentSubQuestions = [
        ...newQuestions[qIndex].subQuestions[oIndex],
      ];
      currentSubQuestions[sIndex] = {
        ...currentSubQuestions[sIndex],
        type: value,
      };
      newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
      return newQuestions;
    });
  };

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
          <div div className="questionDetails">
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
                    <h3 className="questionHeader">{qIndex + 1}</h3>
                  </div>
                  <div className="question">
                    <input
                      className="questionInput"
                      type="text"
                      placeholder={`Question ${qIndex + 1}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, e)}
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
                        onChange={(e) => handleQuestionTypeChange(qIndex, e)}
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
                          onChange={(e) => handleOptionCountChange(qIndex, e)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="icon">
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src="../public/trash.png"
                      onClick={() => handleDeleteQuestion(qIndex)}
                    ></img>
                  </div>
                </div>

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
                                handleOptionChange(qIndex, oIndex, e)
                              }
                            />
                            <div
                              className="questionType"
                              style={{ marginBottom: "2%" }}
                              onClick={() =>
                                handleAddSubQuestion(qIndex, oIndex)
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
                                        <h3 className="questionHeader">
                                          {sIndex + 1}
                                        </h3>
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
                                            e
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
                                              sIndex
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
                                            e
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
                                              e
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
                                                          optIndex
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
                            ></img>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "4%",
                marginTop: "4%",
              }}
            >
              <p>No questions available. Please add some questions.</p>
            </div>
          )}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: "4%",
              marginTop: "4%",
            }}
          >
            <img
              style={{ width: "45px", height: "45px" }}
              src="/public/add.png"
              onClick={addQuestion}
            ></img>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingBottom: "10%",
            }}
          >
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
