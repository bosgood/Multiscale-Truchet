let rows;
let bounds;
let mousepos;
var highlightcheckbox;
const rowCount = 8;
const columnCount = 11;
const margin = 25;
const padding = 60;

function setup() {
  const canvasWidth = windowWidth - margin * 2;
  const canvasHeight = windowHeight - margin * 2;

  const drawableWidth = canvasWidth / 2.25;
  const drawableHeight = canvasHeight / 2.25;

  const w = drawableWidth / columnCount;
  const h = drawableHeight / rowCount;
  const ideal = Math.min(w, h);

  canvasW = ideal;
  canvasH = ideal;

  cnv = createCanvas(canvasWidth, canvasHeight);

  rows = [];
  for (let i = 0; i < rowCount; i++) {
    const row = [];
    rows.push(row);
    for (let j = 0; j < columnCount; j++) {
      const bounds = new Rectangle(
        padding / 2 + canvasW + canvasW * 2 * j,
        padding / 2 + canvasH + canvasH * 2 * i,
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

function forEachTree(f) {
  rows.forEach(row => {
    row.forEach(f);
  });
}

function draw() {
  background(rows[0][0].color[1]);
  mousepos = new point(mouseX, mouseY);
  forEachTree(t => {
    t.drawtiles();
  });

  if (highlightcheckbox.checked()) {
    forEachTree(t => {
      t.highlight(mousepos);
      t.show();
    });
  }
}

function changemotif(event) {
  mousepos = new point(mouseX, mouseY);
  forEachTree(t => {
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
  forEachTree(action);
  redraw();
}

window.oncontextmenu = function(e) {
  e.preventDefault();
};
