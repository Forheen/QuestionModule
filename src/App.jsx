import { BrowserRouter, Routes, Route } from "react-router-dom";
import CSP_form from "./Pages/CSP_form_creation/CSP_form";
import Report_Page from "./Pages/Report/Report_Page";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Pages/Forms_and_preview/form";
import LoginPage from "./Authstack/LoginPage";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../src/redux/store";
import AdminRoute from "./AdminStack/adminRoute";
import GlobalAlert from "./components/Alert/GlobalAlert";
import { useAlert } from "./components/Alert/AlertContext";
import Preview from "./components/PreviewOverlay/Preview"; // Assuming this is the location of the Preview component
import { useLocation } from "react-router-dom";
import RenderForm from "./Pages/Form_render/Render";
import FormPreview from "./components/Forms_and_preview/FormPreview";
import FormResponses from "./Pages/Report/Report_url";
import Revew_and_update from "./Pages/Update_form/Review_and_update";
import FormPreviewUpdate from "./Pages/Update_form/Form_preview_update";

function App() {
  const { alert, clearAlert } = useAlert();

  return (
    <BrowserRouter>
      <GlobalAlert alert={alert} clearAlert={clearAlert} />
      <Routes>
        <Route path="/" Component={LoginPage} />
        <Route
          path="/csp"
          element={
            <AdminRoute allowedRoles={["superadmin", "admin"]}>
              <CSP_form />
            </AdminRoute>
          }
        />
        <Route
          path="/report"
          element={
            <AdminRoute allowedRoles={["superadmin", "admin"]}>
              <Report_Page />
            </AdminRoute>
          }
        />
        <Route
          path="/product2form"
          element={
            <AdminRoute allowedRoles={["superadmin", "admin"]}>
              <Form />
            </AdminRoute>
          }
        />
        {/* Route for the Preview component */}
        <Route
          path="/preview"
          element={
            <AdminRoute allowedRoles={["superadmin", "admin"]}>
              <PreviewWithState />
            </AdminRoute>
          }
        />
        {/* Route for form render */}
        <Route path="/render" element={<RenderForm />} />
        <Route path="/formpreview" element={<FormPreview />} />
        <Route path="/renderreport" element={<FormResponses />} />
        <Route path="/update" element={<Revew_and_update />} />
        <Route path="/formpreviewupdate" element={<FormPreviewUpdate />} />
      </Routes>
    </BrowserRouter>
  );
}

function PreviewWithState() {
  const location = useLocation();
  const { formQuestions } = location.state || {}; // Extract formQuestions from state

  return <Preview formQuestions={formQuestions} />;
}

export default App;
