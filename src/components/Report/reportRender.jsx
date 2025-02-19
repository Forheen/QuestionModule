import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const FormResponses = ({ submissions, formId, cspCode }) => {
  const flattenedSubmissions = submissions.flat();
  const selectedSubmission = flattenedSubmissions.find(
    (sub) => sub.form_id === formId
  );

  console.log("Flattened Submissions:", flattenedSubmissions);
  console.log("Selected Submission:", selectedSubmission);

  if (!selectedSubmission) {
    return (
      <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2>📄 Form Responses</h2>
        <p style={{ color: "red" }}>⚠️ No responses found for the given Form ID.</p>
      </div>
    );
  }

  const { answers, form_name, submitted_at } = selectedSubmission;

  const questionMap = {};
  answers.forEach((answer) => {
    questionMap[answer.question_id] = { ...answer, children: [] };
  });

  const parentQuestions = [];
  answers.forEach((answer) => {
    if (answer.parent_id) {
      if (questionMap[answer.parent_id]) {
        questionMap[answer.parent_id].children.push(questionMap[answer.question_id]);
      }
    } else {
      parentQuestions.push(questionMap[answer.question_id]);
    }
  });

  const renderQuestions = (questions, indent = 0) => {
    return questions.map((question, index) => (
      <div key={question.question_id} style={{ marginLeft: `${indent * 20}px`, marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <p><b>📌 Question {index + 1}:</b> {question.question_text}</p>
        {question.answer_text ? (
          <p><b>✅ Answer:</b> {question.answer_text}</p>
        ) : question.choice_text ? (
          <p><b>🔘 Selected Choice:</b> {question.choice_text}</p>
        ) : (
          <p><b>⚠️ No Answer Provided</b></p>
        )}
        {question.children.length > 0 && renderQuestions(question.children, indent + 1)}
      </div>
    ));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Form Submission Report", 15, 15);
    doc.setFontSize(12);
    doc.text(`Form Name: ${form_name}`, 15, 25);
    doc.text(`Submission Date: ${new Date(submitted_at).toLocaleDateString()}`, 15, 35);
    doc.text("Responses:", 15, 45);

    let y = 55;

    const renderAnswers = (questions, indent = 0) => {
      questions.forEach((question, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${" ".repeat(indent * 2)}${index + 1}. ${question.question_text}`, 15, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.text(`${" ".repeat(indent * 2)}Answer: ${question.answer_text || question.choice_text || "N/A"}`, 15, y);
        y += 8;

        if (question.children.length > 0) {
          renderAnswers(question.children, indent + 1);
        }
      });
    };

    renderAnswers(parentQuestions);

    doc.save(`Form_Submission_Report_${cspCode}.pdf`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>📄 Form Responses</h2>
      <h3>{form_name}</h3>
      <p><b>Submission Date:</b> {new Date(submitted_at).toLocaleDateString()}</p>
      <hr />
      {renderQuestions(parentQuestions)}
      <button onClick={downloadPDF} style={{ marginTop: "20px", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Download as PDF
      </button>
    </div>
  );
};

export default FormResponses;
