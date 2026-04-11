import { BIO_VIEW_ID, createBioView } from "./BioView.ts";
import { createCanvasContainer } from "./CanvasUtils.ts";
import { CONTACT_VIEW_ID, createContactView } from "./ContactView.ts";
import { MENU_CANVAS_ID, createMenuCanvas } from "./MenuCanvas.ts";
import { SPLASH_VIEW_ID, createSplashView } from "./SplashView.ts";



const components = [
  { label: "Splash", id: SPLASH_VIEW_ID },
  { label: "Bio", id: BIO_VIEW_ID },
  { label: "Contact", id: CONTACT_VIEW_ID }
];

(async () => {
  // Create and mount the menu canvas (left side)
  const menuContainer = document.createElement("div");
  menuContainer.id = MENU_CANVAS_ID;
  document.body.appendChild(menuContainer);
  await createMenuCanvas(menuContainer, components);

  // Create all canvases using standardized container creation
  const mainContainer = document.body;

  // Create splash view with standardized styling
  const splashContainer = createCanvasContainer(mainContainer, SPLASH_VIEW_ID);
  await createSplashView(splashContainer);

  // Create bio view with standardized styling
  const bioContainer = createCanvasContainer(mainContainer, BIO_VIEW_ID);
  await createBioView(bioContainer);

  // Create contact view with standardized styling
  const contactContainer = createCanvasContainer(
    mainContainer,
    CONTACT_VIEW_ID,
  );
  await createContactView(contactContainer);
})();