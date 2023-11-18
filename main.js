const CANVAS_WIDTH = 720
const CANVAS_HEIGHT = 576
const SCALE_FACTOR = 0.075
const FPS = 60
const SPEED_VALUE = 200 * (1 / FPS)
const position = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }
const speed = { x: SPEED_VALUE, y: SPEED_VALUE }

let img
let img_width
let img_height

const update_tint = () => {
    tint(Math.floor(Math.random() * 16), 16, 16)
}

function preload() {
    img = loadImage('pellad_trasparente.png')
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    colorMode(HSB, 16)
    frameRate(FPS)
    img_width = img.width * SCALE_FACTOR
    img_height = img.height * SCALE_FACTOR
    img.resize(img_width, img_height)
}

function draw() {
    background('#0c0c0c')
    image(img, position.x, position.y)
    if (position.x <= 0) {
        speed.x = SPEED_VALUE
        update_tint()
    }
    if (position.y <= 0) {
        speed.y = SPEED_VALUE
        update_tint()
    }
    if (position.x + img_width >= CANVAS_WIDTH) {
        speed.x = -SPEED_VALUE
        update_tint()
    }
    if (position.y + img_height >= CANVAS_HEIGHT) {
        speed.y = -SPEED_VALUE
        update_tint()
    }

    position.x += speed.x;
    position.y += speed.y;
}
