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

    try {
        // Preload new textures first
        const chairTexture = await PIXI.Assets.load(chairImagePath);
        let cushionTexture = null;
        if (cushionImagePath) {
            cushionTexture = await PIXI.Assets.load(cushionImagePath);
        }

        // Create new sprites but don't add them yet
        const newChairSprite = new PIXI.Sprite(chairTexture);
        newChairSprite.anchor.set(0.5);
        newChairSprite.x = app.screen.width / 2;
        newChairSprite.y = app.screen.height / 2;

        // Fit chair sprite
        const maxWidth = app.screen.width * 0.9;
        const maxHeight = app.screen.height * 0.9;
        const scaleX = maxWidth / chairTexture.width;
        const scaleY = maxHeight / chairTexture.height;
        const scale = Math.min(scaleX, scaleY, 1);
        newChairSprite.scale.set(scale);
        newChairSprite.alpha = 0; // Start invisible

        // Create new cushion sprite if needed
        let newCushionSprite = null;
        if (cushionTexture) {
            newCushionSprite = new PIXI.Sprite(cushionTexture);
            newCushionSprite.anchor.set(0.5);
            newCushionSprite.x = app.screen.width / 2;
            newCushionSprite.y = app.screen.height / 2;
            newCushionSprite.scale.set(scale);
            newCushionSprite.alpha = 0;
        }

        // Add new sprites
        app.stage.addChild(newChairSprite);
        if (newCushionSprite) {
            app.stage.addChild(newCushionSprite);
        }

        // Fade in new sprites
        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.1;
            newChairSprite.alpha = alpha;
            if (newCushionSprite) newCushionSprite.alpha = alpha;

            if (alpha >= 1) {
                // Remove old sprites after fade in
                if (productSprite) {
                    app.stage.removeChild(productSprite);
                    productSprite.destroy(true);
                }
                if (cushionSprite) {
                    app.stage.removeChild(cushionSprite);
                    cushionSprite.destroy(true);
                }
                // Update references
                productSprite = newChairSprite;
                cushionSprite = newCushionSprite;
                app.ticker.remove(fadeIn);
            }
        };

        app.ticker.add(fadeIn);

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