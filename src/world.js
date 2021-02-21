export default class World {
  constructor(rootElement) {
    this.element = rootElement;
  }

  get walls() {
    return this.element.querySelector("#walls");
  }

  get goal() {
    return this.element.querySelector("#goal");
  }

  obstacles() {
    return this.walls.children;
  }

  drawWalls(nodes) {
    if (this.walls.children.length === 0) {
      nodes.forEach((n) => {
        const svgEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          n.nodeName
        );
        n.attributes.forEach((a) => {
          svgEl.setAttribute(a.name, a.value);
        });

        this.walls.appendChild(svgEl);
      });
    }
  }

  drawGoal(nodes) {
    if (this.goal.children.length === 0) {
      nodes.forEach((n) => {
        const svgEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          n.nodeName
        );
        n.attributes.forEach((a) => {
          svgEl.setAttribute(a.name, a.value);
        });

        this.goal.appendChild(svgEl);
      });
    }
  }
}
