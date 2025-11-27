/**
 * Carousel Navigation for Feature Cards
 * Handles horizontal scrolling with arrow buttons
 */

(function() {
  'use strict';

  let carouselInterval = null;

  function initCarousel() {
    const grid = document.getElementById('features-grid');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!grid || !prevBtn || !nextBtn) {
      // Wait for elements to be rendered
      setTimeout(initCarousel, 500);
      return;
    }

    // Update button states based on scroll position
    function updateButtons() {
      const scrollLeft = grid.scrollLeft;
      const scrollWidth = grid.scrollWidth;
      const clientWidth = grid.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      console.log('🔍 Carousel state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll,
        cardsCount: grid.querySelectorAll('.feature-card').length
      });

      // Disable prev button if at start
      if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      // Disable next button if at end
      // Only disable if there's actually more content to scroll
      if (maxScroll <= 10 || scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }

    // Scroll function
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

      // Update buttons after scroll animation
      setTimeout(updateButtons, 300);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => scroll('next'));
    prevBtn.addEventListener('click', () => scroll('prev'));

    // Update buttons on scroll
    grid.addEventListener('scroll', updateButtons);

    // Update buttons on resize
    window.addEventListener('resize', () => {
      setTimeout(updateButtons, 100);
    });

    // Initial button state
    setTimeout(updateButtons, 100);

    // Update buttons when content is rendered
    const observer = new MutationObserver(() => {
      setTimeout(updateButtons, 100);
    });

    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // Also initialize after content is rendered (for dynamic content)
  window.addEventListener('load', () => {
    setTimeout(initCarousel, 500);
  });

  // Re-initialize when content is updated
  if (window.renderFeatureCards) {
    const originalRender = window.renderFeatureCards;
    window.renderFeatureCards = function() {
      const result = originalRender.apply(this, arguments);
      setTimeout(initCarousel, 300);
      return result;
    };
  }

  // Expose init function globally
  window.initCarousel = initCarousel;
})();

/**
 * Blog Carousel Navigation
 * Handles horizontal scrolling with arrow buttons for blog posts
 */
(function() {
  'use strict';

  function initBlogCarousel() {
    const grid = document.getElementById('blog-grid');
    const prevBtn = document.getElementById('blog-carousel-prev');
    const nextBtn = document.getElementById('blog-carousel-next');

    if (!grid || !prevBtn || !nextBtn) {
      // Wait for elements to be rendered
      setTimeout(initBlogCarousel, 500);
      return;
    }

    // Update button states based on scroll position
    function updateButtons() {
      const scrollLeft = grid.scrollLeft;
      const scrollWidth = grid.scrollWidth;
      const clientWidth = grid.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      console.log('🔍 Blog carousel state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll,
        postsCount: grid.querySelectorAll('.blog-card').length
      });

      // Disable prev button if at start
      if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      // Disable next button if at end
      if (maxScroll <= 10 || scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }

    // Scroll function
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

      // Update buttons after scroll animation
      setTimeout(updateButtons, 300);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => scroll('next'));
    prevBtn.addEventListener('click', () => scroll('prev'));

    // Update buttons on scroll
    grid.addEventListener('scroll', updateButtons);

    // Update buttons on resize
    window.addEventListener('resize', () => {
      setTimeout(updateButtons, 100);
    });

    // Initial button state
    setTimeout(updateButtons, 100);

    // Update buttons when content is rendered
    const observer = new MutationObserver(() => {
      setTimeout(updateButtons, 100);
    });

    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogCarousel);
  } else {
    initBlogCarousel();
  }

  // Also initialize after content is rendered (for dynamic content)
  window.addEventListener('load', () => {
    setTimeout(initBlogCarousel, 500);
  });

  // Expose init function globally
  window.initBlogCarousel = initBlogCarousel;
})();

