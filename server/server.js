import Peer from "peerjs";
const serverId = "test-shriek-local";
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

const goalElement = extractElementChildren(
  document.querySelector("#goal").children
);
const goalElementPos = document.querySelector("#goal").getBoundingClientRect();

function draw(pos, playerEl) {
  const transform = `translate(${pos.x}, ${pos.y}) rotate(${pos.degrees})`;
  playerEl.setAttribute("transform", transform);
}
function drawNick(pos, nickDiv) {
  const baseX = 50;
  const baseY = 30;
  nickDiv.style.left = `${baseX + pos.x}px`; //`${transform} rotate(0)`;
  nickDiv.style.top = `${baseY + pos.y}px`; //`${transform} rotate(0)`;
}

peer.on("open", function () {
  document.querySelector("#server-id").innerHTML = peer.id;
  console.log("ID: " + peer.id);
});
peer.on("error", function (err) {
  console.log(err);
});

function broadcast(message) {
  Object.values(peer.connections).forEach(function (setOfConnections) {
    setOfConnections.forEach((con) => con.send(message));
  });
}

peer.on("connection", (conn) => {
  const playerId = conn.peer;
  const playerEl = spawnPlayer(playerId);
  const playerNick = spawNickBox(playerId);

  conn.on("data", (data) => {
    switch (data.type) {
      case "transform":
        draw(data.payload, playerEl);
        drawNick(data.payload, playerNick);

        if (checkWinner(playerEl)) {
          broadcast({
            type: "winner",
            payload: playerNick.innerText ?? playerEl.getAttribute("stroke"),
          });
        }
        break;
      case "nick":
        playerNick.innerText = data.payload?.slice(0, 10);
        break;
    }
  });
  conn.on("open", () => {
    conn.send({ type: "walls", payload: wallElements });
    conn.send({ type: "goal", payload: goalElement });
  });
  conn.on("close", () => despawn(playerId));
});

const svgRoot = document.querySelector("svg");
const appRoot = document.querySelector("#app");

function spawnPlayer(playerId) {
  const playerColor = getRandomColor();
  const playerSvgEl = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  playerSvgEl.id = playerId;
  playerSvgEl.setAttribute("class", "player");

  // const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
  // textEl.setAttribute("stroke", playerColor);
  // textEl.setAttribute("x", "10");
  // textEl.textContent = playerId;

  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute("d", "M44 42.6795L74 60L44 77.3205L44 42.6795Z");
  pathEl.setAttribute("stroke", playerColor);
  pathEl.setAttribute("stroke-width", "6");

  // playerSvgEl.appendChild(textEl);
  playerSvgEl.appendChild(pathEl);

  svgRoot.appendChild(playerSvgEl);
  return playerSvgEl;
}

function checkWinner(player) {
  var playerRect = player.getBoundingClientRect();

  return !(
    goalElementPos.left > playerRect.right ||
    goalElementPos.right < playerRect.left ||
    goalElementPos.top > playerRect.bottom ||
    goalElementPos.bottom < playerRect.top
  );
}

function spawNickBox(playerId) {
  const div = document.createElement("div");
  div.className = "nick";
  div.id = `${playerId}-nick`;
  appRoot.appendChild(div);
  return div;
}

function despawn(playerId) {
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
