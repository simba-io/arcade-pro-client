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
    
  }
}

export async function createSplashView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#1099bb",
    containerId: SPLASH_VIEW_ID
  };

  const contentProvider = new SplashContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
