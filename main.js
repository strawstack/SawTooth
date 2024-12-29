function main() {

    const g = {};
    g.DOT_SIZE= 6;
    g.SIZE = 32;
    g.WIDTH = 37 * g.SIZE;
    g.HEIGHT = 23 * g.SIZE;

    const qs = s => document.querySelector(s);
    const canvas = qs("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = g.WIDTH;
    canvas.height = g.HEIGHT;
    canvas.style.width = `${g.WIDTH}px`;
    canvas.style.height = `${g.HEIGHT}px`;

    function makeGridDot(size, color) {
        function dot(x, y, size, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
        return ({x, y}) => dot(x, y, size, color);
    }

    function makeGridSq(size, fillColor, strokeColor) {
        function rect(x, y, width, height, fillColor, strokeColor) {
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
        return ({x, y}) => rect(x, y, size, size, fillColor, strokeColor);
    }

    const gridDot = makeGridDot(g.DOT_SIZE, 'grey');
    const gridSq = makeGridSq(g.SIZE, 'lightgrey', 'grey');

    for (let y = 0; y <= g.HEIGHT; y += g.SIZE) {
        for (let x = 0; x <= g.WIDTH; x += g.SIZE) {
            gridSq({x, y});
        }   
    }

    for (let y = 0; y <= g.HEIGHT; y += g.SIZE) {
        for (let x = 0; x <= g.WIDTH; x += g.SIZE) {
            gridDot({x, y});
        }   
    }

}