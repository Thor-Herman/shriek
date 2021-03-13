import Peer from "peerjs";
import {
  CustomAttributes,
  CustomElement,
  RecieveDataPayload,
  SendDataPayload,
  TransformData,
} from "../types";
const serverId = "test-shriek-local";
const peer = new Peer(serverId, {
  host: "shrieek-peerjs.herokuapp.com",
  port: 443,
  secure: true,
  debug: 2,
});

const UPDATE_RATE_MULTIPLAYER_IN_MS = 200;

const wallElements = extractElementChildren(
  document.querySelector("#walls")?.children
);
const goalElement = extractElementChildren(
  document.querySelector("#goal")?.children
);
const getOpponents = () =>
  extractElementChildren(document.querySelectorAll(".player"));
const goalElementPos = document.querySelector("#goal")?.getBoundingClientRect();

function updateMultiplayer() {
  const opponents = getOpponents();
  // broadcast({ type: "update-opponents", payload:  });

  Object.entries(peer.connections).forEach(
    ([key, setOfConnections]: [string, any]) => {
      setOfConnections.forEach((con: Peer.DataConnection) => {
        const filteredOpponents = opponents.filter(
          (node) => !getAttribute<string>(node, "id")?.includes(key)
        );
        send(con, { type: "update-opponents", payload: filteredOpponents });
      });
    }
  );
}
setInterval(updateMultiplayer, UPDATE_RATE_MULTIPLAYER_IN_MS);

function draw(pos: TransformData, playerEl: Element) {
  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  playerEl.setAttribute("transform", transform);
}
function drawNick(pos: TransformData, nickDiv: HTMLElement) {
  const baseX = 50;
  const baseY = 80;
  nickDiv.style.left = `${baseX + pos.x}px`; //`${transform} rotate(0)`;
  nickDiv.style.top = `${baseY + pos.y}px`; //`${transform} rotate(0)`;
}

const serverIdOutput = document.querySelector("#server-id");
peer.on("open", function () {
  if (serverIdOutput) {
    serverIdOutput.innerHTML = peer.id;
  }
  console.log("ID: " + peer.id);
});
peer.on("error", function (err) {
  console.log(err);
});

function send(conn: Peer.DataConnection, message: RecieveDataPayload) {
  return conn.send(message);
}
function broadcast(message: RecieveDataPayload) {
  Object.values(peer.connections).forEach((setOfConnections: any) => {
    setOfConnections.forEach((con: Peer.DataConnection) => send(con, message));
  });
}

peer.on("connection", (conn) => {
  const playerId = conn.peer;
  const playerEl = spawnPlayer(playerId);
  const playerNick = spawNickBox(playerId);

  conn.on("data", (data: SendDataPayload) => {
    switch (data.type) {
      case "transform":
        draw(data.payload, playerEl);
        drawNick(data.payload, playerNick);

        if (checkWinner(playerEl)) {
          broadcast({
            type: "winner",
            payload: playerNick.innerText,
          });
        }
        break;
      case "nick":
        playerNick.innerText = data.payload?.slice(0, 10);
        break;
    }
  });
  conn.on("open", () => {
    send(conn, { type: "walls", payload: wallElements });
    send(conn, { type: "goal", payload: goalElement });
  });
  conn.on("close", () => {
    despawn(playerId);
    send(conn, { type: "remove-opponents", payload: playerId });
  });
});

const svgRoot = document.querySelector("svg");
const appRoot = document.querySelector("#app");

function spawnPlayer(playerId: string) {
  const playerColor = getRandomColor();
  // const playerSvgEl = document.createElementNS(
  //   "http://www.w3.org/2000/svg",
  //   "g"
  // );
  // playerSvgEl.id = playerId;
  // playerSvgEl.classList.add("player");
  // playerSvgEl.setAttribute("data-color", playerColor);

  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute(
    "d",
    "M94.5842 127.732L97.8498 108.513C98.1642 107.589 97.9262 107.034 97.6726 106.667C97.0229 105.729 95.6872 105.72 95.4283 105.72L61.0185 106.713L59.0736 107.118C59.0736 107.118 58.0644 106 56.5444 106L53.5929 107C52.5611 107 52 107.495 52 108.483V109.135C52 110.091 52.5593 110.34 53.6294 110.34L57.0315 109.34L58.7468 112.83L61.462 132.319C60.4406 133.428 59.8848 135.044 59.8848 136.552C59.8848 139.87 62.4626 142.929 65.756 142.929C68.8653 142.929 71.1965 139.943 71.5751 138.163H84.0993C84.478 139.943 86.3661 143 89.9167 143C93.1528 143 95.7844 140.127 95.7844 136.814C95.7844 133.519 93.8302 130.598 89.9497 130.598C88.3359 130.598 86.4217 131.488 85.5323 132.823H70.1438C69.0269 131.043 67.5018 130.491 65.9593 130.429L65.7456 129.263H92.1593C93.9242 129.263 94.2716 128.604 94.5842 127.732Z"
  );
  pathEl.setAttribute("fill", playerColor);
  pathEl.id = playerId;
  pathEl.classList.add("player");

  // playerSvgEl.appendChild(pathEl);
  svgRoot?.appendChild(pathEl);
  return pathEl;
}

function checkWinner(player: Element) {
  var playerRect = player.getBoundingClientRect();
  if (!goalElementPos) return false;

  return !(
    goalElementPos.left > playerRect.right ||
    goalElementPos.right < playerRect.left ||
    goalElementPos.top > playerRect.bottom ||
    goalElementPos.bottom < playerRect.top
  );
}

function spawNickBox(playerId: string) {
  const div = document.createElement("div");
  div.className = "nick";
  div.id = `${playerId}-nick`;
  appRoot?.appendChild(div);
  return div;
}

function despawn(playerId: string) {
  const el = document.querySelector(`#${playerId}`);
  if (el) el.remove();
  const nick = document.querySelector(`#${playerId}-nick`);
  if (nick) nick.remove();
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function extractAttributes(attributes: NamedNodeMap): CustomAttributes[] {
  const map = [];
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i);
    if (!attr) continue;
    map.push({ name: attr.name, value: attr.value });
  }
  return map;
}

function extractElementChildren(
  children?: HTMLCollection | NodeListOf<Element>
): CustomElement[] {
  const map: CustomElement[] = [];
  if (!children) return map;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (!child) continue;
    map.push({
      nodeName: child.nodeName,
      attributes: extractAttributes(child.attributes),
    });
  }
  return map;
}

function getAttribute<T>(node: CustomElement, name: string): T | undefined {
  for (let attr of node.attributes) {
    if (attr.name === name) return attr.value as T;
  }
  return undefined;
}
