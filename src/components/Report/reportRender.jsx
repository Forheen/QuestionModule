import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useState ,useEffect} from "react";

const FormResponses = ({ submissions }) => {
  console.log("Received Submissions:", submissions);
  const [totalScores, setTotalScores] = useState({});

  // Calculate total scores
  useEffect(() => {
    const scores = {};
    flattenedSubmissions.forEach((submission) => {
      let totalScore = 0;
      const groupedQuestions = groupQuestions(submission.answers);

      groupedQuestions.forEach((question) => {
        totalScore += Number(question.marks) || 0;
        question.subquestions.forEach((subQ) => {
          totalScore += Number(subQ.marks) || 0;
        });
      });

      scores[submission.submission_id] = totalScore;
    });
    setTotalScores(scores);
  }, [submissions]);

  console.log("Total Scores:", totalScores);

  // Flatten the array to handle nested submissions
  const flattenedSubmissions = submissions.flat();

  if (!flattenedSubmissions || flattenedSubmissions.length === 0) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>📄 Form Responses</h2>
        <p style={{ color: "red" }}>⚠️ No responses found.</p>
      </div>
    );
  }

  // Function to group questions by parent_id
  const groupQuestions = (answers) => {
    const questionMap = {};
    const grouped = [];

    answers.forEach((answer) => {
      if (answer.parent_id) {
        // If it's a subquestion, add it under the parent
        if (!questionMap[answer.parent_id]) {
          questionMap[answer.parent_id] = { subquestions: [] };
        }
        questionMap[answer.parent_id].subquestions.push(answer);
      } else {
        // If it's a parent question, add it to the list
        questionMap[answer.question_id] = { ...answer, subquestions: [] };
        grouped.push(questionMap[answer.question_id]);
      }
    });

    return grouped;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Form Submission Report", 15, 15);

    flattenedSubmissions.forEach((submission, index) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${submission.form_name}`, 15, 25 + index * 10);

      const groupedQuestions = groupQuestions(submission.answers);

      const tableBody = [];

      groupedQuestions.forEach((question, qIndex) => {
        tableBody.push([
          qIndex + 1,
          question.question_text,
          question.answer_text || question.choice_text || "N/A",
          question.marks !== undefined ? question.marks : "N/A",
        ]);

        // Add subquestions with indentation
        question.subquestions.forEach((subQ, subIndex) => {
          tableBody.push([
            `${qIndex + 1}.${subIndex + 1}`, // Nested numbering
            "↳ " + subQ.question_text,
            subQ.answer_text || subQ.choice_text || "N/A",
            subQ.marks !== undefined ? subQ.marks : "N/A",
          ]);
        });
      });

      doc.autoTable({
        startY: 30 + index * 10,
        head: [["#", "Question", "Answer", "Marks"]],
        body: tableBody,
        theme: "striped",
      });
    });

    doc.save(`Form_Submissions.pdf`);
  };

  return (
    <div
      style={{
        maxWidth: "90%",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>📄 Form Responses</h2>
      <h2>{totalScores}</h2>
      {flattenedSubmissions.map((submission, index) => {
        const groupedQuestions = groupQuestions(submission.answers);
        let totalScore = 0;
        return (
          <div key={submission.submission_id} style={{ marginBottom: "30px" }}>
            <h3>
              {index + 1}. {submission.form_name}
            </h3>
            <p>
              <b>CSP Code:</b> {submission.csp_code}
            </p>
            <p>
              <b>Submitted At:</b>{" "}
              {new Date(submission.submitted_at).toLocaleString()}
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Question</th>
                  <th style={styles.th}>Response from the visiting official</th>
                  <th style={styles.th}>Marks</th>
                </tr>
              </thead>
              <tbody>
                {groupedQuestions.map((question, qIndex) => (
                  <React.Fragment key={question.question_id}>
                    <tr
                      style={qIndex % 2 === 0 ? styles.evenRow : styles.oddRow}
                    >
                      <td style={styles.td}>{qIndex + 1}</td>
                      <td style={styles.td}>
                        <b>{question.question_text}</b>
                      </td>
                      <td style={styles.td}>
                        {question.answer_text || question.choice_text || "N/A"}
                      </td>
                      <td style={styles.td}>
                        {question.marks !== undefined ? question.marks : "N/A"}
                      </td>
                    </tr>

                    {question.subquestions.map((subQ, subIndex) => (
                      <tr
                        key={subQ.question_id}
                        style={
                          subIndex % 2 === 0 ? styles.evenRow : styles.oddRow
                        }
                      >
                        <td style={styles.td}>
                          {qIndex + 1}.{subIndex + 1}
                        </td>
                        <td style={styles.td}>
                          &nbsp;&nbsp;&nbsp;↳ {subQ.question_text}
                        </td>
                        <td style={styles.td}>
                          {subQ.answer_text || subQ.choice_text || "N/A"}
                        </td>
                        <td style={styles.td}>
                          {subQ.marks !== undefined ? subQ.marks : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr style={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }}>
                  <td colSpan="3" style={styles.td}>
                    Total Score
                  </td>
                  <td style={styles.td}>
                    {totalScores[submission.submission_id] || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      <button onClick={downloadPDF} style={styles.button}>
   
      </button>
    </div>
  );
};

// Styles for better table formatting
const styles = {
  th: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid white",
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    width: "200px",
    textAlign: "center",
  },
};

export default FormResponses;
