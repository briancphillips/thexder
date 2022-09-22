const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//canvas.setAttribute("style", "transform:scale(2,2)");
//ctx.imageSmoothingEnabled = false;
const tileW = 32;
const tileH = 32;

canvas.width = 6000;
canvas.height = 32 * 26;

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
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  layers.forEach((layer) => {
    loadImage("./images/tiles32x32.png").then((img) => {
      layer.data.forEach((element, i) => {
        const col = i % cols;
        const row = parseInt(i / cols, 10);
        const tilemapX = (element - 1) % tileMapCols;
        const tileMapY = Math.floor((element - 1) / tileMapCols);

        ctx.drawImage(
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

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - tileH * 3, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);
}
animate();
window.level = level;
