import Cart from "./lib/cart";
import connectPeer from "./lib/client";
import World from "./lib/world";

import askMicrophonePermission from "./audio"; // step 1
import controlsInput from "./controls-input"; // step 2
import createTestVolumeProgress from "./lib/test-volume";

const root = document.querySelector("svg");
const player = document.querySelector("#player");

if (!player || !root) {
  throw new Error("Player or root not found");
}

const world = new World(root);
const cart = new Cart(player, world);

////////////////////////////////////////
// Step 1: Implementing volume listener.
// Additional file: audio.ts
////////////////////////////////////////
let volume = 0;

const setVolume = (vol: number) => {
  volume = vol;
}

// Tool to help you test volume
// const setTestVolume = createTestVolumeProgress();
// setTestVolume(volume);
askMicrophonePermission(setVolume);

////////////////////////////////////////
// Step 4: Connecting to server.
////////////////////////////////////////
const peerClient = connectPeer(() => {
  peerClient.send({ type: "nick", payload: "T-H" });
});

peerClient.onData((data) => {
  switch (data.type) {
    case 'walls':
      return world.drawWalls(data.payload);
    case 'goal':
      return world.drawGoal(data.payload);
    case 'update-opponents':
      return world.updateOpponents(data.payload);
    case 'remove-opponents':
      return world.removeOpponents(data.payload);
    case 'winner':
      alert('Winner!!\n The winner is... ' + data.payload);
      return cart.reset();
  }
});
////////////////////////////////////////
// Step 2: Drive cart
// Additional file: ./controls-input.ts
////////////////////////////////////////

const controls = controlsInput();

function draw() {
  const cartTransform = cart.updateByVolume(controls.left, controls.right, volume);
  const transform = `translate(${cartTransform.x}, ${cartTransform.y}) rotate(${cartTransform.degrees})`;
  if (player != null) player.setAttribute("transform", transform);
  peerClient.send({ type: 'transform', payload: cartTransform });
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);