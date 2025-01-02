import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import {
  fetchProduct,
  fetchFormByUUID,
  getForm
} from "../../services/Api";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./form.css";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const token = useSelector((state) => state.auth.token);
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [state, setState] = useState(null);
  const [forms, setForms] = useState([]);
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve selected product and form data from localStorage
    const savedProduct = localStorage.getItem("selectedProduct");
    const savedForms = localStorage.getItem("fetchedForms");
  
    if (savedProduct) {
      setSelectedProduct(savedProduct);
    }
    if (savedForms) {
      // Check if the data is already an object or needs parsing
      try {
        const parsedForms = typeof savedForms === 'string' ? JSON.parse(savedForms) : savedForms;
        setForms(parsedForms);
      } catch (error) {
        console.error("Error parsing forms from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    let timeout;

    if (token) {
      timeout = setTimeout(async () => {
        try {
          const response = await fetchProduct(token);
          setProductData(response.products);
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      }, 300);
    }

    return () => clearTimeout(timeout); // Cleanup
  }, [token]);
  console.log(productData);

  const handleProductChange = (event) => {
    const productId = event.target.value;  // Get the selected product UUID
    setSelectedProduct(productId);         // Update the state with the selected product UUID
    localStorage.setItem("selectedProduct", productId);  // Save the product UUID to localStorage
    console.log("Selected Product UUID:", productId);  // Log the selected product UUID
  };

  // fetch forms by UUID
  const fetchForms = async () => {
    console.log(selectedProduct);
    try {
      const response = await fetchFormByUUID(selectedProduct);
      console.log("All forms fetched successfully");
      console.log(response);
      setForms(response);
      localStorage.setItem("fetchedForms", response); // Store in localStorage
    } catch (err) {
      console.error("Error fetching form:", err);
    }
  };

  const handleFormClick = async (form) => {
    console.log("Form clicked:", form);
    console.log("Form ID:", form.id);
    try {
      const response = await getForm(form.id);
      if (!response.ok) {
        throw new Error("Failed to fetch form data");
      }
      const data = await response.json();
      const sortedQuestions = data.questions.sort(
        (a, b) => a.main_order - b.main_order
      );
      setFormData({ ...data, questions: sortedQuestions }); // Set the form data
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };
  
  useEffect(() => {
    if (formData && formData.questions) {
      console.log(formData);
      navigateTo(); // Only navigate when formData is updated
    }
  }, [formData]); // This will trigger when formData changes
  
  const navigateTo = () => {
    console.log("Navigating with formData:", formData);
    navigate("/formpreview", { state: { formData: formData } });
  };

  // Truncate description
  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 6) {
      return words.slice(0, 6).join(" ") + " ...";
    }
    return description;
  };

  // const constructFormPayload = (formResponse) => {
  //   let mainOrderCounter = 0;

  //   const processSubQuestions = (subQuestions) => {
  //     if (!subQuestions) return [];

  //     return subQuestions.map((subQ) => {
  //       const isYesNo = subQ.type === "Yes/No";
  //       const isOptions = subQ.type === "options";
  //       const isImage = subQ.type === "Image";
  //       const isDate = subQ.type === "Date";

  //       const choices = isYesNo
  //         ? ["Yes", "No"].map((option, oIndex) => ({
  //             choice_text: option,
  //             score: oIndex === 0 ? 5 : 2,
  //             subquestions: processSubQuestions(subQ.Subquestions[oIndex]),
  //           }))
  //         : isOptions
  //         ? subQ.Choices.map((opt, oIndex) => ({
  //             choice_text: opt.choice_text,
  //             score: oIndex === 0 ? 5 : 2,
  //             subquestions: processSubQuestions(subQ.Subquestions[oIndex]),
  //           }))
  //         : undefined;

  //       return {
  //         question_text: subQ.question_text,
  //         type:
  //           isOptions || isYesNo
  //             ? "Choice"
  //             : isImage
  //             ? "Image"
  //             : isDate
  //             ? "Date"
  //             : "Text",
  //         is_choice: isOptions || isYesNo,
  //         score: null,
  //         main_order: ++mainOrderCounter,
  //         parent_id: subQ.parent_id,
  //         choice_id: subQ.choice_id,
  //         choices,
  //       };
  //     });
  //   };

  //   const formPayload = {
  //     name: formResponse.name,
  //     description: formResponse.description,
  //     product_uuid: formResponse.product_uuid,
  //     version: formResponse.version,
  //     status: formResponse.status,
  //     questions: formResponse.questions.map((q) => {
  //       const isYesNo = q.type === "Yes/No";
  //       const isOptions = q.type === "options";
  //       const isImage = q.type === "Image";
  //       const isDate = q.type === "Date";

  //       const choices = isYesNo
  //         ? ["Yes", "No"].map((option, oIndex) => ({
  //             choice_text: option,
  //             score: oIndex === 0 ? 5 : 2,
  //             subquestions: processSubQuestions(q.Subquestions[oIndex]),
  //           }))
  //         : isOptions
  //         ? q.Choices.map((opt, oIndex) => ({
  //             choice_text: opt.choice_text,
  //             score: oIndex === 0 ? 5 : 2,
  //             subquestions: processSubQuestions(q.Subquestions[oIndex]),
  //           }))
  //         : undefined;

  //       return {
  //         question_text: q.question_text,
  //         type:
  //           isOptions || isYesNo
  //             ? "Choice"
  //             : isImage
  //             ? "Image"
  //             : isDate
  //             ? "Date"
  //             : "Text",
  //         is_choice: isOptions || isYesNo,
  //         score: null,
  //         main_order: ++mainOrderCounter,
  //         parent_id: null,
  //         choice_id: null,
  //         choices,
  //       };
  //     }),
  //   };

  //   return formPayload;
  // };

  return (
    <div className={`mainContainer ${state ? "drawerOpen" : "drawerClosed"}`}>
      <AppDrawer onChange={setState} />

      <div className="contentContainer">
        <div className="upperDiv">
          <div className="detailsContainer">
            <div className="uuidSelect">
              <select
                className="uuidSelectBox"
                value={selectedProduct}
                onChange={handleProductChange}
              >
                <option value="" disabled>
                  Select a Product
                </option>
                {productData.map((product) => (
                  <option
                    key={product.product_uuid}
                    value={product.product_uuid}
                  >
                    {product.product_name}
                  </option>
                ))}
              </select>
              <Button variant="contained" onClick={fetchForms}>
                Fetch forms
              </Button>
            </div>
          </div>
        </div>

        <div className="formsList">
          {forms.length > 0 && (
            <div>
              {forms.map((form, index) => (
                <div key={index} className="formItem">
                  <div>
                    {index + 1}. {form.name}
                  </div>
                  <div>{truncateDescription(form.description)}</div>
                  <IconButton onClick={() => handleFormClick(form)}>
                    <VisibilityIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}