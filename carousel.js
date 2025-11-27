(function() {
  'use strict';

  let carouselInterval = null;

  function initCarousel() {
    const grid = document.getElementById('features-grid');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!grid || !prevBtn || !nextBtn) {
      setTimeout(initCarousel, 500);
      return;
    }

    function updateButtons() {
      const scrollLeft = grid.scrollLeft;
      const scrollWidth = grid.scrollWidth;
      const clientWidth = grid.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      console.log('Carousel state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll,
        cardsCount: grid.querySelectorAll('.feature-card').length
      });

      if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      if (maxScroll <= 10 || scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }

    function scroll(direction) {
      const cardWidth = grid.querySelector('.feature-card')?.offsetWidth || 380;
      const gap = 32;
      const scrollAmount = cardWidth + gap;

      if (direction === 'next') {
        grid.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      } else {
        grid.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }

      setTimeout(updateButtons, 300);
    }

    nextBtn.addEventListener('click', () => scroll('next'));
    prevBtn.addEventListener('click', () => scroll('prev'));

    grid.addEventListener('scroll', updateButtons);

    window.addEventListener('resize', () => {
      setTimeout(updateButtons, 100);
    });

    setTimeout(updateButtons, 100);

    const observer = new MutationObserver(() => {
      setTimeout(updateButtons, 100);
    });

    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  window.addEventListener('load', () => {
    setTimeout(initCarousel, 500);
  });

  if (window.renderFeatureCards) {
    const originalRender = window.renderFeatureCards;
    window.renderFeatureCards = function() {
      const result = originalRender.apply(this, arguments);
      setTimeout(initCarousel, 300);
      return result;
    };
  }

  window.initCarousel = initCarousel;
})();

(function() {
  'use strict';

  function initBlogCarousel() {
    const grid = document.getElementById('blog-grid');
    const prevBtn = document.getElementById('blog-carousel-prev');
    const nextBtn = document.getElementById('blog-carousel-next');

    if (!grid || !prevBtn || !nextBtn) {
      setTimeout(initBlogCarousel, 500);
      return;
    }

    function updateButtons() {
      const scrollLeft = grid.scrollLeft;
      const scrollWidth = grid.scrollWidth;
      const clientWidth = grid.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      console.log('Blog carousel state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll,
        postsCount: grid.querySelectorAll('.blog-card').length
      });

      if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      if (maxScroll <= 10 || scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }

    function scroll(direction) {
      const cardWidth = grid.querySelector('.blog-card')?.offsetWidth || 400;
      const gap = 32;
      const scrollAmount = cardWidth + gap;

      if (direction === 'next') {
        grid.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      } else {
        grid.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }

      setTimeout(updateButtons, 300);
    }

    nextBtn.addEventListener('click', () => scroll('next'));
    prevBtn.addEventListener('click', () => scroll('prev'));

    grid.addEventListener('scroll', updateButtons);

    window.addEventListener('resize', () => {
      setTimeout(updateButtons, 100);
    });

    setTimeout(updateButtons, 100);

    const observer = new MutationObserver(() => {
      setTimeout(updateButtons, 100);
    });

    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogCarousel);
  } else {
    initBlogCarousel();
  }

  window.addEventListener('load', () => {
    setTimeout(initBlogCarousel, 500);
  });

  window.initBlogCarousel = initBlogCarousel;
})();
