import { createSplashView, SPLASH_VIEW_ID } from "./SplashView";
import { createBioView, BIO_VIEW_ID } from "./BioView";
import { createMenuCanvas, MENU_CANVAS_ID } from "./MenuCanvas";
import { createContactView, CONTACT_VIEW_ID } from "./ContactView";
import { createCanvasContainer } from "./CanvasUtils";
import { createUserPanelCanvas, USER_PANEL_CANVAS_ID } from "./UserPanelCanvas";

const components = [
  { label: "Splash", id: SPLASH_VIEW_ID },
  { label: "Bio", id: BIO_VIEW_ID },
  { label: "Contact", id: CONTACT_VIEW_ID }
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

  // Create and mount the user panel canvas (right side)
  const userPanelContainer = document.createElement("div");
  userPanelContainer.id = USER_PANEL_CANVAS_ID;
  document.body.appendChild(userPanelContainer);
  await createUserPanelCanvas(userPanelContainer);

  // Create all canvases using standardized container creation
  const mainContainer = document.body;

  // Create splash view with standardized styling
  const splashContainer = createCanvasContainer(mainContainer, SPLASH_VIEW_ID);
  await createSplashView(splashContainer);
  viewContainers.set(SPLASH_VIEW_ID, splashContainer);

  // Create bio view with standardized styling
  const bioContainer = createCanvasContainer(mainContainer, BIO_VIEW_ID);
  await createBioView(bioContainer);
  viewContainers.set(BIO_VIEW_ID, bioContainer);

  // Create contact view with standardized styling
  const contactContainer = createCanvasContainer(
    mainContainer,
    CONTACT_VIEW_ID,
  );
  await createContactView(contactContainer);
  viewContainers.set(CONTACT_VIEW_ID, contactContainer);

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
