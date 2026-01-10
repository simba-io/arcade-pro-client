import { Application, Graphics, Text } from "pixi.js";

export const USER_PANEL_CANVAS_ID = "user-panel-canvas-container";

export async function createUserPanelCanvas(
  container: HTMLElement,
) {
  // User authentication state
  let isSignedIn = false;

  // Handler method for toggling sign in/out
  const handleAuthToggle = () => {
    isSignedIn = !isSignedIn;
    updateAuthButton();
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
  panelBg.on("pointertap", handleAuthToggle);
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

  const walletBalanceField = new Text({
    text: "Wallet: $0.00",
    style: {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Arial",
    },
  });
  walletBalanceField.x = 20;
  walletBalanceField.y = 165;
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
  winsField.y = 200;
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
  lossesField.y = 235;
  lossesField.visible = false;
  app.stage.addChild(lossesField);

  // Function to update the auth button text and state
  const updateAuthButton = () => {
    authText.text = isSignedIn ? "Sign Out" : "Sign In";
    authText.x = 225 - authText.width / 2;
    
    // Show/hide user info fields based on signed in state
    userNameField.visible = isSignedIn;
    walletBalanceField.visible = isSignedIn;
    winsField.visible = isSignedIn;
    lossesField.visible = isSignedIn;
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

  // Return a cleanup function in case the caller wants to destroy
  return () => {
    toggle.removeEventListener("click", togglePanel);
    if (toggle.parentElement) toggle.parentElement.removeChild(toggle);
    window.removeEventListener("resize", onResize);
    try {
      app.destroy(true, { children: true, texture: true });
    }
    catch {}
  };
}
