import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import "./Report_Page.css";
import { Button, IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from "react-redux";
import { fetchProduct, fetchFormByProduct, fetchSubmissionListById } from "../../services/Api";
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import FormResponses from "../../components/Report/reportRender";  
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import "jspdf-autotable";      // For table formatting

export default function Report_Page() {
  const token = useSelector((state) => state.auth.token);
  const [State, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [cspData, setCspData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null); 
  const [cspcode, setCspCode] = useState("");

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const response = await fetchProduct(token);
          setProductData(response.products || []);
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [token]);

  const handleProductChange = async (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
    localStorage.setItem("selectedProduct", productId);

    try {
      const response = await fetchFormByProduct(productId);
      setFormData(response || []);
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  const handleFormChange = (event) => {
    const formId = event.target.value;
    setSelectedForm(formId);
    localStorage.setItem("selectedForm", formId);
  };

  const fetchList = async () => {
    try {
      const response = await fetchSubmissionListById(selectedForm);
      setCspData(response.csp_codes || []);
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  const handleCSPClick = async (code) => {
    try {
      const response = await axios.post("http://testinterns-api.drishtee.in/api/forms/cspreport", {
        cspCode: code
      });

      console.log("Selected Submission Data:", response.data);
      setSelectedSubmission(response.data);
      setOpenPopup(true);
      setCspCode(code);
    } catch (err) {
      console.error("Error fetching form data:", err);
    }
  };



  return (
    <div className="mainContainerDiv" style={{ marginLeft: State ? "20%" : 0 }}>
      <AppDrawer onChange={setState} />
      <div className="contentContainerDiv">
        <div className="upperContainer">
          <div className="detailsContainerDiv">
            <div className="uuidSelectDiv">
              <select className="uuidSelectBox" value={selectedProduct} onChange={handleProductChange}>
                <option value="" disabled>Select a Product</option>
                {productData.map((product) => (
                  <option key={product.product_uuid} value={product.product_uuid}>
                    {product.product_name}
                  </option>
                ))}
              </select>
              <select className="uuidSelectBox" value={selectedForm} onChange={handleFormChange}>
                <option value="" disabled>Select a Form</option>
                {formData.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
              <Button variant="contained" onClick={fetchList}>CSP list</Button>
            </div>
          </div>
        </div>

        <div className="formsList">
          {loading ? (
            <div>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={40} className="skeletonItem" />
              ))}
            </div>
          ) : (
            cspData.length > 0 && (
              <div>
                {cspData.map((code, index) => (
                  <div key={index} className="formItem">
                    <div>
                      <ArticleIcon style={{ marginRight: '10px' }} />
                      {code}
                    </div>
                    <IconButton onClick={() => handleCSPClick(code)}>
                      <VisibilityIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Popup for Form Responses */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="md" fullWidth>
        <DialogTitle>Form Submission Details</DialogTitle>
        <DialogContent>
          {selectedSubmission ? (
            <>
              <FormResponses submissions={[selectedSubmission]} formId={selectedForm} cspCode={cspcode} />
            </>
          ) : (
            <p>Loading response...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
