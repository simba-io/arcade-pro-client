// DashboardView.ts
import { Application, Graphics, Text } from "pixi.js";
import { 
  createCustomCanvas, 
  CanvasConfig, 
  ViewContentProvider 
} from "./CanvasUtils";

export const DASHBOARD_VIEW_ID = "dashboard-view-container";

class DashboardContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {
    
  }
}

export async function createDashboardView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#43a047",
    containerId: DASHBOARD_VIEW_ID,
  };

  const contentProvider = new DashboardContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
