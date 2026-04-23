import { createMenuCanvas, MENU_CANVAS_ID } from "./MenuCanvas";
import { createCanvasContainer } from "./CanvasUtils";
import { DASHBOARD_VIEW_ID, createDashboardView } from "./DashboardView.tsx";
import { AUTHENTICATION_VIEW_ID, createAuthenticationView } from "./AuthenticationView.tsx";
import { GAMES_VIEW_ID, createGamesView } from "./GamesView";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const components = [
  { label: "Login / Register", id: AUTHENTICATION_VIEW_ID },
  { label: "Dashboard", id: DASHBOARD_VIEW_ID },
  { label: "Games", id: GAMES_VIEW_ID },
];

// View manager to handle navigation between pages
let viewContainers: Map<string, HTMLElement> = new Map();
let isAuthenticated = false;
let logoutButton: HTMLButtonElement | null = null;
let menuContainer: HTMLDivElement | null = null;
let destroyMenuCanvas: (() => void) | null = null;

async function renderMenu(authenticated: boolean) {
  if (!menuContainer) return;

  if (destroyMenuCanvas) {
    destroyMenuCanvas();
    destroyMenuCanvas = null;
  }

  menuContainer.innerHTML = "";
  const visibleComponents = authenticated
    ? components.filter((component) => component.id !== AUTHENTICATION_VIEW_ID)
    : components;

  destroyMenuCanvas = await createMenuCanvas(
    menuContainer,
    visibleComponents,
    showView,
  );
}

function setAuthenticatedUI(authenticated: boolean) {
  isAuthenticated = authenticated;

  const authenticationContainer = viewContainers.get(AUTHENTICATION_VIEW_ID);
  if (authenticationContainer) {
    authenticationContainer.style.display = authenticated ? "none" : "block";
  }

  if (logoutButton) {
    logoutButton.style.display = authenticated ? "block" : "none";
  }
}

function createLogoutButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Log out";
  button.style.position = "fixed";
  button.style.top = "8px";
  button.style.right = "8px";
  button.style.padding = "8px 12px";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.background = "#37474f";
  button.style.color = "#ffffff";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.style.zIndex = "1100";
  button.style.display = "none";
  button.addEventListener("click", async () => {
    await supabase.auth.signOut();
  });
  document.body.appendChild(button);
  logoutButton = button;
}

function showView(viewId: string) {
  if (isAuthenticated && viewId === AUTHENTICATION_VIEW_ID) {
    viewId = DASHBOARD_VIEW_ID;
  }

  // Hide all views
  viewContainers.forEach((container) => {
    container.style.display = "none";
  });
  // Show the selected view
  const selectedView = viewContainers.get(viewId);
  if (selectedView) {
    selectedView.style.display = "block";
    // Update URL hash for browser history
    window.location.hash = viewId;
  }
}

(async () => {  
  createLogoutButton();

  // Create and mount the menu canvas (left side)
  menuContainer = document.createElement("div");
  menuContainer.id = MENU_CANVAS_ID;
  document.body.appendChild(menuContainer);

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

   // Create games view with standardized styling
  const gamesViewContainer = createCanvasContainer(
    mainContainer,
    GAMES_VIEW_ID,
  );

  await createGamesView(gamesViewContainer);
  
  viewContainers.set(GAMES_VIEW_ID, gamesViewContainer);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  setAuthenticatedUI(Boolean(session));
  await renderMenu(Boolean(session));

  // Show initial view
  if (session) {
    showView(DASHBOARD_VIEW_ID);
  } else {
    showView(AUTHENTICATION_VIEW_ID);
  }

  supabase.auth.onAuthStateChange((_event, sessionData) => {
    const authenticated = Boolean(sessionData);
    setAuthenticatedUI(authenticated);
    void renderMenu(authenticated);
    if (authenticated) {
      showView(DASHBOARD_VIEW_ID);
      return;
    }
    showView(AUTHENTICATION_VIEW_ID);
  });

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);
    if (viewContainers.has(hash)) {
      showView(hash);
    }
  });
})();
