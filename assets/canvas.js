const canvas = document.querySelector("canvas");
const c      = canvas.getContext("2d");

const initCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// noise width/height
// const nw = canvas.width;
const nw = 600;
// const nh = canvas.height;
const nh = 300;

const zoom = 230;
const speed = 2;

const flow = Array.from({ length: nw }, () => {
    return Array.from({ length: nh }, () => 0);
});
const initNoise = () => {
    noise.seed(Math.random());
    for (let x = 0; x < nw; x++) {
        for (let y = 0; y < nh; y++) {
            const dx  = noise.simplex2(x / zoom, y / zoom);
            const dy  = noise.simplex2(6000 + x / zoom, 6000 + y / zoom);
            const len = Math.sqrt(dx*dx + dy*dy);

            let tx = 0;
            let ty = 0;
            if (len != 0) {
                tx  = speed * dx / len;
                ty  = speed * dy / len;
            } else {
                tx = 0;
                ty = 0;
            }

            flow[x][y] = { x: tx, y: ty };
        }
    }
}

const pw = Math.min(Math.floor(window.innerWidth / 15), 60);
const ph = Math.min(Math.floor(window.innerHeight / 15), 30);

const colors = [
    "#FF4800",
    "#FF6D00",
    "#FF8500",
    "#FF9E00",
    "#FFB600",
]

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',.015)';
    }
    throw new Error('Bad Hex');
}

let points = [];
const initPoints = () => {
    points = Array.from({ length: pw }, (v, x) => {
        return Array.from(
            { length: ph }, 
            (v, y) => {
                const xp = x * window.innerWidth  / pw;
                const yp = y * window.innerHeight / ph;
                return { 
                    prev: { x: xp, y: yp},
                    x: xp, y: yp,
                    c: hexToRgbA(colors[Math.floor(Math.random() * colors.length)])
                }
            }
        );
    });
}

const reset = () => {
    initCanvas();
    initNoise();
    initPoints();
    c.fillStyle = "#000";
    c.fillRect(0,0,window.innerWidth,window.innerHeight);
    c.strokeStyle = "";
    c.strokeRect(0, 0, window.innerWidth, window.innerHeight);
};

window.onresize = reset;

reset();

c.lineWidth = 2;
function animate() {
    for (let x = 0; x < pw; x++) {
        for (let y = 0; y < ph; y++) {
            const p = points[x][y];
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
            
            c.moveTo(p.prev.x, p.prev.y);

            const i = Math.floor(nw * Math.max(Math.min(p.x, window.innerWidth - 1),0) / window.innerWidth);
            const j = Math.floor(nh * Math.max(Math.min(p.y, window.innerHeight- 1),0) / window.innerHeight);

            const v = flow[i][j];
            
            p.prev = { x: p.x, y: p.y };
            
            p.x += v.x;
            p.y += v.y;

            if (p.x === null || p.y === null) console.log(v);


            c.lineTo(p.x, p.y);
            c.stroke();
        }
    }
    
    requestAnimationFrame(animate);
}

animate();
