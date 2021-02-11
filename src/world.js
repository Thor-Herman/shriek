export default class World {
  constructor(rootElement) {
    this.element = rootElement;
  }

  moveCar(car, x, y) {
    if (x < 763 && x > 0) car.x = x;
    if (y < 250 && y > -250) car.y = y;
  }
}
