import React, { useState, useEffect } from 'react';
import AppDrawer from '../../components/AppDrawer';
// import CSP_formUils from './CSP_formUtils';

function CSP_form() {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('questions');
    return savedQuestions ? JSON.parse(savedQuestions) : [{ question: '', type: 'text', options: [], subQuestions: [] }];
  });


  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', type: 'text', options: [], subQuestions: [] }]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleAddSubQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].subQuestions.push({ subQuestion: '', type: 'text', options: [] });
    setQuestions(newQuestions);
  };

  const handleDeleteSubQuestion = (questionIndex, subQuestionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions = newQuestions[questionIndex].subQuestions.filter(
      (_, i) => i !== subQuestionIndex
    );
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubQuestionChange = (questionIndex, subQuestionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].subQuestion = event.target.value;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].type = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubQuestionTypeChange = (questionIndex, subQuestionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].type = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleAddSubOption = (questionIndex, subQuestionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubOptionChange = (questionIndex, subQuestionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleDeleteSubOption = (questionIndex, subQuestionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options = newQuestions[questionIndex].subQuestions[subQuestionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  return (
    <>
      <AppDrawer />
      <div style={{ padding: 50 }}>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>Question {index + 1}</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(index, e)}
                style={{ width: '300px', padding: '5px', marginBottom: '10px' }}
              />
              <button
                onClick={() => handleDeleteQuestion(index)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                Delete Question
              </button>
            </div>

            <select
              value={question.type}
              onChange={(e) => handleQuestionTypeChange(index, e)}
              style={{ marginBottom: '10px' }}
            >
              <option value="text">Text</option>
              <option value="yesno">Yes/No</option>
              <option value="image">Image</option>
              <option value="options">Options</option>
            </select>

            {question.type === 'options' && (
              <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e)}
                      style={{ width: '280px', padding: '5px' }}
                    />
                    <button
                      onClick={() => handleDeleteOption(index, optionIndex)}
                      style={{ marginLeft: '10px', padding: '5px' }}
                    >
                      Delete Option
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddOption(index)}
                  style={{ padding: '5px', marginTop: '10px' }}
                >
                  Add Option
                </button>
              </div>
            )}

            <button
              onClick={() => handleAddSubQuestion(index)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              Add Subquestion
            </button>

            {question.subQuestions.map((subQuestion, subIndex) => (
              <div key={subIndex} style={{ marginLeft: '20px', marginTop: '10px' }}>
                <h4>Subquestion {index + 1}.{subIndex + 1}</h4>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={`Subquestion ${index + 1}.${subIndex + 1}`}
                    value={subQuestion.subQuestion}
                    onChange={(e) => handleSubQuestionChange(index, subIndex, e)}
                    style={{ width: '280px', padding: '5px' }}
                  />
                  <button
                    onClick={() => handleDeleteSubQuestion(index, subIndex)}
                    style={{ marginLeft: '10px', padding: '5px' }}
                  >
                    Delete Subquestion
                  </button>
                </div>

                <select
                  value={subQuestion.type}
                  onChange={(e) => handleSubQuestionTypeChange(index, subIndex, e)}
                  style={{ marginBottom: '10px' }}
                >
                  <option value="text">Text</option>
                  <option value="yesno">Yes/No</option>
                  <option value="image">Image</option>
                  <option value="options">Options</option>
                </select>

                {subQuestion.type === 'options' && (
                  <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                    {subQuestion.options.map((option, optionIndex) => (
                      <div key={optionIndex} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => handleSubOptionChange(index, subIndex, optionIndex, e)}
                          style={{ width: '260px', padding: '5px' }}
                        />
                        <button
                          onClick={() => handleDeleteSubOption(index, subIndex, optionIndex)}
                          style={{ marginLeft: '10px', padding: '5px' }}
                        >
                          Delete Option
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddSubOption(index, subIndex)}
                      style={{ padding: '5px', marginTop: '10px' }}
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
          style={{ padding: '10px 15px', marginTop: '20px' }}
        >
          Add Question
        </button>
      </div>
    </>
  );
}

export default CSP_form;
