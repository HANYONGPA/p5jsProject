function preload(){
  font = loadFont('fonts/noto.otf');
}

let font;
let fPoints;
let delaunay;
let points = [];
let vertices;
let boundary;
let mc;

let sc;
let nc;
let mag;
let net;
let p = [];
let s;
let n;

let tb;


function setup(){
  canvas = createCanvas(canvasWidth, canvasHeight);
  textAlign(CENTER, CENTER);
  textFont(font);
  frameRate(60);
  matterJs();
  Matter.use('matter-attractors');
  
  engine.gravity.y = 0;
  boundary = new Boundary();
  mc =  new mConstraints(0.001);

  tb = new TextBody(400, 400, '자');
  //tb2 = new TextBody(800, 400, '자');
  tb.connecting();

  sc = color(255, 90, 20);
  nc = color(20, 90, 255);

  //mag = new Magnet(canvasWidth/2-100, canvasHeight/2, '자');
  //net = new Magnet(canvasWidth/2+100, canvasHeight/2, '석');
  s = new Parts(100, 600, sc);
  //n = new Parts(400, 400, nc);
  
}

function draw(){
  background(255);
  //stroke(0);
  tb.display();
  //mag.display(0, color(255, 90, 40));
  //net.display(net.size/32, color(40, 90, 255));
  s.display();
  //n.display();

  mc.display(1, color(255,0,0));
}

class Magnet{
  constructor(x, y, t){
    this.size = 200
    this.txt = t;
    let b = font.textBounds(this.txt, x, y, this.size);
    this.body = new Box(b.x, b.y, b.w, b.h);
  }

  display(x, c){
    //this.body.display();
    fill(c);
    textSize(this.size);
    push();
    translate(this.body.body.position.x, this.body.body.position.y);
    rotate(this.body.body.angle);
    text(this.txt, 0+x, -this.size/5);
    pop();

  }
}

class Parts{
  constructor(x, y, c){
    this.p = [];
    this.c = c;
    
    for(let i = 0; i < 1000; i++){
      this.p.push(new Box(x+random(-x, x), y+random(-y, y), 10, 10));
    }
  }

  display(){
    fill(this.c);
    for(let i = 0; i < this.p.length; i++){
      this.p[i].display();
    }
    if(mouseIsPressed){
      //this.forcing();
    }
  }

  forcing(){
    for(let i = 0; i < this.p.length; i++){
      let pos1 = createVector(this.p[i].body.position.x, this.p[i].body.position.y)
      let f = p5.Vector.sub(createVector(mouseX, mouseY), pos1);
      f.normalize();
      f.mult(0.0001);
      Body.applyForce(this.p[i].body, 0, f);
    }
  }
}

class TextBody{
  constructor(x, y, t){
    this.cg = createGraphics(canvasWidth, canvasHeight);
    this.cg.background(255);
    this.cg.textAlign(CENTER, CENTER);
    this.cg.textFont(font);
    this.cg.textSize(300);
    this.cg.text(t, x, y);
    this.span = 12;
    this.b = [];
    let option = { isStatic : true,
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6*0.002,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6*0.002,
            };
          }
        ]
      }
    }
    for(let x = 0; x < canvasWidth; x+=this.span){
      for(let y = 0; y < canvasHeight; y+=this.span){
        let c = this.cg.get(x, y);
        if(c[0] < 255){
          this.b.push(new Box(x, y, 12, 12, option));
        }
      }
    }
    for(let i = 0; i < this.b.length; i++){
      this.b[i].body.collisionFilter = {
        'group': -1,
        'category': 1,
        'mask': 1
      };
    }
  }

  connecting(){
    for(let i = 0; i < this.b.length; i++){
      for(let i2 = 0; i2 < tb.b.length; i2++){
        let pos1 = createVector(this.b[i].body.position.x, this.b[i].body.position.y);
        let pos2 = createVector(tb.b[i2].body.position.x, tb.b[i2].body.position.y);
        let d = p5.Vector.dist(pos1, pos2);
        if(d < 60){
          cConstraint(this.b[i].body, tb.b[i2].body, 0, 0, 0.1);
        }
      }
    }
  }

  display(){
    fill(0);
    textSize(300);
    //text('자', this.b[100].body.position.x+160, this.b[100].body.position.y-95);
    for(let i = 0; i < this.b.length; i++){
     this.b[i].display();
      this.b[i].body.angle = 0;
    }
  }
}