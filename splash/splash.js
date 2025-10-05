// Font loading

// Add a fallback class to <html> for when fonts are not loaded
document.documentElement.classList.add('fonts-loading');

// Create an observer for each font you want to load
var gothic = new FontFaceObserver('Special Gothic Expanded One');
var montserrat = new FontFaceObserver('Montserrat');
var openSans = new FontFaceObserver('Open Sans');

// Wait for all fonts to load
Promise.all([
  gothic.load(),
  montserrat.load(),
  openSans.load()
]).then(function () {
  document.documentElement.classList.remove('fonts-loading');
  document.documentElement.classList.add('fonts-loaded');
  // Now show your main content, remove loading, etc.
}).catch(function () {
  document.documentElement.classList.remove('fonts-loading');
  document.documentElement.classList.add('fonts-failed');
  // Optionally show a fallback or error
});



// Loading screen
const letters = document.querySelectorAll('.loading span');


gsap.to(letters, {
  duration: 1,
  ease: "power1.in",
  onComplete: () => {
    gsap.to(".loading", {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      onComplete: () => {
        document.querySelector(".loading").style.display = "none";
      }
    });
  }
});


// Hanging animation
const sign = document.getElementById('hanging');
const signCon = document.querySelector('.signCon');

gsap.set(signCon, { transformOrigin: "210px 34px" });

gsap.set(signCon, { transformOrigin: "50% 6%" });

gsap.to(signCon, {
  rotation: 6,
  duration: 3,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});


// ----------------- Particles (extracted) -----------------
const PARTICLE_COUNT = 220;
const container = document.getElementById('particles');

function rand(min, max) { return (Math.random() * (max - min)) + min; }

function createParticle(type) {
  const el = document.createElement('div');
  el.className = type;
  el.style.position = 'absolute';

  // Start near top; right-based to mirror your original logic
  const startRight = rand(-window.innerWidth * 0.25, window.innerWidth * 0.25);
  const startTop   = rand(-220, -20);
  el.style.right = startRight + 'px';
  el.style.top   = startTop + 'px';
  container.appendChild(el);

  // Random initial style
  el.style.transform = `translate(0,0) rotate(${rand(-20,20)}deg)`;
  el.style.opacity = rand(0.35, 0.9);
  el.style.scale = rand(0.6, 1.4);

  function animate() {
    const driftX = rand(window.innerWidth * 0.5, window.innerWidth * 1.4);
    const driftY = rand(window.innerHeight * 0.9, window.innerHeight * 1.6);
    const wobble = rand(-120, 120);

    // GSAP-like timing with WAAPI
    el.animate(
      [
        { transform: 'translate(0,0)' },
        { transform: `translate(${-driftX + wobble}px, ${driftY}px)` }
      ],
      { duration: rand(6000, 11000), easing: 'cubic-bezier(.37,.01,.22,1)', fill: 'both' }
    ).onfinish = () => {
      const r = rand(-window.innerWidth * 0.5, window.innerWidth * 0.5);
      const t = rand(-260, -40);
      el.style.right = r + 'px';
      el.style.top   = t + 'px';
      el.style.transform = 'translate(0,0)';
      animate();
    };
  }
  animate();
}

const interval = setInterval(() => {
  if (container.children.length < PARTICLE_COUNT) {
    createParticle(Math.random() < 0.3 ? 'pebble' : 'blossom');
  } else {
    clearInterval(interval);
  }
}, 220);

// ----------------- Click-to-break (extracted) -----------------
(function () {
  const signImg = document.getElementById('hanging');
  const signWrap = document.querySelector('.signCon');
  const overlay  = document.getElementById('whiteOverlay');
  const hint = document.querySelector('.icon-hint');

  if (!signImg || !signWrap || !overlay) return;

  const ORIGINAL_SRC = signImg.getAttribute('src');
  const BROKEN_SRC   = '/assets/brokensign.png'; // provide this file

  // Preload broken image to avoid flicker
  const preloadBroken = new Image(); preloadBroken.src = BROKEN_SRC;

  let clicks = 0;
  let armed  = true;
  const BREAK_AT = 5;
  const BREAK_MS = 420;

  // If using as a true splash, set MAIN_URL to the main page route
  const MAIN_URL = '/index.html'; // main page to load after sequence

  // Additive shake so board breaks at current angle (doesn't override rotate)
  function additiveShake(el) {
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: BREAK_MS, easing: 'ease-in-out', composite: 'add' }
    );
  }

  signWrap.addEventListener('click', () => {
    if (!armed) return;
    clicks += 1;
    
    if (clicks === BREAK_AT) {
      hint.classList.add('is-hidden');
      armed = false;
    

      setTimeout(() => {
        additiveShake(signWrap);
        signImg.src = BROKEN_SRC;
      }, 60);

      setTimeout(() => {       
        overlay.style.opacity = '1';    // fade to white
        

        const onFadeInDone = () => {
          // Navigate to main page after short hold
          setTimeout(() => {
            window.location.href = MAIN_URL; // splash -> main
          }, 200);
        };

        overlay.addEventListener('transitionend', onFadeInDone, { once: true });
      }, BREAK_MS + 20);
    } else {
      // tiny tap feedback on the image only
      signImg.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
        { duration: 120, easing: 'ease-out' }
      );
    }
  });

  // keyboard accessibility
  signImg.tabIndex = 0;
  signImg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); signImg.click(); }
  });
})();
