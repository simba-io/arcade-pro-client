import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./main";

export const DASHBOARD_VIEW_ID = "dashboard-view-container";

type DashboardStats = {
  userName: string;
  wins: number;
  level: number;
};

function DashboardPanel() {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fundsBalance, setFundsBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("No authenticated user found.");
        setLoading(false);
        return;
      }

      setUid(user.id);
      setEmail(user.email ?? "");
      const metadataName =
        typeof user.user_metadata?.username === "string"
          ? user.user_metadata.username
          : "";
      setUserName(metadataName);

      const { data, error } = await supabase
        .from("UserData")
        .select("userName,wins,level,funds")
        .eq("uid", user.id)
        .maybeSingle();

      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        const resolvedName = data.userName || metadataName || "Player";
        setUserName(resolvedName);
        setStats({
          userName: resolvedName,
          wins: Number(data.wins ?? 0),
          level: Number(data.level ?? 1),
        });
        setFundsBalance(Number(data.funds ?? 0));
      } else {
        setStats({
          userName: metadataName || "Player",
          wins: 0,
          level: 1,
        });
        setFundsBalance(0);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "820px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "16px",
    border: "1px solid rgba(0, 0, 0, 0.07)",
    boxShadow: "0 24px 50px rgba(0, 0, 0, 0.14)",
    padding: "28px",
    boxSizing: "border-box",
  };

  const statGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  };

  const statCardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #d8e4ea",
    borderRadius: "12px",
    padding: "14px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "18px",
        boxSizing: "border-box",
        background:
          "linear-gradient(145deg, #e8f8ee 0%, #8ad4a7 45%, #43a047 100%)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={cardStyle}>
        <h1 style={{ margin: 0, color: "#0f3d1f", fontSize: "30px" }}>
          Dashboard
        </h1>
        <p style={{ margin: "8px 0 0", color: "#1f2933" }}>
          {userName ? `Welcome, ${userName}` : "Welcome"}
        </p>
        {email && (
          <p style={{ margin: "4px 0 0", color: "#475467", fontSize: "14px" }}>
            Signed in as {email}
          </p>
        )}

        {loading && (
          <p style={{ marginTop: "18px", color: "#334155" }}>Loading profile...</p>
        )}

        {!loading && errorMessage && (
          <p style={{ marginTop: "18px", color: "#b42318" }}>{errorMessage}</p>
        )}

        {!loading && !errorMessage && stats && (
          <>
            <div style={statGridStyle}>
            <div style={statCardStyle}>
              <p style={{ margin: "0 0 8px", color: "#475467", fontSize: "13px" }}>
                Username
              </p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
                {stats.userName}
              </p>
            </div>

            <div style={statCardStyle}>
              <p style={{ margin: "0 0 8px", color: "#475467", fontSize: "13px" }}>
                Wins
              </p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
                {stats.wins}
              </p>
            </div>

            <div style={statCardStyle}>
              <p style={{ margin: "0 0 8px", color: "#475467", fontSize: "13px" }}>
                Level
              </p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
                {stats.level}
              </p>
            </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                background: "#ffffff",
                border: "1px solid #d8e4ea",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  color: "#475467",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Funds Management
              </p>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Balance: ${fundsBalance.toFixed(2)}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    console.log("Deposit clicked - implement callback");
                    // TODO: add deposit callback
                  }}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "#2e7d32",
                    cursor: "pointer",
                  }}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Withdraw clicked - implement callback");
                    // TODO: add withdraw callback
                  }}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "#c62828",
                    cursor: "pointer",
                  }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export async function createDashboardView(container: HTMLElement) {
  container.innerHTML = "";
  const root = createRoot(container);
  root.render(<DashboardPanel />);
  return root;
}
