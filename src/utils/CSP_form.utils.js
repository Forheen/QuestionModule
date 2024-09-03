export const handleAddQuestion = (questions, setQuestions) => {
    setQuestions([
        ...questions,
        { question: "", type: "text", options: [], subQuestions: [] },
    ]);
};

export const handleDeleteQuestion = (index, questions, setQuestions) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
};

export const handleAddSubQuestion = (index, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[index].subQuestions.push({
        subQuestion: "",
        type: "text",
        options: [],
    });
    setQuestions(newQuestions);
};

export const handleDeleteSubQuestion = (questionIndex, subQuestionIndex, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions = newQuestions[
        questionIndex
    ].subQuestions.filter((_, i) => i !== subQuestionIndex);
    setQuestions(newQuestions);
};

export const handleQuestionChange = (index, event, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
};

export const handleSubQuestionChange = (questionIndex, subQuestionIndex, event, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].subQuestion =
        event.target.value;
    setQuestions(newQuestions);
};

export const handleQuestionTypeChange = (index, event, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[index].type = event.target.value;
    setQuestions(newQuestions);
};

export const handleSubQuestionTypeChange = (
    questionIndex,
    subQuestionIndex,
    event,
    questions,
    setQuestions
) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].type =
        event.target.value;
    setQuestions(newQuestions);
};

export const handleAddOption = (questionIndex, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
};

export const handleAddSubOption = (questionIndex, subQuestionIndex, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options.push("");
    setQuestions(newQuestions);
};

export const handleOptionChange = (questionIndex, optionIndex, event, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
};

export const handleSubOptionChange = (
    questionIndex,
    subQuestionIndex,
    optionIndex,
    event, questions,
    setQuestions
) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options[
        optionIndex
    ] = event.target.value;
    setQuestions(newQuestions);
};

export const handleDeleteOption = (questionIndex, optionIndex, questions, setQuestions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
        questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
};

export const handleDeleteSubOption = (
    questionIndex,
    subQuestionIndex,
    optionIndex, questions,
    setQuestions
) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subQuestions[subQuestionIndex].options =
        newQuestions[questionIndex].subQuestions[subQuestionIndex].options.filter(
            (_, i) => i !== optionIndex
        );
    setQuestions(newQuestions);
};

export const handleFormCreate = () => {
    alert("Created");
};