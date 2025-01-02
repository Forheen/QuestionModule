import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function GlobalAlert({ alert, clearAlert }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (alert) {
      setShow(true);

      // Automatically hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(clearAlert, 300); // Delay clearing to match the animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  if (!alert) return null;

  return (
    <div
      style={{
        position: "fixed", // Makes it float above other content
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999, // Ensures it’s on top of most elements
        display: "flex",
        justifyContent: "center", // Centers the alert horizontally
        pointerEvents: "none", // Prevents blocking clicks on other content
      }}
    >
      <div
        style={{
          width: "100%",
          opacity: show ? 1 : 0,
          transform: show ? "translateX(0)" : "translateX(100%)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: "auto",
          display: "flex", flexDirection: "column ",gap: "10px",height:'2.5rem' // Allow interactions with the alert
        }}
      >
        <Alert severity={alert.title} style={{ width: "100%"}}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      </div>
    </div>
  );
}
