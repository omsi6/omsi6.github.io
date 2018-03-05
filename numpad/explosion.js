// stolen from somewhere
// Request animation frame
const requestAnimationFrame = window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame;

// Canvas
const c   = document.querySelector('.canvas');
const ctx = c.getContext('2d');

// Set full-screen
c.width  = window.innerWidth;
c.height = window.innerHeight;

// Options
const particlesPerExplosion = 100;
const particlesMinSpeed     = 6;
const particlesMaxSpeed     = 10;
const particlesMinSize      = 0.5;
const particlesMaxSize      = 4;
const explosions            = [];

let now, delta;
let then = performance.now();

// Draw
function draw(ts) {
// Loop
requestAnimationFrame(draw);

// Set NOW and DELTA
now   = ts;
delta = now - then;

  // Update THEN
  then = ts;

  // Our animation
  ctx.clearRect(0, 0, c.width, c.height);
  drawExplosion();

}

// Draw explosion(s)
function drawExplosion() {

if (explosions.length === 0) {
  return;
}

for (let i = 0; i < explosions.length; i++) {

  const explosion = explosions[i];
  const particles = explosion.particles;

  if (particles.length === 0) {
	explosions.splice(i, 1);
	return;
  }

  const particlesAfterRemoval = particles.slice();
  for (let ii = 0; ii < particles.length; ii++) {

	const particle = particles[ii];

	// Check particle size
	// If 0, remove
	if (particle.size <= 0) {
	  particlesAfterRemoval.splice(ii, 1);
	  continue;
	}

	ctx.beginPath();
	ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
	ctx.closePath();
	ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
	ctx.fill();

	// Update
	particle.x += particle.xv * (delta * 0.0604);
	particle.y += particle.yv * (delta * 0.0604);
	particle.size -= .1 * (delta * 0.0604);
  }

  explosion.particles = particlesAfterRemoval;

}

}

function explode(x, y) {

explosions.push(
  new explosion(x, y)
);

}

// Explosion
function explosion(x, y) {

this.particles = [];

for (let i = 0; i < particlesPerExplosion; i++) {
  this.particles.push(
	new particle(x, y)
  );
}

}

// Particle
function particle(x, y) {
this.x    = x;
this.y    = y;
this.xv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
this.yv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
this.size = randInt(particlesMinSize, particlesMaxSize, true);
this.r    = realRandInt(71, 91);
this.g    = realRandInt(35, 55);
this.b    = realRandInt(158, 178);
}

// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {

let num;
if (positive === false) {
  num = Math.floor(Math.random() * max) - min;
  num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
} else {
  num = Math.floor(Math.random() * max) + min;
}

return num;

}

function realRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

draw();