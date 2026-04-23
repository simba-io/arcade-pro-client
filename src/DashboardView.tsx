import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./main";
import type { UserPaymentData } from "./UserData";

export const DASHBOARD_VIEW_ID = "dashboard-view-container";

type DashboardStats = {
  userName: string;
  wins: number;
  level: number;
};

function DashboardPanel() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fundsBalance, setFundsBalance] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentForm, setPaymentForm] = useState<UserPaymentData>({
    uid: "",
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });
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

      setPaymentForm((prev) => ({ ...prev, uid: user.id }));
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

      const { data: paymentData } = await supabase
        .from("UserPaymentData")
        .select("uid,name,cardNumber,expiryDate,cvv,billingAddress")
        .eq("uid", user.id)
        .maybeSingle();

      if (paymentData) {
        setPaymentForm({
          uid: paymentData.uid ?? user.id,
          name: paymentData.name ?? "",
          cardNumber: paymentData.cardNumber ?? "",
          expiryDate: paymentData.expiryDate ?? "",
          cvv: paymentData.cvv ?? "",
          billingAddress: paymentData.billingAddress ?? "",
        });
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  async function handlePaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPaymentMessage("No authenticated user found.");
      return;
    }

    const authenticatedUid = user.id;

    if (
      !paymentForm.name.trim() ||
      !paymentForm.cardNumber.trim() ||
      !paymentForm.expiryDate.trim() ||
      !paymentForm.cvv.trim() ||
      !paymentForm.billingAddress.trim()
    ) {
      setPaymentMessage("All payment fields are required.");
      return;
    }

    setPaymentSaving(true);
    const payload: UserPaymentData = {
      ...paymentForm,
      uid: authenticatedUid,
    };

    const { error } = await supabase
      .from("UserPaymentData")
      .upsert(payload, { onConflict: "uid" });

    if (error) {
      if (error.message.toLowerCase().includes("row-level security")) {
        setPaymentMessage(
          "Payment save blocked by Supabase RLS policy. Add insert/update/select policies for UserPaymentData where auth.uid() = uid.",
        );
      } else {
        setPaymentMessage(error.message);
      }
      setPaymentSaving(false);
      return;
    }

    setPaymentMessage("Payment information saved.");
    setPaymentSaving(false);
  }

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
                <button
                  type="button"
                  onClick={() => setShowPaymentForm((prev) => !prev)}
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "#1565c0",
                    cursor: "pointer",
                  }}
                >
                  {showPaymentForm ? "Hide Payment Form" : "Manage Payment Info"}
                </button>
              </div>

              {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit} style={{ marginTop: "14px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={paymentForm.name}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid #c8d2dc",
                        borderRadius: "8px",
                        padding: "9px 10px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Card number"
                      value={paymentForm.cardNumber}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          cardNumber: event.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid #c8d2dc",
                        borderRadius: "8px",
                        padding: "9px 10px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Expiry date (MM/YY)"
                      value={paymentForm.expiryDate}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          expiryDate: event.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid #c8d2dc",
                        borderRadius: "8px",
                        padding: "9px 10px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={paymentForm.cvv}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          cvv: event.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid #c8d2dc",
                        borderRadius: "8px",
                        padding: "9px 10px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Billing address"
                      value={paymentForm.billingAddress}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          billingAddress: event.target.value,
                        }))
                      }
                      style={{
                        border: "1px solid #c8d2dc",
                        borderRadius: "8px",
                        padding: "9px 10px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={paymentSaving}
                    style={{
                      marginTop: "10px",
                      border: "none",
                      borderRadius: "8px",
                      padding: "9px 14px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ffffff",
                      background: "#1f2937",
                      cursor: paymentSaving ? "not-allowed" : "pointer",
                      opacity: paymentSaving ? 0.7 : 1,
                    }}
                  >
                    {paymentSaving ? "Saving..." : "Save Payment Info"}
                  </button>
                  {paymentMessage && (
                    <p style={{ margin: "8px 0 0", color: "#334155", fontSize: "13px" }}>
                      {paymentMessage}
                    </p>
                  )}
                </form>
              )}
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
