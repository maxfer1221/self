const canvas = document.querySelector("canvas");
const c      = canvas.getContext("2d");
const overlay = document.getElementById("canvas-overlay");
const c2 = overlay.getContext("2d");

const initCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
}

// noise width/height
const nw = canvas.width;
// const nw = 600;
const nh = canvas.height;
// const nh = 300;

const zoom = 100;
const speed = 1;

const flow = Array.from({ length: nw }, () => {
    return Array.from({ length: nh }, () => 0);
});
const initNoise = () => {
    noise.seed(Math.random());
    for (let x = 0; x < nw; x++) {
        for (let y = 0; y < nh; y++) {
            const dx  = noise.simplex3(x / zoom, y / zoom, 0);
            const dy  = noise.simplex3(x / zoom, y / zoom, 20)

            tx = dx * speed;
            ty = dy * speed;

            flow[x][y] = { x: tx, y: ty };
        }
    }
}

// const pw = Math.min(Math.floor(window.innerWidth / 15), 60);
// const ph = Math.min(Math.floor(window.innerHeight / 15), 30);
// const ratio = window.innerWidth / window.innerHeight;
// const qual = 50;
// const pw = Math.floor(qual * ratio);
// const ph = Math.floor(qual / ratio);

const colors = [
    "#FF4800",
    "#FF6D00",
    "#FF8500",
    "#FF9E00",
    "#FFB600",
]

function hexToRgbA(hex, op){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + op + ')';
    }
    throw new Error('Bad Hex');
}

const pc = 2500;
let points = [];
const initPoints = () => {
    points = Array.from({ length: pc }, () => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const col = colors[Math.floor(Math.random() * colors.length)];
        const c = hexToRgbA(col, '0.03');
        return {
            prev: { x, y }, x, y, c
        }
    })
}

const reset = () => {
    initCanvas();
    initNoise();
    initPoints();
//    c.fillStyle = "#000";
//    c.fillRect(0,0,window.innerWidth,window.innerHeight);
};

window.onresize = reset;

reset();

function animate() {

    for (let k = 0; k < points.length; k++) {
        let p = points[k];

        c.beginPath();
        c.strokeStyle = p.c;
       
        if (p.x < 0) {
            p.x = window.innerWidth + 1;
            p.prev = { x: window.innerWidth + 1, y: window.innerHeight - p.y };
        }
        else if (p.x >= window.innerWidth) {
            p.x = -1;
            p.prev = { x: -1, y: window.innerHeight - p.y };
        }
        if (p.y < 0) {
            p.y = window.innerHeight + 1;
            p.prev = { x: window.innerWidth - p.x, y: window.innerHeight + 1 };
        }
        else if (p.y >= window.innerHeight) {
            p.y = -1;
            p.prev = { x: window.innerWidth - p.x, y: -1 };
        }
        
        const i = Math.floor(nw * Math.max(Math.min(p.x, window.innerWidth - 1),0) / window.innerWidth);
        const j = Math.floor(nh * Math.max(Math.min(p.y, window.innerHeight- 1),0) / window.innerHeight);

        const v = flow[i][j];
        
        c.moveTo(p.prev.x, p.prev.y);

        p.prev = { x: p.x, y: p.y };
        
        p.x += v.x;
        p.y += v.y;

        c.lineTo(p.x, p.y);
        c.stroke();
    }

    requestAnimationFrame(animate);
}


c_colors = [
    //"#1d3557",
    //"#457b9d",
    //"#a8dadc",
    //"#f1faee",
    //"#e63946",
    "#ffffff",
]

const mouse = { x: -200, y: -200 };

window.addEventListener('mousemove', (e) => {
    c2.clearRect(0, 0, window.innerWidth, window.innerHeight);
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const max = Math.max(window.innerWidth, window.innerHeight);
    const gradient = c2.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 300);
    
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(.5, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,.7)');
    
    c2.fillStyle = gradient;
    c2.fillRect(0, 0, window.innerWidth, window.innerHeight);
});
window.addEventListener('click', (e) => {
    const col = c_colors[Math.floor(Math.random() * c_colors.length)];
    const c = hexToRgbA(col, '0.08');
    const p = { x: e.clientX, y: e.clientY, c, prev: { x: e.clientX, y: e.clientY }};
    points.push(p);
});
animate();
