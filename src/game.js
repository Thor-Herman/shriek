import "./styles.css";

import input from "./input";
import Cart from "./cart";
import testInput from "./test-input";
import askMicrophonePermission from "./audio";

const container = document.querySelector("#app");
const root = document.querySelector("svg");
const player = document.querySelector("#player");

const car = new Cart(player, input);

const volume = testInput(container);
// askMicrophonePermission((incomingVol) => {
//   volume = incomingVol * 0.5;
// });

function draw() {
  car.updateByVolume(volume.left, volume.right);
  car.draw();
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
