import type { CSSProperties } from "react";

type DashboardStyleMap = {
  pageContainer: CSSProperties;
  card: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  emailText: CSSProperties;
  loadingText: CSSProperties;
  errorText: CSSProperties;
  statGrid: CSSProperties;
  statCard: CSSProperties;
  statLabel: CSSProperties;
  statValue: CSSProperties;
  fundsCard: CSSProperties;
  fundsLabel: CSSProperties;
  fundsBalance: CSSProperties;
  actionRow: CSSProperties;
  actionButton: CSSProperties;
  depositButton: CSSProperties;
  withdrawButton: CSSProperties;
  managePaymentButton: CSSProperties;
  paymentForm: CSSProperties;
  paymentGrid: CSSProperties;
  paymentInput: CSSProperties;
  savePaymentButton: CSSProperties;
  paymentMessage: CSSProperties;
};

export const dashboardStyles: DashboardStyleMap = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, #e8f8ee 0%, #8ad4a7 45%, #43a047 100%)",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "820px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "16px",
    border: "1px solid rgba(0, 0, 0, 0.07)",
    boxShadow: "0 24px 50px rgba(0, 0, 0, 0.14)",
    padding: "28px",
    boxSizing: "border-box",
  },
  title: {
    margin: 0,
    color: "#0f3d1f",
    fontSize: "30px",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#1f2933",
  },
  emailText: {
    margin: "4px 0 0",
    color: "#475467",
    fontSize: "14px",
  },
  loadingText: {
    marginTop: "18px",
    color: "#334155",
  },
  errorText: {
    marginTop: "18px",
    color: "#b42318",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #d8e4ea",
    borderRadius: "12px",
    padding: "14px",
  },
  statLabel: {
    margin: "0 0 8px",
    color: "#475467",
    fontSize: "13px",
  },
  statValue: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
  },
  fundsCard: {
    marginTop: "16px",
    background: "#ffffff",
    border: "1px solid #d8e4ea",
    borderRadius: "12px",
    padding: "16px",
  },
  fundsLabel: {
    margin: "0 0 6px",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 600,
  },
  fundsBalance: {
    margin: "0 0 12px",
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
  },
  actionRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  actionButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    cursor: "pointer",
  },
  depositButton: {
    background: "#2e7d32",
  },
  withdrawButton: {
    background: "#c62828",
  },
  managePaymentButton: {
    background: "#1565c0",
  },
  paymentForm: {
    marginTop: "14px",
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  paymentInput: {
    border: "1px solid #c8d2dc",
    borderRadius: "8px",
    padding: "9px 10px",
    fontSize: "14px",
  },
  savePaymentButton: {
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    background: "#1f2937",
  },
  paymentMessage: {
    margin: "8px 0 0",
    color: "#334155",
    fontSize: "13px",
  },
};
