// BunnyCanvas.ts
import { Application, Assets, Sprite } from "pixi.js";

export const OTHER_CANVAS_ID = "other-pixi-container";

export async function createBunnyCanvas(container: HTMLElement) {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#c62828", resizeTo: window });

  // Set the canvas size to match the container
  app.renderer.resize(container.clientWidth, container.clientHeight);
  container.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });
}
