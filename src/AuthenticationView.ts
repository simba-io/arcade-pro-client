// SplashView.ts
import { Application, Assets, Sprite, Text } from "pixi.js";
import { 
  createCustomCanvas, 
  CanvasConfig, 
  ViewContentProvider 
} from "./CanvasUtils";

export const AUTHENTICATION_VIEW_ID = "authentication-view-container";

class AuthenticationContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {
    
  }
}

export async function createAuthenticationView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#1099bb",
    containerId: AUTHENTICATION_VIEW_ID
  };

  const contentProvider = new AuthenticationContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
