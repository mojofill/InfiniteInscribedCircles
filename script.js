/*
goal: 500x500 square, "infinite" max size inscribed circles that do not overlap with each other
*/

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
canvas.style.width = '' + canvas.width;
canvas.style.height = '' + canvas.height;
canvas.style.position = 'fixed';
canvas.style.margin = canvas.style.left = canvas.style.top = '0px';

const iterations = 1;

const EMPTY = 0;
const DRAWN = 1;
const pixelMap = []; // 500x500 double array pixel map, 0 for empty, 1 for drawn

const circles = [];

function pixelateCircumference(x, y, r) {
    const coords = [];
    for (let theta = 0; theta <= 2 * Math.PI; theta += 0.001) { // theta between 0 and 2PI
        const coord = {x: Math.floor(r * Math.cos(theta) + x), y: Math.floor(r * Math.sin(theta) + y)};
        coords.push(coord);
    }
    return coords;
}

function pixelate(x, y, r) {
    const coords = [];
    for (let theta = 0; theta <= 2 * Math.PI; theta += 0.001) { // theta between 0 and 2PI
        for (let t = 0; t < 1; t += 0.01) {
            const coord = {x: Math.floor(t * r * Math.cos(theta) + x), y: Math.floor(t * r * Math.sin(theta) + y)};
            coords.push(coord);
        }
    }
    return coords;
}

function init() {
    for (let y = 0; y < canvas.height; y++) {
        pixelMap.push([]);
        for (let x = 0; x < canvas.width; x++) {
            pixelMap[y].push(EMPTY);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
}

function draw() {
    // with each iteration, the size of the largest possibe circle is shrunk
    // first test with 1 iteration
    for (let i = 0; i < iterations; i++) {
        let maxR;
        let biggestCircles = [];
        // loop through each pixel on the 500x500 pixel map
        for (let y = canvas.height; y < canvas.height; y++) {
            for (let x = canvas.width; x < canvas.width; x++) {
                if (pixelMap[y][x] === DRAWN) continue; // if the pixel iterated on is already been drawn on, then i cannot have a circle here

                // radius of the circle slowly rises at a set rate
                // for now, lets make the rate 0.25

                const radiusIncreaseRate = 1;
                let currRadius = radiusIncreaseRate;
                let coords = pixelateCircumference(x, y, currRadius);

                while (true) { // ruh roh! dangerous!!!
                    let endWhile = false;
                    for (const p of coords) {
                        if (
                            p.x < 0 || p.x >= canvas.width || p.y < 0 || p.y >= canvas.height // boundary checks
                            || pixelMap[p.y][p.x] === DRAWN // circumference of circle touches another circle
                        ) {
                            endWhile = true;
                            break;
                        }
                    }
                    if (endWhile) {
                        currRadius -= radiusIncreaseRate; // roll back one
                        break;
                    }
                    else {
                        currRadius += radiusIncreaseRate;
                        coords = pixelateCircumference(x, y, currRadius);
                    }
                }

                // return;

                if (maxR === undefined) {
                    maxR = currRadius;
                    biggestCircles.push({x: x, y: y, r: currRadius});
                }
                else if (currRadius > maxR) {
                    maxR = currRadius;
                    biggestCircles = [{x: x, y: y, r: currRadius}]; // clear biggest circles and push current circle
                }
                else if (currRadius === maxR) { // direct equivalence check, might be bad
                    console.log(maxR);
                    biggestCircles.push({x: x, y: y, r: currRadius});
                }

                else continue;
            }
        }

        
        // now we should have the biggests circles in this iteration
        // draw them!

        for (const circle of biggestCircles) {
            for (const p of pixelate(circle.x, circle.y, maxR)) {
                pixelMap[p.y][p.x] = DRAWN;
            }

            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }
}

init();
