export default function controlsInput() {
  let controls = {
    left: 0,
    right: 0,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "a") controls.left = 1;
    if (e.key === "d") controls.right = 1;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "a") controls.left = 0;
    if (e.key === "d") controls.right = 0;
  });

  return controls;
}
