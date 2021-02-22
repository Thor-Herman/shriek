import Cart from "./lib/cart";
import controlsInput from "./controls-input";
import askMicrophonePermission from "./audio";
import World from "./world";
import Client from "./lib/client";

const container = document.querySelector("#app");
const root = document.querySelector("svg");
const player = document.querySelector("#player");

const world = new World(root);
const controls = controlsInput();
const car = new Cart(controls, world);
const peerClient = new Client(world, car);

let volume = 0;
askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
});

function draw() {
  car.updateByVolume(volume);
  const pos = car.getTransform();
  peerClient.sendTransform(pos);

  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
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

nickInput.addEventListener("input", (e) =>
  peerClient.sendNick(e.currentTarget.value)
);
