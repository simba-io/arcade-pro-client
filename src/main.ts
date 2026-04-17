import * as PIXI from 'pixi.js';
import { MainContainer } from './MainContainer';

// Configuration for your "Safe Zone" / Design resolution
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const app = new PIXI.Application();

async function init()
{
    await app.init({
        background: '#1099bb',
        resizeTo: window, // Automatically matches the browser window size
        antialias: true,
        resolution: window.devicePixelRatio || 1,
    });

    document.getElementById('game-container')!.appendChild(app.canvas);

    // Create a main container to hold all game objects
    const mainContainer = new MainContainer();
    app.stage.addChild(mainContainer);

    // Placeholder: A centered sprite or graphic to test scaling
    const graphics = new PIXI.Graphics()
        .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
        .fill({ color: 0xffffff, alpha: 0.1 })
        .stroke({ width: 10, color: 0xff0000 });
    
    mainContainer.addChild(graphics);

    // Resize function to maintain aspect ratio (Letterboxing)
    const resize = () => 
    {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate scale to fit the screen
        const scale = Math.min(screenWidth / DESIGN_WIDTH, screenHeight / DESIGN_HEIGHT);

        mainContainer.scale.set(scale);

        // Center the scene
        mainContainer.x = (screenWidth - DESIGN_WIDTH * scale) / 2;
        mainContainer.y = (screenHeight - DESIGN_HEIGHT * scale) / 2;
    };

    window.addEventListener('resize', resize);
    resize(); // Initial call
}

init();