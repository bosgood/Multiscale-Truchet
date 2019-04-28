let rows;
let bounds;
let mousepos;
var highlightcheckbox;
const rowCount = 8;
const columnCount = 15;
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

  cnv.mouseWheel(changeMotif);
}

function draw() {
  background(rows[0][0].color[1]);
  mousepos = new point(mouseX, mouseY);

  const drawables = getDrawables();
  drawables.forEach(d => d.draw());

  if (highlightcheckbox.checked()) {
    drawables.forEach(d => {
      d.drawHighlight();
    });
    getMatching(mousepos).forEach(d => {
      d.highlight();
      d.drawHighlight();
    });
  }
}

function getDrawables() {
  let drawables = [];
  rows.forEach(row => {
    row.forEach(col => {
      drawables = drawables.concat(col.getDrawables());
    });
  });
  drawables.sort((a, b) => a.tier - b.tier);
  return drawables;
}

function getMatching(mousepos) {
  return getDrawables().filter(d => {
    return d.contains(mousepos);
  });
}

function changeMotif(event) {
  mousepos = new point(mouseX, mouseY);
  getMatching(mousepos).forEach(t => t.changeMotif(event.deltaY, mousepos));
}

function mouseClicked() {
  let action;
  if (mouseButton == LEFT) {
    action = t => t.split();
  } else if (mouseButton == RIGHT) {
    action = t => t.join();
  }
  getMatching(mousepos).forEach(action);
  redraw();
}

window.oncontextmenu = function(e) {
  e.preventDefault();
};
