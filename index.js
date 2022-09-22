const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const buffer = document.createElement("canvas");
const bufferCtx = buffer.getContext("2d");
//canvas.setAttribute("style", "transform:scale(2,2)");
//ctx.imageSmoothingEnabled = false;
const tileW = 32;
const tileH = 32;

canvas.width = window.innerWidth;
canvas.height = 32 * 26;
buffer.width = 32 * 544;
buffer.height = 32 * 24;
// const scaleX = window.innerWidth / canvas.width;
// const scaleY = window.innerHeight / canvas.height;

// const scaleToFit = Math.min(scaleX, scaleY);
// const scaleToCover = Math.max(scaleX, scaleY);

// canvas.style.transformOrigin = "0 0"; //scale from top left
// canvas.style.transform = `scale(${scaleToFit})`;
// document.querySelector("div.container").appendChild(canvas);

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

async function loadJson(url) {
  const data = await fetch(url);
  return data.json();
}

async function parseJson(url) {
  try {
    const json_data = await loadJson(url);
    return json_data;
  } catch (e) {
    console.log(e);
  }
}

const level = parseJson("./map.json").then((m) => {
  const layers = m.layers;
  const cols = m.width;
  const tileMapCols = m.tilewidth;
  // bufferCtx.fillStyle = "black";
  // bufferCtx.fillRect(0, 0, buffer.width, buffer.height);

  layers.forEach((layer) => {
    loadImage("./images/tiles32x32.png").then((img) => {
      layer.data.forEach((element, i) => {
        const col = i % cols;
        const row = parseInt(i / cols, 10);
        const tilemapX = (element - 1) % tileMapCols;
        const tileMapY = Math.floor((element - 1) / tileMapCols);

        bufferCtx.drawImage(
          img,
          tilemapX * tileW,
          tileMapY * tileH,
          tileW,
          tileH,
          col * tileW,
          row * tileH,
          tileW,
          tileH
        );
      });
    });
  });
});

class Player {
  constructor(x, y) {
    this.pos = { x: x * tileW, y: y * tileH };
    this.w = 96;
    this.h = 128;
    this.vel = { x: 0.5, y: 0 };
  }

  draw(ctx) {
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    // ctx.fillStyle = "black";
  }

  update(ctx) {
    this.pos.x -= this.vel.x;
    this.pos.y -= this.vel.y;
    this.draw(ctx);
  }
}
const player = new Player(0, 0);
function animate() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(buffer, player.pos.x, player.pos.y);
  player.update(ctx);
  window.requestAnimationFrame(animate);
}
animate();
window.level = level;
window.player = player;
window.addEventListener("keydown", (e) => {
  console.log(e.code);
});
