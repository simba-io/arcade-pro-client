// GamesView.ts
import { Application, Graphics, Text } from "pixi.js";
import { 
  createCustomCanvas, 
  CanvasConfig, 
  ViewContentProvider 
} from "./CanvasUtils";

export const GAMES_VIEW_ID = "games-view-container";

class GamesContentProvider implements ViewContentProvider {
  async setupContent(app: Application): Promise<void> {
    // Create a profile card background
    const cardBg = new Graphics();
    cardBg.beginFill(0x37474f, 0.8);
    cardBg.drawRoundedRect(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - 150,
      400,
      300,
      15,
    );
    cardBg.endFill();
    app.stage.addChild(cardBg);

    // Add games title
    const gamesTitle = new Text({
      text: "About Me",
      style: {
        fill: "#ffffff",
        fontSize: 36,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    gamesTitle.anchor.set(0.5);
    gamesTitle.position.set(app.screen.width / 2, app.screen.height / 2 - 100);
    app.stage.addChild(gamesTitle);

    // Add games content
    const gamesContent = new Text({
      text: "I'm a passionate developer\nwith expertise in web technologies.\n\nI love creating innovative solutions\nand building amazing experiences.",
      style: {
        fill: "#ffffff",
        fontSize: 18,
        fontFamily: "Arial",
        align: "center",
        lineHeight: 28,
      },
    });
    gamesContent.anchor.set(0.5);
    gamesContent.position.set(app.screen.width / 2, app.screen.height / 2 + 20);
    app.stage.addChild(gamesContent);

    // Add subtle animation to the card
    let cardOffset = 0;
    app.ticker.add((time) => {
      cardOffset += 0.02 * time.deltaTime;
      cardBg.y = app.screen.height / 2 - 150 + Math.sin(cardOffset) * 5;
    });
  }
}

export async function createGamesView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#c62828",
    containerId: GAMES_VIEW_ID,
  };

  const contentProvider = new GamesContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
