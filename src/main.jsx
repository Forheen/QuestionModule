import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import store, { persistor } from "../src/redux/store"; // Ensure correct path to store
import { AlertProvider } from "./components/Alert/AlertContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <App />
        </AlertProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
