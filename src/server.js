import Peer from "peerjs";
import { serverId } from "./shared";
const peer = new Peer(serverId, { debug: 2 });

function extractAttributes(attributes) {
  const map = [];
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i);
    map.push({ name: attr.name, value: attr.value });
  }
  return map;
}

function extractElementChildren(children) {
  const map = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    map.push({
      nodeName: child.nodeName,
      attributes: extractAttributes(child.attributes),
    });
  }
  return map;
}

const wallElements = extractElementChildren(
  document.querySelector("#walls").children
);

function draw(transform, playerEl) {
  playerEl.setAttribute("transform", transform);
}

peer.on("open", function () {
  document.querySelector("#server-id").innerHTML = peer.id;
  console.log("ID: " + peer.id);
});
peer.on("error", function (err) {
  console.log(err);
});

peer.on("connection", (conn) => {
  const playerId = conn.peer;
  const playerEl = instantiatePlayer(playerId);
  conn.on("data", (transform) => {
    draw(transform, playerEl);
  });
  conn.on("open", () => {
    conn.send(wallElements);
  });
});

const svgRoot = document.querySelector("svg");

function instantiatePlayer(playerId) {
  const playerSvgEl = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  playerSvgEl.id = playerId;
  playerSvgEl.setAttribute("class", "player");

  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute("d", "M44 42.6795L74 60L44 77.3205L44 42.6795Z");
  pathEl.setAttribute("stroke", getRandomColor());
  pathEl.setAttribute("stroke-width", "6");

  playerSvgEl.appendChild(pathEl);

  svgRoot.appendChild(playerSvgEl);
  return playerSvgEl;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
