import { createSplashView, SPLASH_VIEW_ID } from "./SplashView";
import { createMenuCanvas, MENU_CANVAS_ID } from "./MenuCanvas";
import { createCanvasContainer } from "./CanvasUtils";
//import { createUserPanelCanvas, USER_PANEL_CANVAS_ID } from "./UserPanelCanvas";
import { DASHBOARD_VIEW_ID, createDashboardView } from "./DashboardView";
import { GAMES_VIEW_ID, createGamesView } from "./GamesView";

const components = [
  { label: "Splash", id: SPLASH_VIEW_ID },
  { label: "Games", id: GAMES_VIEW_ID },
  { label: "Dashboard", id: DASHBOARD_VIEW_ID },
];

// View manager to handle navigation between pages
let viewContainers: Map<string, HTMLElement> = new Map();
let currentView: string = SPLASH_VIEW_ID;

function showView(viewId: string) {
  // Hide all views
  viewContainers.forEach((container) => {
    container.style.display = "none";
  });
  // Show the selected view
  const selectedView = viewContainers.get(viewId);
  if (selectedView) {
    selectedView.style.display = "block";
    currentView = viewId;
    // Update URL hash for browser history
    window.location.hash = viewId;
  }
}

(async () => {
  // Create and mount the menu canvas (left side)
  const menuContainer = document.createElement("div");
  menuContainer.id = MENU_CANVAS_ID;
  document.body.appendChild(menuContainer);
  await createMenuCanvas(menuContainer, components, showView);

  // Create all canvases using standardized container creation
  const mainContainer = document.body;

  // Create splash view with standardized styling
  const splashContainer = createCanvasContainer(mainContainer, SPLASH_VIEW_ID);
  await createSplashView(splashContainer);
  viewContainers.set(SPLASH_VIEW_ID, splashContainer);

  // Create games view with standardized styling
  const gamesContainer = createCanvasContainer(mainContainer, GAMES_VIEW_ID);
  await createGamesView(gamesContainer);
  viewContainers.set(GAMES_VIEW_ID, gamesContainer);

  // Create dashboard view with standardized styling
  const dashboardContainer = createCanvasContainer(
    mainContainer,
    DASHBOARD_VIEW_ID,
  );
  await createDashboardView(dashboardContainer);
  viewContainers.set(DASHBOARD_VIEW_ID, dashboardContainer);

  // Show initial view
  showView(SPLASH_VIEW_ID);

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);
    if (viewContainers.has(hash)) {
      showView(hash);
    }
  });
})();
