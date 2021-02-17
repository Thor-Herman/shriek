export default class World {
  constructor(rootElement) {
    this.element = rootElement;
  }

  obstacles() {
    return this.element.querySelector("#walls").children;
  }

  moveCar(car, x, y) {
    car.x = x;
    car.y = y;
  }
}
