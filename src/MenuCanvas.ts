import { Application, Graphics, Text } from "pixi.js";

export const MENU_CANVAS_ID = "menu-canvas-container";

export async function createMenuCanvas(container: HTMLElement, components: Array<{ label: string, id: string }>) {
  // Create a new application for the menu
  const app = new Application();
  await app.init({ background: "#263238", width: 120, height: window.innerHeight, antialias: true });
  app.canvas.style.position = "fixed";
  app.canvas.style.left = "0";
  app.canvas.style.top = "0";
  app.canvas.style.height = "100vh";
  app.canvas.style.width = "120px";
  app.canvas.style.zIndex = "1000";
  container.appendChild(app.canvas);

  // Create menu options based on passed components
  components.forEach((option, i) => {
    const button = new Graphics();
    button.beginFill(0x37474f);
    button.drawRoundedRect(10, 40 + i * 70, 100, 50, 12);
    button.endFill();
    button.interactive = true;
    button.cursor = "pointer";
    button.eventMode = "static";
    button.on("pointerover", () => button.tint = 0x607d8b);
    button.on("pointerout", () => button.tint = 0xffffff);
    button.on("pointertap", () => {
      // Scroll to the corresponding component
      const target = document.getElementById(option.id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    // Add text
    const text = new Text({
      text: option.label,
      style: { fill: "#fff", fontSize: 20, fontFamily: "Arial", align: "center" }
    });
    text.x = 60 - text.width / 2;
    text.y = 55 + i * 70 - text.height / 2;
    app.stage.addChild(button);
    app.stage.addChild(text);
  });
}
