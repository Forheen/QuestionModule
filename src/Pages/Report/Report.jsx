import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const useQuery = () => new URLSearchParams(useLocation().search);

const FormResponses = () => {
  const query = useQuery();
  const product_id = query.get("product_id");
  const csp_code = query.get("csp_code");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.post(
          "http://testinterns-api.drishtee.in/api/forms/get-csp-report-by-product-id",
          { csp_code, productID: product_id }
        );
        setSubmissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [product_id, csp_code]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!submissions || submissions.length === 0)
    return <p>No responses found.</p>;

  const groupQuestions = (answers) => {
    const questionMap = {};
    const grouped = [];

    answers.forEach((answer) => {
      if (answer.parent_id) {
        if (!questionMap[answer.parent_id]) {
          questionMap[answer.parent_id] = { subquestions: [] };
        }
        questionMap[answer.parent_id].subquestions.push(answer);
      } else {
        questionMap[answer.question_id] = { ...answer, subquestions: [] };
        grouped.push(questionMap[answer.question_id]);
      }
    });
    return grouped;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Form Submission Report", 15, 15);

    submissions.forEach((submission, index) => {
      if (index !== 0) doc.addPage(); // Start each submission on a new page

      doc.setFontSize(14);
      doc.text(`Form: ${submission.form_name}`, 15, 25);
      doc.setFontSize(12);
      doc.text(`CSP Code: ${submission.csp_code}`, 15, 35);
      doc.text(
        `Submitted At: ${new Date(submission.submitted_at).toLocaleString()}`,
        15,
        45
      );

      const groupedQuestions = groupQuestions(submission.answers);
      const tableBody = [];

      groupedQuestions.forEach((question, qIndex) => {
        tableBody.push([
          qIndex + 1,
          question.question_text,
          question.answer_text || question.choice_text || "N/A",
          question.marks !== undefined ? question.marks : "N/A",
        ]);

        question.subquestions.forEach((subQ, subIndex) => {
          tableBody.push([
            `${qIndex + 1}.${subIndex + 1}`,
            "↳ " + subQ.question_text,
            subQ.answer_text || subQ.choice_text || "N/A",
            subQ.marks !== undefined ? subQ.marks : "N/A",
          ]);
        });
      });

      doc.autoTable({
        startY: 55, // Ensures table doesn't overlap with headers
        head: [["#", "Question", "Response", "Marks"]],
        body: tableBody,
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 123, 255] }, // Blue header for clarity
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
      {submissions.map((submission, index) => {
        const groupedQuestions = groupQuestions(submission.answers);
        return (
          <div key={submission.submission_id} style={{ marginBottom: "30px" }}>
            <h3 style={{ fontWeight: "bold" }}>
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
                border: "1px solid #ccc",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    height: "60px",
                    width: "100%",
                  }}
                >
                  <th style={{ paddingLeft: "10px" }}>SL No. </th>{" "}
                  <th>Question</th>
                  <th style={{ paddingRight: "10px" }}>Response</th>
                  <th style={{ paddingRight: "10px" }}>Marks</th>
                </tr>
              </thead>
              <tbody>
                {groupedQuestions.map((question, qIndex) => (
                  <React.Fragment key={question.question_id}>
                    <tr>
                      <td style={{paddingLeft:'10px'}}>{qIndex + 1}</td>
                      <td>{question.question_text}</td>
                      <td>
                        {question.answer_text || question.choice_text || "N/A"}
                      </td>
                      <td>
                        {question.choice_score !== undefined
                          ? question.choice_score
                          : "N/A"}
                      </td>
                    </tr>
                    {question.subquestions.map((subQ, subIndex) => (
                      <tr key={subQ.question_id}>
                        <td>
                          {qIndex + 1}.{subIndex + 1}
                        </td>
                        <td>&nbsp;&nbsp;&nbsp;↳ {subQ.question_text}</td>
                        <td>{subQ.answer_text || subQ.choice_text || "N/A"}</td>
                        <td>{subQ.marks !== undefined ? subQ.marks : "N/A"}</td>
                      </tr>
                    ))}
                    {/* Horizontal line after each question */}
                    <tr>
                      <td colSpan="4">
                        <hr
                          style={{ border: "1px solid #ccc", margin: "5px 0" }}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download as PDF
      </button>
    </div>
  );
};

export default FormResponses;
