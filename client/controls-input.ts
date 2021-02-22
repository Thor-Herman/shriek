////////////////////////////////////////
// Step 2: Making input controller modules.
////////////////////////////////////////
export default function controlsInput() {
  let controls = {
    isLeftPressed: false,
    isRightPressed: false,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "a") controls.isLeftPressed = true;
    if (e.key.toLowerCase() === "d") controls.isRightPressed = true;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "a") controls.isLeftPressed = false;
    if (e.key.toLowerCase() === "d") controls.isRightPressed = false;
  });

  return controls;
}
