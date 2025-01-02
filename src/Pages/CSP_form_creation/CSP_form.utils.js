
export const handleOptionCountChange = (qIndex, e, setQuestions) => {
    const optionCount = parseInt(e.target.value, 10);
    if (isNaN(optionCount) || optionCount < 1) return;

    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentQuestion = { ...newQuestions[qIndex] };

        currentQuestion.options = Array(optionCount)
            .fill("")
            .map((opt, idx) => currentQuestion.options[idx] || "");

        currentQuestion.subQuestions = Array(optionCount)
            .fill()
            .map((_, idx) => currentQuestion.subQuestions[idx] || []);

        newQuestions[qIndex] = currentQuestion;
        return newQuestions;
    });
};


export const handleAddSubQuestion = (qIndex, oIndex, setQuestions) => {
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];

        if (!newQuestions[qIndex].subQuestions[oIndex]) {
            newQuestions[qIndex].subQuestions[oIndex] = [];
        }

        const subQuestionsArray = newQuestions[qIndex].subQuestions[oIndex];

        if (
            subQuestionsArray.length === 0 ||
            subQuestionsArray.every((sq) => sq.subQuestion.trim() !== "")
        ) {
            subQuestionsArray.push({
                subQuestion: "",
                type: "text",
                options: [],
            });
        }

        return newQuestions;
    });
};


export const handleDeleteSubQuestion = (qIndex, oIndex, sIndex, setQuestions) => {
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentSubQuestions = [
            ...newQuestions[qIndex].subQuestions[oIndex],
        ];

        const updatedSubQuestions = currentSubQuestions.filter(
            (_, index) => index !== sIndex
        );

        newQuestions[qIndex].subQuestions[oIndex] =
            updatedSubQuestions.length > 0 ? updatedSubQuestions : [];

        return newQuestions;
    });
};


export const handleSubQuestionOptionCountChange = (qIndex, oIndex, sIndex, e, setQuestions) => {
    const optionCount = parseInt(e.target.value, 10);
    if (isNaN(optionCount) || optionCount < 1) return;

    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentSubQuestions = [
            ...newQuestions[qIndex].subQuestions[oIndex],
        ];
        const currentSubQuestion = { ...currentSubQuestions[sIndex] };

        currentSubQuestion.options = Array(optionCount)
            .fill("")
            .map((opt, idx) => currentSubQuestion.options[idx] || "");

        currentSubQuestions[sIndex] = currentSubQuestion;
        newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
        return newQuestions;
    });
};


export const handleAddOptionToSubQuestion = (qIndex, oIndex, sIndex) => {
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentSubQuestions = [
            ...newQuestions[qIndex].subQuestions[oIndex],
        ];
        const currentSubQuestion = { ...currentSubQuestions[sIndex] };

        currentSubQuestion.options = [...currentSubQuestion.options, ""];

        currentSubQuestions[sIndex] = currentSubQuestion;
        newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
        return newQuestions;
    });
};


export const handleDeleteOptionFromSubQuestion = (
    qIndex,
    oIndex,
    sIndex,
    optIndex, setQuestions
) => {
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentSubQuestions = [
            ...newQuestions[qIndex].subQuestions[oIndex],
        ];
        const currentSubQuestion = { ...currentSubQuestions[sIndex] };

        const updatedOptions = currentSubQuestion.options.filter(
            (_, index) => index !== optIndex
        );

        currentSubQuestion.options = updatedOptions;

        currentSubQuestions[sIndex] = currentSubQuestion;
        newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
        return newQuestions;
    });
};


export const addQuestion = (setQuestions) => {
    setQuestions((prevQuestions) => [
        ...prevQuestions,
        { question: "", type: "text", options: [], subQuestions: [] },
    ]);
};


export const handleDeleteQuestion = (qIndex, setQuestions) => {
    setQuestions((prevQuestions) =>
        prevQuestions.filter((_, index) => index !== qIndex)
    );
};


export const handleQuestionChange = (qIndex, e, setQuestions) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[qIndex] = { ...newQuestions[qIndex], question: value };
        return newQuestions;
    });
};


// export const handleQuestionTypeChange = (qIndex, e, setQuestions) => {
//     const { value } = e.target;
//     setQuestions((prevQuestions) => {
//         const newQuestions = [...prevQuestions];
//         const currentQuestion = { ...newQuestions[qIndex], type: value };

//         if (value === "options") {
//             // Handle regular options type
//             currentQuestion.options = [""];
//             currentQuestion.subQuestions = [[]];
//         } else if (value === "Yes/No") {
//             // Set Yes/No options
//             currentQuestion.options = ["", ""];

//             // Create 1 subquestion for each option
//             currentQuestion.subQuestions = [[{}], [{}]];
//         } else {
//             currentQuestion.options = [];
//             currentQuestion.subQuestions = [];
//         }

//         newQuestions[qIndex] = currentQuestion;
//         return newQuestions;
//     });
// };

export const handleQuestionTypeChange = (qIndex, e, setQuestions) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentQuestion = { ...newQuestions[qIndex], type: value };

        if (value === "options") {
            // Handle regular options type
            currentQuestion.options = [""];
            currentQuestion.subQuestions = [[]];
        } else if (value === "Yes/No") {
            // Set Yes/No options
            currentQuestion.options = ["", ""];
            currentQuestion.subQuestions = [[], []]; // Allow multiple subquestions for Yes/No
        } else if(value=== "Image"){
            currentQuestion.options = [];
            currentQuestion.subQuestions = [];
        }
        else if(value=="Date")
        {
            currentQuestion.options = [];
            currentQuestion.subQuestions = [];
        }
        else{
            currentQuestion.options = [];
            currentQuestion.subQuestions = [];
        }


        newQuestions[qIndex] = currentQuestion;
        return newQuestions;
    });
};






export const handleOptionChange = (qIndex, oIndex, e, setQuestions) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentOptions = [...newQuestions[qIndex].options];
        currentOptions[oIndex] = value;
        newQuestions[qIndex] = {
            ...newQuestions[qIndex],
            options: currentOptions,
        };
        return newQuestions;
    });
};


export const handleSubQuestionChange = (qIndex, oIndex, sIndex, e, setQuestions) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const currentSubQuestions = [
            ...newQuestions[qIndex].subQuestions[oIndex],
        ];
        currentSubQuestions[sIndex] = {
            ...currentSubQuestions[sIndex],
            subQuestion: value,
        };
        newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
        return newQuestions;
    });
};


// export const handleSubQuestionTypeChange = (qIndex, oIndex, sIndex, e, setQuestions) => {
//     const { value } = e.target;
//     setQuestions((prevQuestions) => {
//         const newQuestions = [...prevQuestions];
//         const currentSubQuestions = [
//             ...newQuestions[qIndex].subQuestions[oIndex],
//         ];
//         currentSubQuestions[sIndex] = {
//             ...currentSubQuestions[sIndex],
//             type: value,
//         };
//         newQuestions[qIndex].subQuestions[oIndex] = currentSubQuestions;
//         return newQuestions;
//     });
// };

export const handleSubQuestionTypeChange = (qIndex, oIndex, sIndex, e, setQuestions) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
  
      // Update the subquestion type directly
      newQuestions[qIndex].subQuestions[oIndex][sIndex] = {
        ...newQuestions[qIndex].subQuestions[oIndex][sIndex],
        type: value,
      };
  
      // Clear options if the new type is not "options"
      if (value !== "options") {
        newQuestions[qIndex].subQuestions[oIndex][sIndex].options = [];
      }
  
      return newQuestions;
    });
  };
  



// export default {
//     handleOptionCountChange,
//     handleAddSubQuestion,
//     handleDeleteSubQuestion,
//     handleSubQuestionOptionCountChange,
//     handleAddOptionToSubQuestion,
//     handleDeleteOptionFromSubQuestion,
//     addQuestion,
//     handleDeleteQuestion,
//     handleQuestionChange,
//     handleQuestionTypeChange,
//     handleOptionChange,
//     handleSubQuestionChange,
//     handleSubQuestionTypeChange
// }