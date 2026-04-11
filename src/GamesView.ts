// GamesView.ts
import { Application, Graphics, Text } from "pixi.js";
import {
  createCustomCanvas,
  CanvasConfig,
  ViewContentProvider,
} from "./CanvasUtils";

export const GAMES_VIEW_ID = "games-view-container";

class GamesContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {}
}

export async function createGamesView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#c62828",
    containerId: GAMES_VIEW_ID,
  };

  const contentProvider = new GamesContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
