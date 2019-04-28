class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class QuadTree {
  constructor(parent, boundary, tier) {
    //some of this logic sucks like, it shouldnt be repeated in every child

    //idea: main frame body, with array of all descendants. each parent has pointer to its children
    //child just has
    this.parent = parent;
    this.boundary = boundary;
    this.divided = false;
    this.divisions = [];
    this.tier = tier;
    this.overbox = false;
    this.motiflist = [
      '/',
      '\\',
      '-',
      '|',
      '+.',
      'x.',
      '+',
      'fne',
      'fsw',
      'fnw',
      'fse',
      'tn',
      'ts',
      'te',
      'tw',
      ' ',
    ];

    //wingtile logic
    this.phase = this.tier % 2;
    this.selectMotif(this.tier);
    // this.selectMotif(int(random(0, this.motiflist.length)));
    this.color = [color(255), color(0)];
    this.tile = new Wingtile(this.motif, this.phase, this.boundary, this.color);

    this.edgeHover = color(0, 255, 0);
    this.fillHover = color(0, 64, 0);
    this.edgeSelected = color(255);
    this.fillSelected = color(255);
    this.edgeNeut = color(255);
    this.fillNeut = color(0);
    this.edgecol = this.edgeNeut;
    this.fillcol = this.fillNeut;
    this.discovered = false;
  }

  selectMotif(idx) {
    this.motifindex = idx % this.motiflist.length;
    this.motif = this.motiflist[this.motifindex];
  }

  changeMotif(deltaY, point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      let idx = isNaN(this.motifindex) ? 0 : this.motifindex;
      const selectIdx =
        (((idx + deltaY / abs(deltaY)) % this.motiflist.length) + this.motiflist.length) %
        this.motiflist.length;
      this.selectMotif(selectIdx);
    } else {
      for (let i = 0; i < this.divisions.length; i++) {
        if (this.divisions[i].changeMotif(deltaY, point)) {
          return true;
        }
      }
    }
  }

  divide() {
    let subtier = this.tier + 1;
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.divisions[0] = new QuadTree(this, ne, subtier);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.divisions[1] = new QuadTree(this, nw, subtier);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.divisions[2] = new QuadTree(this, se, subtier);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.divisions[3] = new QuadTree(this, sw, subtier);
    this.divided = true;
  }

  join(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      if (this.parent) {
        this.parent.divided = false;
        this.parent.divisions = [];
      }
    } else {
      for (let i = 0; i < this.divisions.length; i++) {
        if (this.divisions[i].join(point)) {
          return true;
        }
      }
    }
  }

  highlight(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      this.overbox = true;
    } else {
      for (let i = 0; i < this.divisions.length; i++) {
        if (this.divisions[i].highlight(point)) {
          return true;
        }
      }
    }
  }

  draw() {
    this.tile.motif = this.motif;
    this.tile.draw();
  }

  drawHighlight() {
    noFill();
    strokeWeight(1);
    rectMode(RADIUS);
    if (this.overbox) {
      stroke(this.edgeHover);
      rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
      this.overbox = false;
    } else {
      stroke(this.edgeNeut);
      rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    }
  }

  getDrawables() {
    if (!this.divided) {
      return [this];
    }
    return this.divisions.reduce((memo, t) => {
      return memo.concat(t.getDrawables());
    }, []);
  }

  split(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      this.divide();
    } else {
      for (let i = 0; i < this.divisions.length; i++) {
        if (this.divisions[i].split(point)) {
          return true;
        }
      }
    }
  }
}
