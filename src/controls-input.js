export default function controlsInput() {
  let controls = {
    left: 0,
    right: 0,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "a") controls.left = 1;
    if (e.key.toLowerCase() === "d") controls.right = 1;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "a") controls.left = 0;
    if (e.key.toLowerCase() === "d") controls.right = 0;
  });

  return controls;
}
