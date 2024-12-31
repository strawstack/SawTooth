import { squares } from './squares.js';
import { loadState } from './loadState.js';

export function main() {

    const { data } = squares();

    // Constants and variables
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

    // Helpers
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
        function getVerticies({x, y}, mask) {
            const { type, shape } = data(mask);
            
            const vert = [];
            if (type === "SINGLE") {
                for (const {x: xs, y: ys} of shape) {
                    vert.push({
                        x: x + xs * g.SIZE,
                        y: y + ys * g.SIZE, 
                    });
                }
            } else { // type === "LIST"
                for (const lst of shape) {
                    const vs = [];
                    for (const {x: xs, y: ys} of lst) {
                        vs.push({
                            x: x + xs * g.SIZE,
                            y: y + ys * g.SIZE, 
                        });
                    }
                    vert.push(vs);
                }
            }

            return {
                type,
                vert
            };
        }
        function drawPath(path) {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                const {x: vx, y: vy} = path[i];
                ctx.lineTo(vx, vy);
            }
            ctx.fill();
        }
        function rect(x, y, mask, width, height, fillColor, strokeColor) {
            const {type, vert} = getVerticies({x, y}, mask);
            if (vert.length > 0) {
                ctx.lineWidth = 2;
                ctx.fillStyle = fillColor;
                ctx.strokeStyle = strokeColor;
                if (type === "SINGLE") {
                    drawPath(vert);
                } else {
                    drawPath(vert[0]);
                    drawPath(vert[1]);
                }
            }
        }
        return ({x, y}, mask) => rect(x, y, mask, size, size, fillColor, strokeColor);
    }

    function getMask(state, {x, y}) {
        const get = h => {
            if (h in state.dots) {
                return state.dots[h].fill ? 1 : 0;
            } else {
                return 0;
            }
        }
        const a = get(hash({x, y}));
        const b = get(hash({x: x + g.SIZE, y}));
        const c = get(hash({x: x + g.SIZE, y: y + g.SIZE}));
        const d = get(hash({x, y: y + g.SIZE}));
        const p = (n, k) => n * Math.pow(2, k);
        const value = p(a, 3) + p(b, 2) + p(c, 1) + d;
        return value;
    }

    function drawBrush(state) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.mouse.x, state.mouse.y, state.brush_radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function hash({x, y}) {
        return JSON.stringify({x, y});
    }

    const gridDot = makeGridDot(g.DOT_SIZE, 'grey');
    const gridSq = makeGridSq(g.SIZE, 'lightgrey', 'grey');

    function mouse(e) {
        const { left, top } = canvas.getBoundingClientRect();
        return { x: e.clientX - left, y: e.clientY - top };
    }

    function togglePoint(state, value) {
        function distance(a, b) {
            return Math.sqrt(
                Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) 
            );
        }

        function pointsInRange(state) {
            const points = [];
            const { mouse } = state;
            const rp = {
                x: Math.round(mouse.x / g.SIZE) * g.SIZE, 
                y: Math.round(mouse.y / g.SIZE) * g.SIZE
            };
            const dist = (Math.ceil(state.brush_radius / g.SIZE) + 1) * g.SIZE;
            for (let y = rp.y - dist; y <= rp.y + dist; y += g.SIZE) {
                for (let x = rp.x - dist; x <= rp.x + dist; x += g.SIZE) {
                    const delta = distance({x, y}, mouse);
                    if (delta <= state.brush_radius) {
                        points.push({x, y})
                    }
                }
            }
            return points;
        }``
        const points = pointsInRange(state);
        for (const point of points) {
            const h = hash(point);
            if (h in state.dots) state.dots[h].fill = value;
        }
    }

    // State
    const _state = (() => {
        const _state = {
            mousedown: false,
            brush_radius: 32,
            mouse: {x: 0, y: 0},
            dots: {}
        };
        for (let y = 0; y <= g.HEIGHT; y += g.SIZE) {
            for (let x = 0; x <= g.WIDTH; x += g.SIZE) {
                _state.dots[hash({x, y})] = {
                    fill: true,
                    pos: {x, y}
                };
            }
        }
        return _state;
    })();

    function setState(func) {
        func(_state);
        requestAnimationFrame(() => render(_state));
    }

    // Render
    function render(state) {
        ctx.clearRect(0, 0, g.WIDTH, g.HEIGHT);

        for (const {fill, pos: {x, y}} of Object.values(state.dots)) {
            gridSq({x, y}, getMask(state, {x, y}));
        }
         
        for (const {fill, pos: {x, y}} of Object.values(state.dots)) {
            if (fill) gridDot({x, y});
        }

        drawBrush(state);
    }

    requestAnimationFrame(() => render(_state));

    // Events
    canvas.addEventListener('mousedown', e => {
        setState(state => {state.mousedown = true});
        togglePoint(_state, false);
    });
    
    canvas.addEventListener('mousemove', e => {
        setState(state => {state.mouse = mouse(e)});
        if (_state.mousedown) {
            togglePoint(_state, false);
        }
    });

    canvas.addEventListener('mouseup', e => {
        setState(state => state.mousedown = false);
    });

    canvas.addEventListener('wheel', e => {
        if (e.deltaY < 0) { // UP
            setState(state => state.brush_radius += 2);

        } else { // e.deltaY > 0 // DOWN
            setState(state => state.brush_radius -= 2);

        }
    });

    loadState({ 
        save: () => {
            return JSON.stringify({key: "example save data"})
        }, 
        load: (data) => console.log(`Loaded: ${data}`)
    });
}