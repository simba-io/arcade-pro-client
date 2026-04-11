// CanvasUtils.ts - Standardized canvas styling and creation utilities
import { Application, Assets, Sprite } from "pixi.js";

export interface CanvasConfig {
  backgroundColor: string;
  containerId: string;
  width?: number;
  height?: number;
}

export interface ViewContentProvider {
  setupContent(app: Application): Promise<void>;
}

export const CANVAS_STYLES = {
  width: "100%",
  height: "100%",
  marginTop: "0",
  marginBottom: "0"
} as const;

export async function createStandardCanvas(
  container: HTMLElement,
  config: CanvasConfig,
) {
  // Create a new application
  const app = new Application();

  // Initialize the application with standard settings
  await app.init({
    background: config.backgroundColor,
    resizeTo: window,
  });

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

  // Listen for animate update with standard rotation speed
  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });
  return app;
}

export async function createCustomCanvas(
  container: HTMLElement,
  config: CanvasConfig,
  contentProvider: ViewContentProvider,
) {
  // Create a new application
  const app = new Application();

  // Initialize the application with standard settings
  await app.init({
    background: config.backgroundColor,
    resizeTo: window,
  });

  // Set the canvas size to match the container
  app.renderer.resize(container.clientWidth, container.clientHeight);
  container.appendChild(app.canvas);

  // Let the view implement its own content
  await contentProvider.setupContent(app);

  return app;
}

export function createCanvasContainer(
  parentElement: HTMLElement,
  containerId: string,
): HTMLElement {
  const container = document.createElement("div");
  container.style.margin = "0";
  container.style.padding = "0";
  container.style.border = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.display = "block";
  container.style.overflow = "hidden";
  container.id = containerId;
  parentElement.appendChild(container);
  return container;
}