// SplashView.ts
import { Application, Assets, Sprite, Text } from "pixi.js";
import { 
  createCustomCanvas, 
  CanvasConfig, 
  ViewContentProvider 
} from "./CanvasUtils";

export const SPLASH_VIEW_ID = "splash-view-container";

class SplashContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {
    // Load the bunny texture
    const texture = await Assets.load("/assets/bunny.png");

    // Create a bunny Sprite
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.position.set(app.screen.width / 2, app.screen.height / 2 + 50);
    app.stage.addChild(bunny);

    // Add a welcome text
    const welcomeText = new Text({
      text: "Welcome to Our Site!",
      style: {
        fill: "#ffffff",
        fontSize: 48,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    welcomeText.anchor.set(0.5);
    welcomeText.position.set(app.screen.width / 2, app.screen.height / 2 - 100);
    app.stage.addChild(welcomeText);

    // Animate the bunny
    app.ticker.add((time) => {
      bunny.rotation += 0.05 * time.deltaTime;
    });

    // Animate the text (pulsing effect)
    let textScale = 1;
    let scaleDirection = 1;
    app.ticker.add((time) => {
      textScale += 0.01 * scaleDirection * time.deltaTime;
      if (textScale > 1.1) scaleDirection = -1;
      if (textScale < 0.9) scaleDirection = 1;
      welcomeText.scale.set(textScale);
    });
  }
}

export async function createSplashView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#1099bb",
    containerId: SPLASH_VIEW_ID,
  };

  const contentProvider = new SplashContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
