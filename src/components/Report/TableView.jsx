import React, { useState, useEffect } from "react";
import "./TableView.css";

const TableView = ({ answers }) => {
  // const [combinedAnswers, setCombinedAnswers] = useState({ answers: [] });
  // const [loading, setLoading] = useState(true);
  // const [forms, setForms] = useState([]);

  // Step 1: Fetch all forms
  // useEffect(() => {
  //   const fetchForms = async () => {
  //     try {
  //       const formsResponse = await fetch('http://testinterns.drishtee.in/forms/allforms');
  //       const formsData = await formsResponse.json();
  //       console.log('All forms fetched successfully');
  //       setForms(formsData);
  //     } catch (error) {
  //       console.error('Error fetching forms:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchForms();
  // }, []);

  // Step 2: Fetch responses for each form

  // useEffect(() => {
  //   console.log("Initial loading:", loading); // Check loading state
  //   const formResponse = async () => {
  //     try {
  //       console.log("Fetching data...");
  //       const response = await fetch('http://testinterns.drishtee.in/forms/cspreport', {
  //         method: 'POST',
  //         body: JSON.stringify({ cspCode: csp_code }),
  //       });
  //       const json = await response.json();
  //       if (response.ok) {
  //         const combinedAnswers = json
  //           .filter(Boolean)
  //           .flatMap(response => response.answers || []);
  //         setCombinedAnswers({ answers: combinedAnswers });
  //       } else {
  //         console.error(`Form response error:`, json.message || response.statusText);
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching responses`, error);
  //     } finally {
  //       console.log("Setting loading to false");
  //       setLoading(false);
  //     }
  //   };
  
  //   formResponse();
  // }, [csp_code]);
  
  // const fetchFormResponses = async (formIds) => {
  
  //         try {
  //           const response = await fetch('http://testinterns.drishtee.in/forms/getreport', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ form_id: formId, csp_code }),
  //           });
  //           const json = await response.json();
  //           if (response.ok) return json;
  //           console.error(`Form response error:`, json.message || response.statusText);
  //           return null; // Skip or handle failed requests
  //         } catch (error) {
  //           console.error(`Error fetching responses`, error);
  //           return null; // Return null for failed requests
  //         }
  // };
  console.log(answers);

  return (
    <div className="tableContainer">
      { !answers ? (
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
            {answers.answers.length > 0 ? (
              answers.answers.map((answer, index) => (
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
