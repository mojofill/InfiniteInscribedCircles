// task: function that returns the pixelated coordinates of the circumference of a circle

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
canvas.style.width = '' + canvas.width;
canvas.style.height = '' + canvas.height;
canvas.style.position = 'fixed';
canvas.style.margin = canvas.style.left = canvas.style.top = '0px';

function pixelate(circle) {
    const coords = [];
    for (let theta = 0; theta <= 2 * Math.PI; theta += 0.001) { // theta between 0 and 2PI
        for (let t = 1; t <= 1; t += 0.01) {
            const coord = {x: Math.floor(t * circle.r * Math.cos(theta) + circle.x), y: Math.floor(t * circle.r * Math.sin(theta) + circle.y)};
            coords.push(coord);
        }
    }
    return coords;
}

function init() {
    draw();    
}

function draw() {
    const coords = pixelate({x: canvas.width / 2, y: canvas.width / 2, r: canvas.height / 3});
    ctx.fillStyle = 'black';
    for (const p of coords) {
        ctx.fillRect(p.x-0.5, p.y-0.5, 1, 1);
    }
}

init();
