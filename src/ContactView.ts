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
    // Create contact form background
    const formBg = new Graphics();
    formBg.beginFill(0x2e7d32, 0.9);
    formBg.drawRoundedRect(
      app.screen.width / 2 - 250,
      app.screen.height / 2 - 150,
      500,
      300,
      20,
    );
    formBg.endFill();
    app.stage.addChild(formBg);

    // Add contact title
    const contactTitle = new Text({
      text: "Get In Touch",
      style: {
        fill: "#ffffff",
        fontSize: 32,
        fontFamily: "Arial",
        fontWeight: "bold",
      },
    });
    contactTitle.anchor.set(0.5);
    contactTitle.position.set(app.screen.width / 2, app.screen.height / 2 - 100);
    app.stage.addChild(contactTitle);

    // Add contact information
    const contactInfo = new Text({
      text: "📧 email@example.com\n📞 +1 (555) 123-4567\n🌐 www.mywebsite.com\n📍 123 Main St, City, State",
      style: {
        fill: "#ffffff",
        fontSize: 20,
        fontFamily: "Arial",
        align: "left",
        lineHeight: 35,
      },
    });
    contactInfo.anchor.set(0.5);
    contactInfo.position.set(app.screen.width / 2, app.screen.height / 2 + 20);
    app.stage.addChild(contactInfo);

    // Add animated border effect
    const borderGraphics = new Graphics();
    app.stage.addChild(borderGraphics);
    
    let borderAnimation = 0;
    app.ticker.add((time) => {
      borderAnimation += 0.05 * time.deltaTime;
      
      borderGraphics.clear();
      borderGraphics.lineStyle(3, 0x81c784, 0.8);
      
      const progress = (Math.sin(borderAnimation) + 1) / 2;
      const dashLength = 20;
      const gapLength = 10;
      const totalLength = (dashLength + gapLength);
      
      // Animate dashed border around the form
      for (let i = 0; i < 20; i++) {
        const offset = (progress * totalLength + i * totalLength) % (500 + 300) * 2;
        if (offset < 500) {
          // Top edge
          borderGraphics.moveTo(app.screen.width / 2 - 250 + offset, app.screen.height / 2 - 150);
          borderGraphics.lineTo(Math.min(app.screen.width / 2 - 250 + offset + dashLength, app.screen.width / 2 + 250), app.screen.height / 2 - 150);
        }
      }
    });
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
