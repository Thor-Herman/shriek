import Cart from "./lib/cart";
import connectPeer from "./lib/client";
import World from "./lib/world";

import askMicrophonePermission from "./audio"; // step 1
import controlsInput from "./controls-input"; // step 2
import createTestVolumeProgress from "./lib/test-volume";

const root = document.querySelector("svg");
const player = document.querySelector("#player");

const world = new World(root);
const cart = new Cart(player, world);

// Part of step 2.
const controls = controlsInput();

////////////////////////////////////////
// Step 1: Implementing volume listener.
// Additional file: audio.ts
////////////////////////////////////////
let volume = 0;

// Tool to help you test volume
// const setTestVolume = createTestVolumeProgress();
// setTestVolume(0.5);

askMicrophonePermission((incomingVol) => {
  if (incomingVol > 0.01) volume = incomingVol;
  else volume = 0;
});

////////////////////////////////////////
// Step 3: Connecting to server.
////////////////////////////////////////
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
  if (data.type === "update-opponents") {
    world.updateOpponents(data.payload);
  }
  if (data.type === "remove-opponents") {
    world.removeOpponents(data.payload);
  }
});

////////////////////////////////////////
// Step 2: Making cart go.
////////////////////////////////////////
function draw() {
  const pos = cart.updateByVolume(
    controls.isLeftPressed,
    controls.isRightPressed,
    volume
  );
  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  player.setAttribute("transform", transform);

  // Part of step 3.
  peerClient.send({ type: "transform", payload: pos });
}

window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();
  window.requestAnimationFrame(mainLoop);
}
