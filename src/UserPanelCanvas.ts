import { Application, Graphics, Text } from "pixi.js";
import {
  registerWithEmail,
  signInWithEmail,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  createUserData,
  fetchUserData,
} from "./supabaseClient";

export const USER_PANEL_CANVAS_ID = "user-panel-canvas-container";

export async function createUserPanelCanvas(
  container: HTMLElement,
) {
  // User authentication state
  let isSignedIn = false;

  // auth panel tap handler (will open sign-in form when signed out)
  const authPanelTap = async () => {
    if (!isSignedIn) {
      // open sign-in form
      createSignInForm();
    } else {
      // sign out via Supabase
      try {
        await signOut();
        isSignedIn = false;
        updateAuthButton();
      } catch (err) {
        alert(`Sign-out failed: ${(err as Error).message}`);
      }
    }
  };

  // Create a new application for the user panel
  const app = new Application();
  await app.init({
    background: "#263238",
    width: 450,
    height: window.innerHeight,
    antialias: true,
  });
  app.view.style.position = "fixed";
  app.view.style.right = "0";
  app.view.style.top = "0";
  app.view.style.height = "100vh";
  app.view.style.width = "450px";
  app.view.style.zIndex = "1000";
  app.view.style.transition = "transform 220ms ease";
  container.appendChild(app.view as HTMLCanvasElement);

  // Add user info panel background
  const panelBg = new Graphics();
  panelBg.beginFill(0x37474f);
  panelBg.drawRoundedRect(10, 56, 430, 50, 12);
  panelBg.endFill();
  panelBg.interactive = true;
  panelBg.cursor = "pointer";
  panelBg.eventMode = "static";
  panelBg.on("pointerover", () => (panelBg.tint = 0x607d8b));
  panelBg.on("pointerout", () => (panelBg.tint = 0xffffff));
  panelBg.on("pointertap", authPanelTap);
  app.stage.addChild(panelBg);

  // Add auth button text
  const authText = new Text({
    text: "Sign In",
    style: {
      fill: "#fff",
      fontSize: 20,
      fontFamily: "Arial",
      align: "center",
    },
  });
  authText.x = 225 - authText.width / 2;
  authText.y = 81 - authText.height / 2;
  app.stage.addChild(authText);

  // Create user info display fields
  const userNameField = new Text({
    text: "User Name: Guest",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  userNameField.x = 20;
  userNameField.y = 130;
  userNameField.visible = false;
  app.stage.addChild(userNameField);

  // Email display field
  const emailField = new Text({
    text: "Email: -",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  emailField.x = 20;
  emailField.y = 165;
  emailField.visible = false;
  app.stage.addChild(emailField);

  const walletBalanceField = new Text({
    text: "Wallet: $0.00",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  walletBalanceField.x = 20;
  walletBalanceField.y = 200;
  walletBalanceField.visible = false;
  app.stage.addChild(walletBalanceField);

  const winsField = new Text({
    text: "Wins: 0",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  winsField.x = 20;
  winsField.y = 235;
  winsField.visible = false;
  app.stage.addChild(winsField);

  const lossesField = new Text({
    text: "Losses: 0",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  lossesField.x = 20;
  lossesField.y = 270;
  lossesField.visible = false;
  app.stage.addChild(lossesField);

  const pushesField = new Text({
    text: "Pushes: 0",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  pushesField.x = 20;
  pushesField.y = 305;
  pushesField.visible = false;
  app.stage.addChild(pushesField);

  // Register button (opens a DOM form to enter user details)
  const registerBtn = new Graphics();
  registerBtn.beginFill(0x4caf50);
  registerBtn.drawRoundedRect(10, 280, 430, 44, 10);
  registerBtn.endFill();
  registerBtn.interactive = true;
  registerBtn.cursor = "pointer";
  registerBtn.eventMode = "static";
  registerBtn.on("pointerover", () => (registerBtn.tint = 0x66bb6a));
  registerBtn.on("pointerout", () => (registerBtn.tint = 0xffffff));
  app.stage.addChild(registerBtn);

  const registerText = new Text({
    text: "Register / Edit Details",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  registerText.x = 225 - registerText.width / 2;
  registerText.y = 302 - registerText.height / 2;
  app.stage.addChild(registerText);

  // DOM: Registration form (name, email, password, confirm)
  const createRegisterForm = () => {
    const form = document.createElement("div");
    Object.assign(form.style, {
      position: "fixed",
      right: "24px",
      top: "120px",
      width: "420px",
      padding: "12px",
      background: "#121617",
      border: "1px solid #2b2f30",
      borderRadius: "8px",
      color: "#fff",
      zIndex: "1200",
    } as CSSStyleDeclaration);

    const mkLabel = (text: string) => {
      const l = document.createElement("div");
      l.innerText = text;
      Object.assign(l.style, { marginBottom: "6px", fontSize: "13px" } as CSSStyleDeclaration);
      return l;
    };
    const mkInput = (value = "", type = "text") => {
      const i = document.createElement("input");
      i.type = type;
      i.value = value;
      Object.assign(i.style, {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #333",
        background: "#0e1111",
        color: "#fff",
      } as CSSStyleDeclaration);
      return i as HTMLInputElement;
    };

    const nameLabel = mkLabel("Name");
    const nameInput = mkInput("");
    const emailLabel = mkLabel("Email");
    const emailInput = mkInput("", "email");
    const passLabel = mkLabel("Password");
    const passInput = mkInput("", "password");
    const pass2Label = mkLabel("Confirm Password");
    const pass2Input = mkInput("", "password");

    const row = document.createElement("div");
    Object.assign(row.style, { display: "flex", gap: "8px" } as CSSStyleDeclaration);
    const ok = document.createElement("button");
    ok.innerText = "Register";
    Object.assign(ok.style, { flex: "1", padding: "8px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" } as CSSStyleDeclaration);
    const cancel = document.createElement("button");
    cancel.innerText = "Cancel";
    Object.assign(cancel.style, { flex: "1", padding: "8px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" } as CSSStyleDeclaration);
    row.appendChild(ok);
    row.appendChild(cancel);

    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(passLabel);
    form.appendChild(passInput);
    form.appendChild(pass2Label);
    form.appendChild(pass2Input);
    form.appendChild(row);

    document.body.appendChild(form);

    cancel.addEventListener("click", () => { if (form.parentElement) form.parentElement.removeChild(form); });

    ok.addEventListener("click", async () => {
      const nameVal = nameInput.value.trim() || "Guest";
      const emailVal = emailInput.value.trim() || "-";
      const p1 = passInput.value;
      const p2 = pass2Input.value;
      if (!emailVal || !p1) return alert("Email and password required");
      if (p1 !== p2) return alert("Passwords do not match");

      try {
        ok.disabled = true;
        ok.innerText = "Registering...";

        // Register with Supabase
        const regData = await registerWithEmail(emailVal, p1);
        const userId = regData.user?.id;
        if (!userId) throw new Error("Registration successful but no user ID returned");

        // If Supabase returned a session immediately we can create UserData now.
        // Otherwise the user must confirm their email / sign in — we'll create the UserData
        // inside the auth-state listener once a session exists (to satisfy RLS).
        if (regData.session) {
          await createUserData(userId, emailVal);
        }

        // Update displayed fields
        userNameField.text = `User Name: ${nameVal}`;
        emailField.text = `Email: ${emailVal}`;
        walletBalanceField.text = `Wallet: $0.00`;
        winsField.text = `Wins: 0`;
        lossesField.text = `Losses: 0`;
        pushesField.text = `Pushes: 0`;

        userNameField.visible = true;
        emailField.visible = true;
        walletBalanceField.visible = true;
        winsField.visible = true;
        lossesField.visible = true;
        pushesField.visible = true;

        isSignedIn = true;
        updateAuthButton();

        if (form.parentElement) form.parentElement.removeChild(form);
      } catch (err) {
        alert(`Registration failed: ${(err as Error).message}`);
        ok.disabled = false;
        ok.innerText = "Register";
      }
    });

    return form;
  };

  // Show registration form when register button pressed
  registerBtn.on("pointertap", () => { createRegisterForm(); });

  // Sign-in form (email + password)
  const createSignInForm = () => {
    const form = document.createElement("div");
    Object.assign(form.style, {
      position: "fixed",
      right: "24px",
      top: "120px",
      width: "320px",
      padding: "12px",
      background: "#121617",
      border: "1px solid #2b2f30",
      borderRadius: "8px",
      color: "#fff",
      zIndex: "1200",
    } as CSSStyleDeclaration);

    const mkLabel = (text: string) => {
      const l = document.createElement("div");
      l.innerText = text;
      Object.assign(l.style, { marginBottom: "6px", fontSize: "13px" } as CSSStyleDeclaration);
      return l;
    };
    const mkInput = (type = "text") => {
      const i = document.createElement("input");
      i.type = type;
      Object.assign(i.style, { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #333", background: "#0e1111", color: "#fff" } as CSSStyleDeclaration);
      return i as HTMLInputElement;
    };

    const emailLabel = mkLabel("Email");
    const emailInput = mkInput("email");
    const passLabel = mkLabel("Password");
    const passInput = mkInput("password");

    const row = document.createElement("div");
    Object.assign(row.style, { display: "flex", gap: "8px" } as CSSStyleDeclaration);
    const ok = document.createElement("button");
    ok.innerText = "Sign In";
    Object.assign(ok.style, { flex: "1", padding: "8px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" } as CSSStyleDeclaration);
    const cancel = document.createElement("button");
    cancel.innerText = "Cancel";
    Object.assign(cancel.style, { flex: "1", padding: "8px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" } as CSSStyleDeclaration);
    row.appendChild(ok);
    row.appendChild(cancel);

    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(passLabel);
    form.appendChild(passInput);
    form.appendChild(row);

    document.body.appendChild(form);

    cancel.addEventListener("click", () => { if (form.parentElement) form.parentElement.removeChild(form); });

    ok.addEventListener("click", async () => {
      const emailVal = emailInput.value.trim() || "-";
      const passVal = passInput.value || "";
      if (!emailVal || !passVal) return alert("Email and password required");

      try {
        ok.disabled = true;
        ok.innerText = "Signing in...";

        // Sign in with Supabase
        await signInWithEmail(emailVal, passVal);
        
        // Fetch current user
        const user = await getCurrentUser();
        if (!user) throw new Error("Failed to get user");

        // Fetch user data from UserData table
        const userData = await fetchUserData(user.id);

        // Update display fields from database
        const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "Player";
        userNameField.text = `User Name: ${displayName}`;
        emailField.text = `Email: ${user.email || "-"}`;
        walletBalanceField.text = `Wallet: $${(userData?.wallet || 0).toFixed(2)}`;
        winsField.text = `Wins: ${userData?.wins || 0}`;
        lossesField.text = `Losses: ${userData?.losses || 0}`;
        pushesField.text = `Pushes: ${userData?.pushes || 0}`;

        userNameField.visible = true;
        emailField.visible = true;
        walletBalanceField.visible = true;
        winsField.visible = true;
        lossesField.visible = true;
        pushesField.visible = true;

        isSignedIn = true;
        updateAuthButton();

        if (form.parentElement) form.parentElement.removeChild(form);
      } catch (err) {
        alert(`Sign-in failed: ${(err as Error).message}`);
        ok.disabled = false;
        ok.innerText = "Sign In";
      }
    });

    return form;
  };

  // Function to update the auth button text and state
  const updateAuthButton = () => {
    authText.text = isSignedIn ? "Sign Out" : "Sign In";
    authText.x = 225 - authText.width / 2;
    
    // Show/hide user info fields based on signed in state
    userNameField.visible = isSignedIn;
    emailField.visible = isSignedIn;
    walletBalanceField.visible = isSignedIn;
    winsField.visible = isSignedIn;
    lossesField.visible = isSignedIn;
    pushesField.visible = isSignedIn;

    // hide register button when signed in
    registerBtn.visible = !isSignedIn;
    registerText.visible = !isSignedIn;
  };

  // Create a DOM toggle button to show/hide the panel
  const toggle = document.createElement("button");
  toggle.setAttribute("aria-label", "Toggle user panel");
  toggle.title = "Toggle user panel";
  toggle.innerText = "×";
  // Basic styling so it sits near the top-right and above the panel
  Object.assign(toggle.style, {
    position: "fixed",
    top: "8px",
    right: "8px",
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "none",
    background: "#37474f",
    color: "#fff",
    fontSize: "18px",
    zIndex: "1100",
    cursor: "pointer",
  });
  document.body.appendChild(toggle);

  let visible = true;
  const togglePanel = () => {
    visible = !visible;
    if (visible) {
      (app.view as HTMLCanvasElement).style.transform = "translateX(0)";
      toggle.innerText = "×";
    } else {
      (app.view as HTMLCanvasElement).style.transform = "translateX(450px)";
      toggle.innerText = "☰";
    }
  };
  toggle.addEventListener("click", togglePanel);

  // Keep panel sized correctly on resize
  const onResize = () => {
    app.renderer.resize(450, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // Listen for auth state changes and sync UI
  let unsubscribe: (() => void) | undefined;
  onAuthStateChange(async (session) => {
    if (session?.user) {
      isSignedIn = true;
      const displayName = session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Player";
      userNameField.text = `User Name: ${displayName}`;
      emailField.text = `Email: ${session.user.email || "-"}`;
      
      // Fetch user data from database; if none exists create it (RLS requires auth.uid())
      try {
        const userData = await fetchUserData(session.user.id);
        if (!userData) {
          // create new UserData record for this authenticated user
          await createUserData(session.user.id, session.user.email || session.user.id);
          walletBalanceField.text = `Wallet: $0.00`;
          winsField.text = `Wins: 0`;
          lossesField.text = `Losses: 0`;
          pushesField.text = `Pushes: 0`;
        } else {
          walletBalanceField.text = `Wallet: $${(userData.wallet || 0).toFixed(2)}`;
          winsField.text = `Wins: ${userData.wins || 0}`;
          lossesField.text = `Losses: ${userData.losses || 0}`;
          pushesField.text = `Pushes: ${userData.pushes || 0}`;
        }
      } catch (err) {
        console.error("Failed to fetch or create user data:", err);
        walletBalanceField.text = `Wallet: $0.00`;
        winsField.text = `Wins: 0`;
        lossesField.text = `Losses: 0`;
        pushesField.text = `Pushes: 0`;
      }
    } else {
      isSignedIn = false;
    }
    updateAuthButton();
  });

  // Return a cleanup function in case the caller wants to destroy
  return () => {
    toggle.removeEventListener("click", togglePanel);
    if (toggle.parentElement) toggle.parentElement.removeChild(toggle);
    window.removeEventListener("resize", onResize);
    if (unsubscribe) unsubscribe();
    try {
      app.destroy(true, { children: true, texture: true });
    }
    catch {}
  };
}
