export function createInput() {
  // Game loop
  let inputs = {
    left: false,
    right: false,
    forward: false,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      inputs.left = true;
    }
    if (e.key === "ArrowRight") {
      inputs.right = true;
    }
    if (e.key === "ArrowUp") {
      inputs.forward = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") {
      inputs.left = false;
    }
    if (e.key === "ArrowRight") {
      inputs.right = false;
    }
    if (e.key === "ArrowUp") {
      inputs.forward = false;
    }
  });

  return inputs;
}

export default createInput();
