import { createMenuCanvas, MENU_CANVAS_ID } from "./MenuCanvas";
import { createCanvasContainer } from "./CanvasUtils";
import { DASHBOARD_VIEW_ID, createDashboardView } from "./DashboardView";
import { AUTHENTICATION_VIEW_ID, createAuthenticationView } from "./AuthenticationView";
const components = [
  { label: "Login / Register", id: AUTHENTICATION_VIEW_ID },
  { label: "Dashboard", id: DASHBOARD_VIEW_ID }
];

// View manager to handle navigation between pages
let viewContainers: Map<string, HTMLElement> = new Map();
let currentView: string = AUTHENTICATION_VIEW_ID;

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

  // Create dashboard view with standardized styling
  const dashboardContainer = createCanvasContainer(
    mainContainer,
    DASHBOARD_VIEW_ID,
  );

  await createDashboardView(dashboardContainer);

  viewContainers.set(DASHBOARD_VIEW_ID, dashboardContainer);

  // Create authentication view with standardized styling
  const authenticationContainer = createCanvasContainer(
    mainContainer,
    AUTHENTICATION_VIEW_ID,
  );

  await createAuthenticationView(authenticationContainer);
  
  viewContainers.set(AUTHENTICATION_VIEW_ID, authenticationContainer);

  // Show initial view
  showView(AUTHENTICATION_VIEW_ID);

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);
    if (viewContainers.has(hash)) {
      showView(hash);
    }
  });
})();
