import Cart from "./lib/cart";
import controlsInput from "./controls-input";
import askMicrophonePermission from "./audio";
import World from "./world";
import connectPeer from "./lib/client";

const root = document.querySelector("svg");
const player = document.querySelector("#player");

const world = new World(root);
const controls = controlsInput();
const cart = new Cart(controls, world);

const peerClient = connectPeer(() => {
  peerClient.send({ type: "nick", payload: "Donkey" });
});

let volume = 0;
askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
});

peerClient.onData(function (data) {
  console.log("on data");
  if (data.type === "walls") {
    world.drawWalls(data.payload);
  }
  if (data.type === "goal") {
    world.drawGoal(data.payload);
  }
  if (data.type === "winner") {
    alert("Winner!!\n The winner is... " + data.payload);
    cart.reset();
  }
});

function sendTransform(transform) {
  peerClient.send({ type: "transform", payload: transform });
}

function sendNick(nick) {
  peerClient.send({ type: "nick", payload: nick });
}

function draw() {
  cart.updateByVolume(volume);
  const pos = cart.getTransform();
  sendTransform(pos);

  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  player.setAttribute("transform", transform);

  if (cart.checkCollision(player)) {
    cart.trackBounce();
    cart.checkStandStillAndReset();
  }
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
