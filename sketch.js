let trees;
let bounds;
let mousepos;
var highlightcheckbox;
const rowCount = 6;
const columnCount = 10;
const margin = 25;
const padding = 75;

function setup() {
  const canvasWidth = windowWidth - margin;
  const canvasHeight = windowHeight - margin * 2;

  const drawableWidth = canvasWidth - padding * 2;
  const drawableHeight = canvasHeight - padding * 3;

  const w = drawableWidth / columnCount;
  const h = drawableHeight / rowCount;
  const ideal = Math.min(w, h);

  canvasW = ideal;
  canvasH = ideal;

  cnv = createCanvas(canvasWidth, canvasHeight);

  trees = [];
  for (let i = 0; i < rowCount; i++) {
    const row = [];
    trees.push(row);
    for (let j = 0; j < columnCount; j++) {
      const bounds = new Rectangle(
        padding / 2 + canvasW + canvasW * j,
        padding / 2 + canvasH + canvasH * i,
        canvasW,
        canvasH
      );
      const tree = new QuadTree(null, bounds, 0);
      row.push(tree);
    }
  }

  mousepos = new point(mouseX, mouseY);

  highlightcheckbox = createCheckbox('Highlight Selection', true);
  highlightcheckbox.position(width / 2, height + 25);

  cnv.mouseWheel(changemotif);
}

function everyTile(f) {
  trees.forEach(row => {
    row.forEach(f);
  });
}

function draw() {
  // strokeWeight(1);
  // stroke(color(0));
  // rectMode(RADIUS);
  // rect(100, 100, 100, 100);

  background(trees[0][0].color[1]);
  mousepos = new point(mouseX, mouseY);
  everyTile(t => {
    t.drawtiles();
  });

  if (highlightcheckbox.checked()) {
    everyTile(t => {
      t.highlight(mousepos);
      t.show();
    });
  }
}

function changemotif(event) {
  mousepos = new point(mouseX, mouseY);
  everyTile(t => {
    t.scroll(event.deltaY, mousepos);
  });
}

function mouseClicked() {
  let action;
  if (mouseButton == LEFT) {
    action = t => t.split(mousepos);
  } else if (mouseButton == RIGHT) {
    action = t => t.join(mousepos);
  }
  everyTile(action);
  redraw();
}

window.oncontextmenu = function(e) {
  e.preventDefault();
};
