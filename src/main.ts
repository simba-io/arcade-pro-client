import { createBunnyCanvas } from "./BunnyCanvas";
import { createBunnyCanvas as createOtherCanvas } from "./OtherCanvas";
import { createMenuCanvas } from "./MenuCanvas";

(async () => {
  // Create and mount the menu canvas (left side)
  const menuContainer = document.createElement("div");
  menuContainer.id = "menu-canvas-container";
  document.body.appendChild(menuContainer);
  await createMenuCanvas(menuContainer);

  // Main bunny canvas
  const container = document.getElementById("pixi-container");
  if (container) {
    await createBunnyCanvas(container);
  }

  // Add another canvas below the first one
  const otherContainer = document.createElement("div");
  otherContainer.style.marginTop = "2rem";
  otherContainer.style.width = container ? container.style.width : "600px";
  otherContainer.style.height = container ? container.style.height : "400px";
  otherContainer.id = "other-pixi-container";
  if (container && container.parentElement) {
    container.parentElement.appendChild(otherContainer);
    await createOtherCanvas(otherContainer);
  }
})();
