import React, { useState, useEffect } from "react";
import "./TableView.css";

const TableView = ({ csp_code }) => {
  const [combinedAnswers, setCombinedAnswers] = useState({ answers: [] });
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);

  // Step 1: Fetch all forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formsResponse = await fetch('http://testinterns.drishtee.in/forms/allforms');
        const formsData = await formsResponse.json();
        console.log('All forms fetched successfully');
        setForms(formsData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  // Step 2: Fetch responses for each form
  const fetchFormResponses = async (formIds) => {
    try {
      const allResponses = await Promise.all(
        formIds.map(async (formId) => {
          try {
            const response = await fetch('http://testinterns.drishtee.in/forms/getreport', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ form_id: formId, csp_code }),
            });
            const json = await response.json();
            if (response.ok) return json;
            console.error(`Form ${formId} response error:`, json.message || response.statusText);
            return null; // Skip or handle failed requests
          } catch (error) {
            console.error(`Error fetching responses for form ${formId}:`, error);
            return null; // Return null for failed requests
          }
        })
      );

      // Filter out null responses and combine answers
      const combinedAnswers = allResponses
        .filter(Boolean)
        .flatMap(response => response.answers || []);
      setCombinedAnswers({ answers: combinedAnswers });
    } catch (error) {
      console.error('Error fetching form responses:', error);
    }
  };

  // Fetch responses when forms are fetched
  useEffect(() => {
    if (forms.length > 0) {
      const formIds = forms.map((form) => form.id);
      fetchFormResponses(formIds);
    }
  }, [forms]);

  return (
    <div className="tableContainer">
      {loading ? (
        <div className="loadingMessage">Loading data, please wait...</div>
      ) : (
        <table className="responseTable">
          <thead>
            <tr>
              <th>Question</th>
              <th>Sub-Question</th>
              <th>Answer</th>
              <th>Choice</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {combinedAnswers.answers.length > 0 ? (
              combinedAnswers.answers.map((answer, index) => (
                <tr key={index}>
                  <td>{answer?.question_text || 'N/A'}</td>
                  <td>{answer?.parent_id ? 'Yes' : 'N/A'}</td>
                  <td>{answer?.answer_text || 'N/A'}</td>
                  <td>{answer?.choice_text || 'N/A'}</td>
                  <td>{answer?.marks !== undefined ? answer.marks : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableView;
