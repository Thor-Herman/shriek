import Cart from "./lib/cart";
import connectPeer from "./lib/client";
import World from "./lib/world";

import askMicrophonePermission from "./audio"; // step 1
import controlsInput from "./controls-input"; // step 2

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

// Tool to help you test volume
// const setTestVolume = createTestVolumeProgress();
// setTestVolume(0.5);

////////////////////////////////////////
// Step 4: Connecting to server.
////////////////////////////////////////
// const peerClient = connectPeer(() => {
//   peerClient.send({ type: "nick", payload: "Donkey" });
// });

////////////////////////////////////////
// Step 2: Drive cart
// Additional file: ./controls-input.ts
////////////////////////////////////////
// let x = 0;
// let speed = 10;
// function draw() {
//   x += volume * speed;
//   const transform = `translate(${x}, 0)`;
//   player.setAttribute("transform", transform);
// }
