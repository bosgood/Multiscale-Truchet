let trees;
let bounds;
let mousepos;
var highlightcheckbox;
const cellCount = 2;
const margin = 75;

function setup() {
  //clunky
  canvasSize = windowHeight / 2;

  canvasSize *= 5 / 3;
  canvasW = canvasSize / 8;
  canvasH = canvasSize / 8;

  canvasX = canvasSize / 8;
  canvasY = canvasSize / 8;

  cnv = createCanvas(canvasSize, canvasSize);
  trees = [];
  for (let i = 0; i < cellCount; i++) {
    let spacer = i == 0 ? 0 : canvasW * Math.pow(2, i);
    let bounds = new Rectangle(140, 140 + spacer + margin * i, canvasW, canvasH);
    let tree = new QuadTree(null, bounds, 0);
    trees.push(tree);
  }

  mousepos = new point(mouseX, mouseY);

  highlightcheckbox = createCheckbox('Highlight Selection', false);
  highlightcheckbox.position(width / 2, height + 25);

  cnv.mouseWheel(changemotif);
}

function draw() {
  background(trees[0].color[1]);
  mousepos = new point(mouseX, mouseY);
  trees.forEach(t => {
    t.drawtiles();
  });

  if (highlightcheckbox.checked()) {
    trees.forEach(t => {
      t.highlight(mousepos);
      t.show();
    });
  }
}

function changemotif(event) {
  mousepos = new point(mouseX, mouseY);
  trees.forEach(t => {
    t.scroll(event.deltaY, mousepos);
  });
}

function mouseClicked() {
  if (mouseButton == LEFT) {
    trees.forEach(t => {
      t.split(mousepos);
    });
    redraw();
  } else if (mouseButton == RIGHT) {
    trees.forEach(t => {
      t.join(mousepos);
    });
    redraw();
  }
}

window.oncontextmenu = function(e) {
  e.preventDefault();
};
