import "./styles.css";

import input from "./input";
import Cart from "./cart";

const root = document.querySelector("svg");
const player = document.querySelector("#player");

const car = new Cart(player, input);

function draw() {
  car.update(root.clientWidth, root.clientHeight);
  car.draw();
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
