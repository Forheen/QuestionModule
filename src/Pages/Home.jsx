import React from 'react'
import AppDrawer from '../components/AppDrawer'

function Home() {
  return (
    <>
      
      <div
        style={{
          padding: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: isDrawerOpen ? "300px" : "0px", // Adjust margin based on drawer state
          transition: "margin-left 0.3s ease", // Smooth transition
          width:'100%',
          height:'100%'
        }}
      >
        <AppDrawer toggleDrawer={toggleDrawer} />
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3 style={{}}>Question {index + 1}</h3>
            <div>
              <div style={{  display: "flex",flexDirection:'row', alignItems: "center" ,width:'100%',justifyContent:'center',marginBottom:'4%' }}>
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  style={{
                    width: '40rem',
                    padding: "5px",
                    
                  }}
                />
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(index, e)}
                  style={{ marginLeft:'4%' }}
                >
                  <option value="text">Text</option>
                  <option value="yesno">Yes/No</option>
                  <option value="image">Image</option>
                  <option value="options">Options</option>
                </select>
              </div>

              <button
                onClick={() => handleDeleteQuestion(index)}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                Delete Question
              </button>

              <button
              onClick={() => handleAddSubQuestion(index)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              Add Subquestion
            </button>
            </div>

            {question.type === "options" && (
              <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e)
                      }
                      style={{ width: "280px", padding: "5px" }}
                    />
                    <button
                      onClick={() => handleDeleteOption(index, optionIndex)}
                      style={{ marginLeft: "10px", padding: "5px" }}
                    >
                      Delete Option
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddOption(index)}
                  style={{ padding: "5px", marginTop: "10px" }}
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
                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}} >

                <div style={{ display: "flex",flexDirection:'row', alignItems: "center" ,width:'100%'}}>
                  <input
                    type="text"
                    placeholder={`Subquestion ${index + 1}.${subIndex + 1}`}
                    value={subQuestion.subQuestion}
                    onChange={(e) =>
                      handleSubQuestionChange(index, subIndex, e)
                    }
                    style={{ width: "280px", padding: "5px" }}
                  />
                   <select
                  value={subQuestion.type}
                  onChange={(e) =>
                    handleSubQuestionTypeChange(index, subIndex, e)
                  }
                  style={{marginLeft:'4%' }}
                >
                  <option value="text">Text</option>
                  <option value="yesno">Yes/No</option>
                  <option value="image">Image</option>
                  <option value="options">Options</option>
                </select>
                </div>
                  <button
                    onClick={() => handleDeleteSubQuestion(index, subIndex)}
                    style={{ marginLeft: "10px", padding: "5px" ,marginTop:'5%'}}
                  >
                    Delete Subquestion
                  </button>
                </div>

                {subQuestion.type === "options" && (
                  <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                    {subQuestion.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        style={{ display: "flex", alignItems: "center" }}
                      >
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
                          style={{ width: "260px", padding: "5px" }}
                        />
                        <button
                          onClick={() =>
                            handleDeleteSubOption(index, subIndex, optionIndex)
                          }
                          style={{ marginLeft: "10px", padding: "5px" }}
                        >
                          Delete Option
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddSubOption(index, subIndex)}
                      style={{ padding: "5px", marginTop: "10px" }}
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={handleAddQuestion}
          style={{ padding: "10px 15px", marginTop: "20px" }}
        >
          Add Question
        </button>
      </div>
    </>
  )
}

export default Home