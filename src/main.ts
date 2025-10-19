import { createBunnyCanvas, BUNNY_CANVAS_ID } from "./BunnyCanvas";
import { createBunnyCanvas as createOtherCanvas, OTHER_CANVAS_ID } from "./OtherCanvas";
import { createMenuCanvas, MENU_CANVAS_ID } from "./MenuCanvas";
import { createBunnyCanvas as createAnotherCanvas, ANOTHER_CANVAS_ID } from "./AnotherCanvas";

const components = [
  { label: "Bunny", id: BUNNY_CANVAS_ID },
  { label: "Other", id: OTHER_CANVAS_ID },
  { label: "Another", id: ANOTHER_CANVAS_ID }
];

(async () => {
  // Create and mount the menu canvas (left side)
  const menuContainer = document.createElement("div");
  menuContainer.id = MENU_CANVAS_ID;
  document.body.appendChild(menuContainer);
  await createMenuCanvas(menuContainer, components);

  // Main bunny canvas
  const container = document.getElementById(BUNNY_CANVAS_ID);
  if (container) {
    await createBunnyCanvas(container);
  }

  // Add another canvas below the first one
  const otherContainer = document.createElement("div");
  otherContainer.style.marginTop = "2rem";
  otherContainer.style.width = container ? container.style.width : "600px";
  otherContainer.style.height = container ? container.style.height : "400px";
  otherContainer.id = OTHER_CANVAS_ID;
  if (container && container.parentElement) {
    container.parentElement.appendChild(otherContainer);
    await createOtherCanvas(otherContainer);
  }

  // Add the third canvas below the second one
  const anotherContainer = document.createElement("div");
  anotherContainer.style.marginTop = "2rem";
  anotherContainer.style.width = container ? container.style.width : "600px";
  anotherContainer.style.height = container ? container.style.height : "400px";
  anotherContainer.id = ANOTHER_CANVAS_ID;
  if (otherContainer && otherContainer.parentElement) {
    otherContainer.parentElement.appendChild(anotherContainer);
    await createAnotherCanvas(anotherContainer);
  }
})();
