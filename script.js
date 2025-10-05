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

// Margin of particles & Sidebar functionality
const menuButton = document.getElementById('widthMenu');
const menuCon = document.querySelector('.navbar')

menuButton.addEventListener('click', function() {
  const x = window.scrollX, y = window.scrollY;

  requestAnimationFrame(() => {
    window.scrollTo(x, y);                              
    setTimeout(() => window.scrollTo(x, y), 10);        
  });

  menuCon.classList.toggle('active');
});

// Dragon rotation
const dragon = document.getElementById('dragon');
let rotated = false;

menuButton.addEventListener('click', function() {
  rotated = !rotated;
  if (rotated) {
    dragon.style.transform = 'rotate(-360deg)';
  } else {
    dragon.style.transform = 'rotate(0deg)';
  }
});


// Smooth-scroll to a section by id
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
}

// Example: scroll when a button/link is clicked
document.getElementById('startJourney').addEventListener('click', () => {
  scrollToSection('hero-menu'); // change to the target section id
});