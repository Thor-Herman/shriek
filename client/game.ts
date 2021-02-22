import Cart, { TransformData } from "./lib/cart";
import controlsInput from "./controls-input";
import askMicrophonePermission from "./audio";
import World from "./world";
import connectPeer from "./lib/client";

const root = document.querySelector("svg");
const player = document.querySelector("#player");

const world = new World(root);
const controls = controlsInput();
const cart = new Cart(player, world);

let volume = 0;
askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
});

const peerClient = connectPeer(() => {
  peerClient.send({ type: "nick", payload: "Donkey" });
});
peerClient.onData(function (data) {
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

function draw() {
  const pos = cart.updateByVolume(
    controls.isLeftPressed,
    controls.isRightPressed,
    volume
  );

  peerClient.send({ type: "transform", payload: pos });

  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  player.setAttribute("transform", transform);
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
