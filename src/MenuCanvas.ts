import { Application, Graphics, Text } from "pixi.js";

export const MENU_CANVAS_ID = "menu-canvas-container";

export async function createMenuCanvas(
  container: HTMLElement,
  components: Array<{ label: string; id: string }>,
  onNavigate?: (viewId: string) => void,
) {  // Create a new application for the menu
  const app = new Application();
  await app.init({
    background: "#263238",
    width: 150,
    height: window.innerHeight,
    antialias: true,
  });
  app.view.style.position = "fixed";
  app.view.style.left = "0";
  app.view.style.top = "0";
  app.view.style.height = "100vh";
  app.view.style.width = "150px";
  app.view.style.zIndex = "1000";
  app.view.style.transition = "transform 220ms ease";
  container.appendChild(app.view as HTMLCanvasElement);  // Create menu options based on passed components
  components.forEach((option, i) => {
    const button = new Graphics();
    button.beginFill(0x37474f);
    button.drawRoundedRect(10, 56 + i * 70, 130, 50, 12);
    button.endFill();
    button.interactive = true;
    button.cursor = "pointer";
    button.eventMode = "static";
    button.on("pointerover", () => (button.tint = 0x607d8b));
    button.on("pointerout", () => (button.tint = 0xffffff));
    button.on("pointertap", () => {
      // Navigate to the corresponding view
      if (onNavigate) {
        onNavigate(option.id);
      }
    });
    // Add text
    const text = new Text({
      text: option.label,
      style: {
        fill: "#fff",
        fontSize: 20,
        fontFamily: "Arial",
        align: "center",
      },
    });
    text.x = 75 - text.width / 2;
    text.y = 71 + i * 70 - text.height / 2;
    app.stage.addChild(button);
    app.stage.addChild(text);
  });

  // Create a DOM toggle button to show/hide the menu
  const toggle = document.createElement("button");
  toggle.setAttribute("aria-label", "Toggle menu");
  toggle.title = "Toggle menu";
  toggle.innerText = "×";
  // Basic styling so it sits near the top-left and above the menu
  Object.assign(toggle.style, {
    position: "fixed",
    top: "8px",
    left: "8px",
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
  const toggleMenu = () => {
    visible = !visible;
    if (visible) {
      (app.view as HTMLCanvasElement).style.transform = "translateX(0)";
      toggle.innerText = "×";    } else {
      (app.view as HTMLCanvasElement).style.transform = "translateX(-150px)";
      toggle.innerText = "☰";
    }
  };
  toggle.addEventListener("click", toggleMenu);

  // Keep menu sized correctly on resize
  const onResize = () => {
    app.renderer.resize(150, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // Return a cleanup function in case the caller wants to destroy
  return () => {
    toggle.removeEventListener("click", toggleMenu);
    if (toggle.parentElement) toggle.parentElement.removeChild(toggle);
    window.removeEventListener("resize", onResize);
    try {
      app.destroy(true, { children: true, texture: true });
    }
    catch {}
  };
}
