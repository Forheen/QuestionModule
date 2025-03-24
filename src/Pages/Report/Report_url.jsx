import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Lottie from "lottie-react";
import { fetchCSPReportByProductID } from "../../services/Api";
import animationData from "../../assets/Loading_updated.json";

const useQuery = () => new URLSearchParams(useLocation().search);

const FormResponses = () => {
  const query = useQuery();
  const product_id = query.get("product_id");
  const csp_code = query.get("csp_code");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalScores, setTotalScores] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const[totalVisited, setTotalVisited] = useState(0);

  // data for the sequestioal redering of the form

  const sequence = [
    "47371f8d-cb1a-465d-a5b4-b906d8f657e3",
    "6a893c36-a293-4cc4-88bd-8f88e99943bb",
    "8ee21e46-ddcb-4ac5-b280-c54f22636dca",
    "c5c3d43a-f2db-4d16-b923-40b66e872292",
    "9de431cb-4ef5-413a-9814-291c56210406",
    "3a38913a-0be5-4f01-b265-3a39a69e0473",
  ];

  // Calculate total scores
  useEffect(() => {
    const scores = {};

    submissions.forEach((submission) => {
      let totalScore = 0;
      const groupedQuestions = groupQuestions(submission.answers);

      groupedQuestions.forEach((question) => {
        totalScore += Number(question.choice_score) || 0;
        question.subquestions.forEach((subQ) => {
          totalScore += Number(subQ.choice_score) || 0;
        });
      });

      // Ensure score is set correctly for each submission
      scores[submission.submission_id] = totalScore;
    });

    console.log("Updated Scores:", scores); // Debugging line
    setGrandTotal(Object.values(scores).reduce((acc, score) => acc + score, 0));
    setTotalScores(scores);
  }, [submissions]);

  //fetch submission list by product id
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetchCSPReportByProductID(csp_code,product_id);

        // Reorder response based on `sequence`
        const sortedData = response.sort(
          (a, b) => sequence.indexOf(a.form_id) - sequence.indexOf(b.form_id)
        );

        setTotalVisited(sortedData.length);

        console.log("Sorted Data:", sortedData); 
        setSubmissions(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [product_id, csp_code]);

  //loading if data is not fetched

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100wh',height:'100vh',flex:1}}><Lottie animationData={animationData} loop={true} /></div>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!submissions || submissions.length === 0)
    return <p>No responses found.</p>;

  //group question accoring to parent id

  const groupQuestions = (answers) => {
    const questionMap = {};
    const grouped = [];

    // First, initialize all questions in the map
    answers.forEach((answer) => {
      questionMap[answer.question_id] = { ...answer, subquestions: [] };
    });

    // Now, assign children to parents
    answers.forEach((answer) => {
      if (answer.parent_id && questionMap[answer.parent_id]) {
        questionMap[answer.parent_id].subquestions.push(
          questionMap[answer.question_id]
        );
      } else if (!answer.parent_id) {
        grouped.push(questionMap[answer.question_id]);
      }
    });

    return grouped;
  };

  //download the response in pdf format

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

  const isImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null;
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
      <div style={{ display: "flex", flexDirection:'row',justifyContent: "space-between" }}>

      <p>
        <b>Grand total score:</b> {grandTotal}
      </p>
      <p>
        <b>Total visited form:</b> {totalVisited}
      </p>
      <p>
      <b>Total unvisited form:</b> {6-totalVisited}
      </p>
      </div>
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
                      <td style={{ paddingLeft: "10px" }}>{qIndex + 1}</td>
                      <td>{question.question_text}</td>
                      <td>
                        {question.answer_text || question.choice_text ? (
                          isImageUrl(
                            question.answer_text || question.choice_text
                          ) ? (
                            <img
                              src={question.answer_text || question.choice_text}
                              alt="response"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                              }}
                            />
                          ) : question.answer_text?.startsWith("http") ||
                            question.choice_text?.startsWith("http") ? (
                            <a
                              href={
                                question.answer_text || question.choice_text
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#007BFF",
                                textDecoration: "underline",
                              }}
                            >
                              {question.answer_text || question.choice_text}
                            </a>
                          ) : (
                            question.answer_text || question.choice_text
                          )
                        ) : (
                          "N/A"
                        )}
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
                        <td>
                          {subQ.answer_text || subQ.choice_text ? (
                            isImageUrl(subQ.answer_text || subQ.choice_text) ? (
                              <img
                                src={subQ.answer_text || subQ.choice_text}
                                alt="response"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                }}
                              />
                            ) : subQ.answer_text?.startsWith("http") ||
                              subQ.choice_text?.startsWith("http") ? (
                              <a
                                href={subQ.answer_text || subQ.choice_text}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#007BFF",
                                  textDecoration: "underline",
                                }}
                              >
                                {subQ.answer_text || subQ.choice_text}
                              </a>
                            ) : (
                              subQ.answer_text || subQ.choice_text
                            )
                          ) : (
                            "N/A"
                          )}
                        </td>
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
                <tr style={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }}>
                  <td colSpan="3">Total Score</td>
                  <td>{totalScores[submission.submission_id] || 0}</td>
                </tr>
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
