// Create PixiJS app (v7+ syntax, compatible with latest CDN)
const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0xffffff
});
document.getElementById("canvas-container").appendChild(app.view);

let productSprite = null;
let cushionSprite = null;

// Get DOM elements
const colorSelect = document.getElementById("color");
const materialSelect = document.getElementById("material");
const cushionSelect = document.getElementById("cushion");

function getChairImagePath() {
    const color = colorSelect.value;
    const material = materialSelect.value;
    return `assets/screwdriver/${color}-${material}.png`;
}

function getCushionImagePath() {
    if (!cushionSelect) return null;
    const cushion = cushionSelect.value;
    return `assets/cushion/${cushion}.png`;
}

async function loadProductImage() {
    const chairImagePath = getChairImagePath();
    const cushionImagePath = getCushionImagePath();

    // Remove previous sprites if exist
    if (productSprite) {
        app.stage.removeChild(productSprite);
        await PIXI.Assets.unload(chairImagePath);
        productSprite.destroy(true);
        productSprite = null;
    }
    if (cushionSprite) {
        app.stage.removeChild(cushionSprite);
        await PIXI.Assets.unload(cushionImagePath);
        cushionSprite.destroy(true);
        cushionSprite = null;
    }

    try {
        // Load chair base
        const chairTexture = await PIXI.Assets.load(chairImagePath);
        productSprite = new PIXI.Sprite(chairTexture);
        productSprite.anchor.set(0.5);
        productSprite.x = app.screen.width / 2;
        productSprite.y = app.screen.height / 2;

        // Fit chair sprite
        const maxWidth = app.screen.width * 0.9;
        const maxHeight = app.screen.height * 0.9;
        const scaleX = maxWidth / chairTexture.width;
        const scaleY = maxHeight / chairTexture.height;
        const scale = Math.min(scaleX, scaleY, 1);
        productSprite.scale.set(scale);

        app.stage.addChild(productSprite);

        // Load cushion layer if selected
        if (cushionImagePath) {
            const cushionTexture = await PIXI.Assets.load(cushionImagePath);
            cushionSprite = new PIXI.Sprite(cushionTexture);
            cushionSprite.anchor.set(0.5);
            cushionSprite.x = app.screen.width / 2;
            cushionSprite.y = app.screen.height / 2;
            cushionSprite.scale.set(scale); // Match chair scale

            app.stage.addChild(cushionSprite);
        }
    } catch (err) {
        console.error("Image failed to load:", chairImagePath, cushionImagePath, err);
    }
}

// Initial load
loadProductImage();

// Event listeners
colorSelect.addEventListener("change", loadProductImage);
materialSelect.addEventListener("change", loadProductImage);
if (cushionSelect) {
    cushionSelect.addEventListener("change", loadProductImage);
}