// import React from "react";
// import "./TableView.css";

// const TableView = ({ answers }) => {
//   // Map all questions by their `question_id` for quick lookups
//   const answerMap = (answers?.answers || []).reduce((acc, answer) => {
//     acc[answer.question_id] = { ...answer, subQuestions: [] };
//     return acc;
//   }, {});

//   // Link sub-questions to their parent questions
//   Object.values(answerMap).forEach((answer) => {
//     if (answer.parent_id) {
//       const parent = answerMap[answer.parent_id];
//       if (parent) {
//         parent.subQuestions.push(answer);
//       }
//     }
//   });

//   // Extract only parent questions (those with `parent_id: null`)
//   const parentQuestions = Object.values(answerMap).filter((answer) => !answer.parent_id);

//   return (
//     <div className="tableContainer">
//       {!answers ? (
//         <div className="loadingMessage">Loading data, please wait...</div>
//       ) : (
//         <table className="responseTable">
//           <thead>
//             <tr>
//               <th>Question</th>
//               <th>Sub-Question</th>
//               <th>Answer</th>
//               <th>Choice</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parentQuestions.length > 0 ? (
//               parentQuestions.map((parent, index) => (
//                 <React.Fragment key={index}>
//                   {/* Render the parent question */}
//                   <tr>
//                     <td>{parent.question_text || ""}</td>
//                     <td></td>
//                     <td>{parent.answer_text || ""}</td>
//                     <td>{parent.choice_text || ""}</td>
//                   </tr>
//                   {/* Render sub-questions (if any) */}
//                   {parent.subQuestions.length > 0
//                     ? parent.subQuestions.map((sub, subIndex) => (
//                         <tr key={`${index}-${subIndex}`} className="subQuestionRow">
//                           <td></td>
//                           <td>{sub.question_text || ""}</td>
//                           <td>{sub.answer_text || ""}</td>
//                           <td>{sub.choice_text || ""}</td>
//                         </tr>
//                       ))
//                     : null}
//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TableView;
import React from "react";
import "./TableView.css";

const TableView = ({ answers }) => {
  // Step 1: Create a map of all answers by `question_id`
  const answerMap = (answers?.answers || []).reduce((acc, answer) => {
    acc[answer.question_id] = { ...answer, subQuestions: [] };
    return acc;
  }, {});

  // Step 2: Link sub-questions to their parent questions
  Object.values(answerMap).forEach((answer) => {
    if (answer.parent_id) {
      const parent = answerMap[answer.parent_id];
      if (parent) {
        parent.subQuestions.push(answer);
      }
    }
  });

  // Step 3: Extract parent questions (where `parent_id` is null)
  const parentQuestions = Object.values(answerMap).filter((answer) => !answer.parent_id);

  // Step 4: Render the table
  return (
    <div className="tableContainer">
      {!answers ? (
        <div className="loadingMessage">Loading data, please wait...</div>
      ) : (
        <table className="responseTable">
          <thead>
            <tr>
              <th>Question</th>
              <th></th>
              <th>Answer</th>
              <th>Choice</th>
            </tr>
          </thead>
          <tbody>
            {parentQuestions.length > 0 ? (
              parentQuestions.map((parent, index) => (
                <React.Fragment key={index}>
                  {/* Render the parent question */}
                  <tr>
                    <td>{parent.question_text || ""}</td>
                    <td></td>
                    <td>{parent.answer_text || ""}</td>
                    <td>{parent.choice_text || ""}</td>
                  </tr>
                  {/* Render the sub-questions for this parent */}
                  {parent.subQuestions.map((sub, subIndex) => (
                    <React.Fragment key={`${index}-${subIndex}`}>
                      <tr className="subQuestionRow">
                        <td></td>
                        <td>{sub.question_text || ""}</td>
                        <td>{sub.answer_text || ""}</td>
                        <td>{sub.choice_text || ""}</td>
                      </tr>
                      {/* Render choices if the sub-question is a "Choice" type */}
                      {sub.question_type === "Choice" && sub.choices?.length > 0
                        ? sub.choices.map((choice, choiceIndex) => (
                            <tr key={`${index}-${subIndex}-${choiceIndex}`} className="choiceRow">
                              <td colSpan="2">Choice:</td>
                              <td colSpan="2">{choice.text || ""}</td>
                            </tr>
                          ))
                        : null}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableView;

