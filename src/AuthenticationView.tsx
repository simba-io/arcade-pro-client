import { FormEvent, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./main";

export const AUTHENTICATION_VIEW_ID = "authentication-view-container";

type AuthMode = "login" | "register";

function AuthenticationForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isRegisterMode = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (isRegisterMode && !username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (isRegisterMode) {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error)
      {
        setErrorMessage(error.message);
      }

      try {
        
      const user =(await supabase.auth.getUser()).data.user;
      if (user) 
      {
        const uid = user.id;
        await supabase.from('UserData').insert({uid: uid, userName: username, wins: 0, level: 1, funds: 0}).select();
      }
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    }
    else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setErrorMessage(error.message);
      }
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        background:
          "radial-gradient(circle at 20% 10%, #c2f0ff 0%, #70bdd7 35%, #1099bb 100%)",
        boxSizing: "border-box",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: "0 0 14px", color: "#10313b" }}>
          {isRegisterMode ? "Create account" : "Welcome back"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            style={{
              border: "1px solid #d0d7de",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "login" ? "#1099bb" : "#f4f7f9",
              color: mode === "login" ? "#ffffff" : "#1f2933",
            }}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            style={{
              border: "1px solid #d0d7de",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "register" ? "#1099bb" : "#f4f7f9",
              color: mode === "register" ? "#ffffff" : "#1f2933",
            }}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1f2933",
                }}
                htmlFor="auth-username"
              >
                Username
              </label>
              <input
                id="auth-username"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #c8d2dc",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "14px",
                  fontSize: "14px",
                  outlineColor: "#1099bb",
                }}
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1f2933",
            }}
            htmlFor="auth-email"
          >
            Email
          </label>
          <input
            id="auth-email"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #c8d2dc",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "14px",
              fontSize: "14px",
              outlineColor: "#1099bb",
            }}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1f2933",
            }}
            htmlFor="auth-password"
          >
            Password
          </label>
          <input
            id="auth-password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #c8d2dc",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "14px",
              fontSize: "14px",
              outlineColor: "#1099bb",
            }}
            type="password"
            autoComplete={isRegisterMode ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {isRegisterMode && (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1f2933",
                }}
                htmlFor="auth-confirm-password"
              >
                Confirm password
              </label>
              <input
                id="auth-confirm-password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #c8d2dc",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "14px",
                  fontSize: "14px",
                  outlineColor: "#1099bb",
                }}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </>
          )}

          {errorMessage && (
            <p style={{ margin: "0 0 12px", color: "#b42318", fontSize: "13px" }}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 700,
              background: "#1099bb",
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegisterMode
                ? "Create account"
                : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function createAuthenticationView(container: HTMLElement) {
  container.innerHTML = "";
  const root = createRoot(container);
  root.render(<AuthenticationForm />);
  return root;
}
