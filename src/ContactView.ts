// ContactView.ts
import { Application, Graphics, Text } from "pixi.js";
import { 
  createCustomCanvas, 
  CanvasConfig, 
  ViewContentProvider 
} from "./CanvasUtils";

export const CONTACT_VIEW_ID = "contact-view-container";

class ContactContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {
    
  }
}

export async function createContactView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#43a047",
    containerId: CONTACT_VIEW_ID,
  };

  const contentProvider = new ContactContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}