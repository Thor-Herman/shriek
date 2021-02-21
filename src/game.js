import Cart from "./cart";
import controlsInput from "./controls-input";
import askMicrophonePermission from "./audio";
import World from "./world";
import Client from "./client";

const container = document.querySelector("#app");
const root = document.querySelector("svg");
const player = document.querySelector("#player");

const world = new World(root);
const peerClient = new Client(world);
const controls = controlsInput();
const car = new Cart(controls, world);

let volume = 0;
askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
});

function draw() {
  car.updateByVolume(volume);
  const transform = car.getTransform();

  // Update states
  peerClient.sendTransform(transform);
  player.setAttribute("transform", transform);

  if (car.checkCollision(player)) {
    car.trackBounce();
    car.checkStandStillAndReset();
  }
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}

const nickInput = document.querySelector("#nickInput");
