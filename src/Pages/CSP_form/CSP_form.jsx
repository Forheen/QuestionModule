import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";

function CSP_form() {
  const [State, setState] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions
      ? JSON.parse(savedQuestions)
      : [{ question: "", type: "text", options: [], subQuestions: [] }];
  });
  const [isQuestion,setIsQuestion] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "text", options: [], subQuestions: [] },
      
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    
  };

  useEffect(()=>
  {
    if(questions.length === 0)
    {
      setIsQuestion(false);
    }
    else{
      setIsQuestion(true);
    }
  },[questions]);


  const handleAddSubQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].subQuestions.push({
      subQuestion: "",
      type: "text",
      options: [],
    });
    setQuestions(newQuestions);
  };

  const handleDeleteSubQuestion = (questionIndex, subQuestionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions = newQuestions[
      questionIndex
    ].subQuestions.filter((_, i) => i !== subQuestionIndex);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubQuestionChange = (questionIndex, subQuestionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].subQuestion =
      event.target.value;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].type = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubQuestionTypeChange = (
    questionIndex,
    subQuestionIndex,
    event
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].type =
      event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleAddSubOption = (questionIndex, subQuestionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubOptionChange = (
    questionIndex,
    subQuestionIndex,
    optionIndex,
    event
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options[
      optionIndex
    ] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleDeleteSubOption = (
    questionIndex,
    subQuestionIndex,
    optionIndex
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options =
      newQuestions[questionIndex].subQuestions[subQuestionIndex].options.filter(
        (_, i) => i !== optionIndex
      );
    setQuestions(newQuestions);
  };

  const handleFormCreate=()=>
  {
    alert("Created")
  }

  // console.log('working');
  // console.log(State);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          padding: 0,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          overflowY: "auto",
        }}
      >
        <AppDrawer onChange={setState}></AppDrawer>

        <div
          style={{
            width: "100%",
            height: "100%",
            marginLeft: State === true ? "20%" : 0,
            color: "black",
            marginTop: "8%",
            transition: "margin-left 0.2s ease",
            // overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              // backgroundColor: "red",
              display: "flex",
              // alignItems: "center",
              flexDirection: "column",
              // overflowY: "auto",
              paddingBottom: "10%",
              marginLeft:'10%',
              overflow: "auto",
              // marginTop:'5%'
            }}
          >
            <div style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between',width:'30%',marginTop:'2%'}}>
              <h1 style={{fontSize:20}}>1. Add form name : </h1>
              <input type="text" placeholder="Enter form name"></input>
            </div>
            <div style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between',width:'30%',marginTop:'2%'}}>
              <h1 style={{fontSize:20}}>2. Add form version : </h1>
              <input type="number" placeholder="Enter version"></input>
            </div>
            <div style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between',width:'90%',marginTop:'2%'}}>
              <h1 style={{fontSize:20}}>3. Add Questions : </h1>
              <div style={{ }}>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
             
            </div>
            {questions.map((question, index) => (
              <div
                key={index}
                style={{ marginTop: "1%" }}
              >
                <h3 style={{fontSize:25}}>Question {index + 1}</h3>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "80%",
                      justifyContent: "center",
                      marginBottom: "4%",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={`Question ${index + 1}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, e)}
                      style={{
                        width: "50rem",
                        padding: "1%",
                        borderRadius: 10,
                      }}
                    />
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionTypeChange(index, e)}
                      style={{
                        marginLeft: "4%",
                        borderRadius: 5,
                        padding: "1%",
                      }}
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
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => handleAddSubQuestion(index)}
                  >
                    Add Subquestion
                  </button>
                </div>

                {question.type === "options" && (
                  <div
                    style={{
                      marginLeft: "20px",
                      marginBottom: "10px",
                      marginTop: "4%",
                    }}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "1%",
                        }}
                      >
                        <h1 style={{ fontSize: 20, marginRight: "2%" }}>
                          {optionIndex + 1}
                        </h1>
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, optionIndex, e)
                          }
                          style={{
                            width: "30%",
                            padding: "1%",
                            borderRadius: 10,
                          }}
                        />

                        <button
                          type="button"
                          class="btn btn-danger mx-2 "
                          onClick={() => handleDeleteOption(index, optionIndex)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      class="btn btn-info my-3 mx-4"
                      onClick={() => handleAddOption(index)}
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          type="text"
                          placeholder={`Subquestion ${index + 1}.${
                            subIndex + 1
                          }`}
                          value={subQuestion.subQuestion}
                          onChange={(e) =>
                            handleSubQuestionChange(index, subIndex, e)
                          }
                          style={{
                            width: "30rem",
                            padding: ".5%",
                            borderRadius: 10,
                          }}
                        />
                        <select
                          value={subQuestion.type}
                          onChange={(e) =>
                            handleSubQuestionTypeChange(index, subIndex, e)
                          }
                          style={{
                            marginLeft: "4%",
                            padding: ".5%",
                            borderRadius: 5,
                          }}
                        >
                          <option value="text">Text</option>
                          <option value="yesno">Yes/No</option>
                          <option value="image">Image</option>
                          <option value="options">Options</option>
                        </select>
                      </div>

                    </div>
                      <button
                        type="button"
                        class="btn btn-danger mx-2 my-2 "
                        onClick={() => handleDeleteSubQuestion(index, subIndex)}
                      >
                        Delete
                      </button>

                    {subQuestion.type === "options" && (
                      <div
                        style={{
                          marginLeft: "20px",
                          marginBottom: "10px",
                          marginTop: "4%",
                        }}
                      >
                        {subQuestion.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "2%",
                            }}
                          >
                            <h1 style={{ fontSize: 20, marginRight: "2%" }}>
                              {optionIndex + 1}
                            </h1>
                            <input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleSubOptionChange(
                                  index,
                                  subIndex,
                                  optionIndex,
                                  e
                                )
                              }
                              style={{
                                width: "30%",
                                padding: ".5%",
                                borderRadius: 10,
                              }}
                            />

                            <button
                              type="button"
                              class="btn btn-danger mx-2 "
                              onClick={() =>
                                handleDeleteSubOption(
                                  index,
                                  subIndex,
                                  optionIndex
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
                          onClick={() => handleAddSubOption(index, subIndex)}
                        >
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
        {
          !isQuestion || (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <button type="button" class="btn btn-dark" onClick={handleFormCreate}>Create Form</button>
            </div>
          )
        }
            

          </div>
        </div>
      </div>
    </>
  );
}

export default CSP_form;
