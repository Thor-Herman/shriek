function slider(name, cb) {
  const input = document.createElement("input");
  input.setAttribute("type", "range");
  input.setAttribute("min", 0);
  input.setAttribute("max", 100);
  input.value = 0;
  input.addEventListener("input", function (e) {
    cb(e.currentTarget.value / 100);
  });

  const text = document.createTextNode(name);
  const label = document.createElement("label");

  label.appendChild(text);
  label.appendChild(input);
  return label;
}

function testInputWrapper(container, cbLeft, cbRight) {
  const left = slider("left", cbLeft);
  const right = slider("right", cbRight);

  const wrapper = document.createElement("div");

  wrapper.appendChild(left);
  wrapper.appendChild(right);
  container.appendChild(wrapper);
}

export default function test(container) {
  let testInput = {
    left: 0,
    right: 0,
  };

  testInputWrapper(
    container,
    (db) => {
      testInput.left = db;
    },
    (db) => {
      testInput.right = db;
    }
  );

  return testInput;
}
