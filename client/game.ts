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
// Step 4: Connecting to server.
////////////////////////////////////////
const peerClient = connectPeer(() => {
  peerClient.send({ type: "nick", payload: "Donkey" });
});
peerClient.onData((data) => {
  switch (data.type) {
    case "walls":
      return world.drawWalls(data.payload);
    case "goal":
      return world.drawGoal(data.payload);
    case "update-opponents":
      return world.updateOpponents(data.payload);
    case "remove-opponents":
      return world.removeOpponents(data.payload);
    case "winner":
      alert("Winner!!\n The winner is... " + data.payload);
      return cart.reset();
  }
});

////////////////////////////////////////
// Step 2: Making cart go forward
////////////////////////////////////////
// let x = 0;
// let speed = 10;
// function draw() {
//   x += volume * speed;
//   const transform = `translate(${x}, 0)`;
//   player.setAttribute("transform", transform);
// }

////////////////////////////////////////
// Step 3: Driving cart
////////////////////////////////////////
function draw() {
  const pos = cart.updateByVolume(
    controls.isLeftPressed,
    controls.isRightPressed,
    volume
  );
  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  player!.setAttribute("transform", transform);

  // Part of step 3.
  peerClient.send({ type: "transform", payload: pos });
}

let raf: number = 0;
window.requestAnimationFrame(mainLoop);
function mainLoop() {
  draw();

  cancelAnimationFrame(raf);
  raf = window.requestAnimationFrame(mainLoop);
}
