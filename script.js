const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const frameOverlay = document.getElementById('frame-overlay');
const frameOptions = document.querySelectorAll('.frame-option');

let currentFrame = 'classic';
let stream = null;
let isCaptured = false;

async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } 
        });
        video.srcObject = stream;
    } catch (err) {
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
    }
}

frameOptions.forEach(option => {
    option.addEventListener('click', () => {
        frameOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        currentFrame = option.dataset.frame;
        updateFrameOverlay();
    });
});

function updateFrameOverlay() {
    frameOverlay.className = 'frame-overlay';
    frameOverlay.classList.add(`${currentFrame}-frame`);
}

captureBtn.addEventListener('click', () => { if (!isCaptured) capturePhoto(); });
retakeBtn.addEventListener('click', retakePhoto);
downloadBtn.addEventListener('click', downloadPhoto);

function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Mirror effect untuk selfie
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();
    
    applyFrameEffect(context, canvas.width, canvas.height);
    
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'block';
    downloadBtn.style.display = 'block';
    isCaptured = true;
}

function applyFrameEffect(ctx, w, h) {
    const bw = Math.min(w, h) * 0.05;
    
    switch(currentFrame) {
        case 'classic':
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = bw * 2;
            ctx.strokeRect(0, 0, w, h);
            break;
        case 'vintage':
            ctx.strokeStyle = '#D4A574';
            ctx.lineWidth = bw * 1.5;
            ctx.strokeRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(212, 165, 116, 0.2)';
            ctx.fillRect(0, 0, w, h);
            break;
        case 'modern':
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = bw;
            ctx.strokeRect(bw/2, bw/2, w - bw, h - bw);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = bw * 0.5;
            ctx.strokeRect(bw * 1.5, bw * 1.5, w - bw * 3, h - bw * 3);
            break;
        case 'colorful':
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(0.33, '#4ecdc4');
            gradient.addColorStop(0.66, '#45b7d1');
            gradient.addColorStop(1, '#f7b731');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = bw * 2;
            ctx.strokeRect(0, 0, w, h);
            break;
        case 'elegant':
            ctx.strokeStyle = '#C9B037';
            ctx.lineWidth = bw * 2.5;
            ctx.strokeRect(0, 0, w, h);
            ctx.shadowColor = '#C9B037';
            ctx.shadowBlur = 20;
            ctx.strokeRect(bw, bw, w - bw * 2, h - bw * 2);
            ctx.shadowBlur = 0;
            break;
        case 'fun':
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = bw * 2;
            ctx.setLineDash([bw, bw]);
            ctx.strokeRect(bw/2, bw/2, w - bw, h - bw);
            ctx.setLineDash([]);
            break;
        case 'minimalist':
            ctx.strokeStyle = '#333';
            ctx.lineWidth = bw * 0.5;
            const m = bw * 2;
            ctx.strokeRect(m, m, w - m * 2, h - m * 2);
            break;
        case 'neon':
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 30;
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = bw;
            ctx.strokeRect(bw/2, bw/2, w - bw, h - bw);
            ctx.shadowBlur = 0;
            break;
    }
}

function retakePhoto() {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    captureBtn.style.display = 'block';
    retakeBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    isCaptured = false;
}

function downloadPhoto() {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photobooth-${currentFrame}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

window.addEventListener('load', () => { initCamera(); updateFrameOverlay(); });
window.addEventListener('beforeunload', () => { if (stream) stream.getTracks().forEach(t => t.stop()); });
