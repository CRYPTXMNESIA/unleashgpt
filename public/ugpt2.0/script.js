// Get the loader and preloader elements
const loader = document.getElementById('loader');
const preloader = document.getElementById('preloader');

// Listen for the end of the 'loading' animation on the loader
loader.addEventListener('animationend', () => {
  // Delay the start of the 'slideUp' animation by 2 seconds (the duration of the loading animation)
  setTimeout(() => {
    preloader.style.animation = 'slideUp 2s ease-out forwards';
  }, 3000);
});
