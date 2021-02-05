import "./styles.css";

import input from "./input";
import Cart from "./cart";
import testInput from "./test-input";
import askMicrophonePermission from "./audio";

const container = document.querySelector("#app");
const root = document.querySelector("svg");
const player = document.querySelector("#player");

const car = new Cart(player, input);

// const volume = testInput(container);
let volume = 0;
askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
  console.log(volume);
});

function draw() {
  car.updateByVolume(volume, volume);
  car.draw();
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
