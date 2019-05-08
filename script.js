//Oleksii.Leunenko@gmail.com
//Тема:[FE1_Spring19] #FirstName #LastName Task-#N
//Github: ссылку
//http://bit.ly/2VPfnjJ
//deadline до 13.05 12:00
class Shape {
  constructor(halfedge) {
    this.x = 0 + halfedge;
    this.y = 0 + halfedge;
    this.color = `rgb(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`
    this.moveX = Math.random() * 10;
    this.moveY = Math.random() * 10;
    this.directionX = true;
    this.directionY = true;
    this.halfedge = halfedge;
  }
  move() {
    if (this.directionX && this.directionY) {
      this.x += this.moveX;
      this.y += this.moveY;
    } else if (!this.directionX && this.directionY) {
      this.x -= this.moveX;
      this.y += this.moveY;
    } else if (this.directionX && !this.directionY) {
      this.x += this.moveX;
      this.y -= this.moveY;
    } else if (!this.directionX && !this.directionY) {
      this.x -= this.moveX;
      this.y -= this.moveY;
    }
  }
  draw(context, index) {
    context.font = "10px Arial";
    context.shadowColor = '#FFFFFF';
    context.shadowBlur = 20;
    context.strokeText(`${index+1}, S: ${parseInt(this.getArea())}`, this.x - 25, this.y);
  }
}
class Circle extends Shape {
  constructor(radius) {
    super(radius);
    this.radius = radius;
  }
  getArea() {
    return this.radius * this.radius * Math.PI;
  }
  static incrementAmount() {
    Circle.amount++;
  }
  draw(context, index) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 *
      Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
    super.draw(context, index);

  }
  changeDirection(canvas) {
    if (this.x + this.radius >= canvas.width || this.x - this.radius < 0) {
      this.directionX = !this.directionX;
    }
    if (this.y + this.radius >= canvas.height || this.y - this.radius < 0) {
      this.directionY = !this.directionY;
    }
  }
}
Circle.amount = 0;
class Square extends Shape {
  constructor(halfedge) {
    super(halfedge);
    this.edge = halfedge * 2;
  }
  getArea() {
    return this.edge ** 2;
  }
  static incrementAmount() {
    Square.amount++;
  }

  draw(context, index) {
    context.fillStyle = this.color;
    context.fillRect(this.x - this.edge / 2, this.y - this.edge / 2, this.edge, this.edge);
    super.draw(context, index);
  }
  changeDirection(canvas) {
    if (this.x + this.edge / 2 > canvas.width || this.x - this.edge / 2 < 0) {
      this.directionX = !this.directionX;
    }
    if (this.y + this.edge / 2 > canvas.height || this.y - this.edge / 2 < 0) {
      this.directionY = !this.directionY;
    }
  }
}
Square.amount = 0;

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.shapes = [];
    this.moveInterval;
    this.newShapeInterval;
  }

  pickShape(squaresAmount, circlesAmount) {
    let minEdge = 20;
    let maxEdge = 50;
    let param = parseInt(Math.random() * (maxEdge - minEdge) + minEdge);
    if ((Math.random() > 0.5 && circlesAmount < 10) || squaresAmount === 10) {
      Circle.incrementAmount();
      return new Circle(param);
    } else if (squaresAmount < 10) {
      Square.incrementAmount();
      return new Square(param);
    }
  }

  renderField() {
    this.newShapeInterval = setInterval(() => {
      if (Circle.amount >= 10 && Square.amount >= 10) {
        clearInterval(this.newShapeInterval);
        return;
      }
      let shape = this.pickShape(Square.amount, Circle.amount);
      shape.draw(this.context);
      this.shapes.push(shape);
    }, 5000);
    this.moveShapes();
  }
  moveShapes() {
    this.moveInterval = setInterval(() => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.shapes.forEach((shape, index) => {
        shape.move();
        shape.changeDirection(this.canvas);
        shape.draw(this.context, index);
      })
    }, 20);

  }
}
let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;
let game = new Game();
game.renderField();

window.addEventListener('resize', function (e) {
  let resizeTimer;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    clearInterval(game.moveInterval);
    clearInterval(game.newShapeInterval);
    let canvas = document.getElementById("canvas");
    let oldWidth = canvas.width;
    let oldHeight = canvas.height;
    let newWidth = window.innerWidth * 0.9;
    let newHeight = window.innerHeight * 0.8;
    game.shapes.forEach((value) => {
      if (value.x + value.halfedge >= newWidth && value.x + value.halfedge < oldWidth) {
        value.x *= newWidth / oldWidth;
        while (value.x + 2 * value.halfedge >= newWidth)
          value.x -= value.moveX;
      }
      if (value.y + value.halfedge >= newHeight && value.y + value.halfedge < oldHeight) {
        value.y *= newHeight / oldHeight;
        while (value.y + 2 * value.halfedge >= newHeight)
          value.y -= value.moveY;
      }
    });
    canvas.width = newWidth;
    canvas.height = newHeight;
    game.renderField();
  }, 250)
});