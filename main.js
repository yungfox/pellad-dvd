const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const SCALE_FACTOR = 0.075
const FPS = 50
const SPEED_VALUE = 100 * (1 / FPS)

// poor man's vectors :v
const position = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }
const speed = { x: SPEED_VALUE, y: SPEED_VALUE }

let img_width = 0
let img_height = 0

console.log(SPEED_VALUE)

// taken from https://css-tricks.com/converting-color-spaces-in-javascript/
const hsl_to_hex = (h, s, l) => {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0, 
        b = 0; 
  
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
  
    return "#" + r + g + b;
}

let tint = '#ff0000'

const update_tint = () => {
    tint = hsl_to_hex(Math.floor(Math.random() * 360), 100, 50)
}

update_tint()

window.onload = () => {
    const app = document.getElementById('app')
    const ctx = app.getContext('2d')
    app.width = CANVAS_WIDTH
    app.height = CANVAS_HEIGHT
    ctx.imageSmoothingEnabled = true
    
    let image_loaded = false
    const img = new Image()
    img.src = 'pellad_trasparente.png'
    img.onload = () => {
        img_width = img.width * SCALE_FACTOR
        img_height = img.height * SCALE_FACTOR
        image_loaded = true
    }
    
    const draw = time => {
        const delta = time - previous_time
        previous_time = time
        ctx.fillStyle = '#0c0c0c'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        if (!image_loaded) {
            window.requestAnimationFrame(draw)
            return
        }

        // create back buffer
        const buffer = document.createElement('canvas');
        buffer.width = CANVAS_WIDTH;
        buffer.height = CANVAS_HEIGHT;
        buffer_ctx = buffer.getContext('2d');

        // fill back buffer with the tint color
        buffer_ctx.fillStyle = tint
        buffer_ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // draw image on top of the rectangle
        buffer_ctx.globalCompositeOperation = "destination-atop";
        buffer_ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // draw the image first
        ctx.drawImage(img, position.x, position.y, img_width, img_height);
        // overlay back buffer on top of the image
        ctx.drawImage(buffer, position.x, position.y, img_width, img_height);

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

        const frame_duration = (1000 / FPS) - delta
    
        setTimeout(() => {
            requestAnimationFrame(draw);
        }, frame_duration);
    }
    
    let previous_time = 0
    
    window.requestAnimationFrame(time => {
        previous_time = time
        window.requestAnimationFrame(draw)
    })
}
