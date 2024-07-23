console.clear();

Splitting();

let particles = [];
const colors = ["#eb6383","#fa9191","#ffe9c5","#b4f2e1"];
function pop () {
  for (let i = 0; i < 150; i++) {
    const p = document.createElement('particule');
    p.x = window.innerWidth * 0.5;
    p.y = window.innerHeight + (Math.random() * window.innerHeight * 0.3);
    p.vel = {
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * -20 - 15
    };
    p.mass = Math.random() * 0.2 + 0.8;
    particles.push(p);
    p.style.transform = `translate(${p.x}px, ${p.y}px)`;
    const size = Math.random() * 15 + 5;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(p);
  }
}

function render () {
  for (let i = particles.length - 1; i--; i > -1) {
    const p = particles[i];
    p.style.transform = `translate3d(${p.x}px, ${p.y}px, 1px)`;
    
    p.x += p.vel.x;
    p.y += p.vel.y;
    
    p.vel.y += (0.5 * p.mass);
    if (p.y > (window.innerHeight * 2)) {
      p.remove();
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(render);
}
pop();
window.setTimeout(render, 700);
window.addEventListener('click', pop);