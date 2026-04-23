import type { CSSProperties } from "react";

type AuthenticationStyleMap = {
  pageContainer: CSSProperties;
  card: CSSProperties;
  title: CSSProperties;
  modeToggleContainer: CSSProperties;
  modeButton: CSSProperties;
  modeButtonActive: CSSProperties;
  modeButtonInactive: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  errorMessage: CSSProperties;
  submitButton: CSSProperties;
};

export const authenticationStyles: AuthenticationStyleMap = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    background:
      "radial-gradient(circle at 20% 10%, #c2f0ff 0%, #70bdd7 35%, #1099bb 100%)",
    boxSizing: "border-box",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
    padding: "24px",
    boxSizing: "border-box",
  },
  title: {
    margin: "0 0 14px",
    color: "#10313b",
  },
  modeToggleContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "18px",
  },
  modeButton: {
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  modeButtonActive: {
    background: "#1099bb",
    color: "#ffffff",
  },
  modeButtonInactive: {
    background: "#f4f7f9",
    color: "#1f2933",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2933",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #c8d2dc",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "14px",
    fontSize: "14px",
    outlineColor: "#1099bb",
  },
  errorMessage: {
    margin: "0 0 12px",
    color: "#b42318",
    fontSize: "13px",
  },
  submitButton: {
    width: "100%",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 700,
    background: "#1099bb",
    color: "#ffffff",
  },
};
