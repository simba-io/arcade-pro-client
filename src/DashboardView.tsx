import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./main";
import type { UserPaymentData } from "./UserData";
import { dashboardStyles as styles } from "./DashboardViewStyles";

export const DASHBOARD_VIEW_ID = "dashboard-view-container";

type DashboardStats = {
  userName: string;
  wins: number;
  level: number;
};

function DashboardPanel()
{
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

  useEffect(() =>
  {
    async function loadDashboard()
    {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user)
      {
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

      if (error)
      {
        setErrorMessage(error.message);
      }
      else if (data)
      {
        const resolvedName = data.userName || metadataName || "Player";
        setUserName(resolvedName);
        setStats({
          userName: resolvedName,
          wins: Number(data.wins ?? 0),
          level: Number(data.level ?? 1),
        });
        setFundsBalance(Number(data.funds ?? 0));
      }
      else
      {
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

      if (paymentData)
      {
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

  async function handlePaymentSubmit(event: FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setPaymentMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
    {
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
    )
    {
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

    if (error)
    {
      if (error.message.toLowerCase().includes("row-level security"))
      {
        setPaymentMessage(
          "Payment save blocked by Supabase RLS policy. Add insert/update/select policies for UserPaymentData where auth.uid() = uid.",
        );
      }
      else
      {
        setPaymentMessage(error.message);
      }

      setPaymentSaving(false);
      return;
    }

    setPaymentMessage("Payment information saved.");
    setPaymentSaving(false);
  }

  const depositButtonStyle = {
    ...styles.actionButton,
    ...styles.depositButton,
  };

  const withdrawButtonStyle = {
    ...styles.actionButton,
    ...styles.withdrawButton,
  };

  const managePaymentButtonStyle = {
    ...styles.actionButton,
    ...styles.managePaymentButton,
  };

  const savePaymentButtonStyle = {
    ...styles.savePaymentButton,
    cursor: paymentSaving ? "not-allowed" : "pointer",
    opacity: paymentSaving ? 0.7 : 1,
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dashboard</h1>

        <p style={styles.subtitle}>
          {userName ? `Welcome, ${userName}` : "Welcome"}
        </p>

        {email && (
          <p style={styles.emailText}>
            Signed in as {email}
          </p>
        )}

        {loading && (
          <p style={styles.loadingText}>Loading profile...</p>
        )}

        {!loading && errorMessage && (
          <p style={styles.errorText}>{errorMessage}</p>
        )}

        {!loading && !errorMessage && stats && (
          <>
            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Username</p>
                <p style={styles.statValue}>{stats.userName}</p>
              </div>

              <div style={styles.statCard}>
                <p style={styles.statLabel}>Wins</p>
                <p style={styles.statValue}>{stats.wins}</p>
              </div>

              <div style={styles.statCard}>
                <p style={styles.statLabel}>Level</p>
                <p style={styles.statValue}>{stats.level}</p>
              </div>
            </div>

            <div style={styles.fundsCard}>
              <p style={styles.fundsLabel}>Funds Management</p>
              <p style={styles.fundsBalance}>
                Balance: ${fundsBalance.toFixed(2)}
              </p>

              <div style={styles.actionRow}>
                <button
                  type="button"
                  onClick={() =>
                  {
                    console.log("Deposit clicked - implement callback");
                    // TODO: add deposit callback
                  }}
                  style={depositButtonStyle}
                >
                  Deposit
                </button>

                <button
                  type="button"
                  onClick={() =>
                  {
                    console.log("Withdraw clicked - implement callback");
                    // TODO: add withdraw callback
                  }}
                  style={withdrawButtonStyle}
                >
                  Withdraw
                </button>

                <button
                  type="button"
                  onClick={() => setShowPaymentForm((prev) => !prev)}
                  style={managePaymentButtonStyle}
                >
                  {showPaymentForm ? "Hide Payment Form" : "Manage Payment Info"}
                </button>
              </div>

              {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit} style={styles.paymentForm}>
                  <div style={styles.paymentGrid}>
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
                      style={styles.paymentInput}
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
                      style={styles.paymentInput}
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
                      style={styles.paymentInput}
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
                      style={styles.paymentInput}
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
                      style={styles.paymentInput}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={paymentSaving}
                    style={savePaymentButtonStyle}
                  >
                    {paymentSaving ? "Saving..." : "Save Payment Info"}
                  </button>

                  {paymentMessage && (
                    <p style={styles.paymentMessage}>{paymentMessage}</p>
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

export async function createDashboardView(container: HTMLElement)
{
  container.innerHTML = "";
  const root = createRoot(container);
  root.render(<DashboardPanel />);
  return root;
}
