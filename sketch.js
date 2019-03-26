let qtree;
let bounds;
let mousepos;



function setup() {
  canvasSize = 800;
  canvasW = canvasSize/2;
  canvasH = canvasSize/2;
  canvasX = canvasSize/2;
  canvasY = canvasSize/2;

  createCanvas(canvasSize, canvasSize);
  background(255);
  let bounds = new Rectangle (canvasX, canvasY, canvasW, canvasH);
  qtree = new QuadTree(bounds, 1);

  mousepos = new point(mouseX,mouseY);
}

function draw() {
  mousepos = new point(mouseX,mouseY);
  qtree.highlight(mousepos);
  background(0);
  qtree.show();

}

function mouseClicked(){
  qtree.split(mousepos);
  redraw();
}