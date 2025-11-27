/**
 * Contentstack Render Functions - Browser Version
 * Renders Contentstack content into the HTML page
 */

/**
 * Render Navigation Menu
 */
window.renderNavigationMenu = async function() {
  try {
    const navItems = await window.getNavigationMenu();
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && navItems && navItems.length > 0) {
      const navHTML = navItems.map(item => {
        const linkUrl = item.link_url || '#';
        const label = item.menu_label || '';
        return `<li><a href="${linkUrl}">${label}</a></li>`;
      }).join('');
      navMenu.innerHTML = navHTML;
    }
  } catch (error) {
    console.error('Error rendering navigation menu:', error);
  }
};

/**
 * Render Hero Section
 */
window.renderHeroSection = async function(entryUid = null) {
  try {
    // If entryUid is provided, fetch that specific entry, otherwise get first entry
    const hero = await window.getHeroSection(false, entryUid);
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && hero) {
      let title = hero.title || '';
      const gradientTitle = hero.gradient_title || '';
      const subtitle = hero.subtitle || '';
      
      // If gradient_title is provided and exists in title, extract it
      // Otherwise use title as-is and append gradient_title
      let titlePart1 = title;
      let titlePart2 = '';
      
      if (gradientTitle) {
        // Check if gradientTitle is already part of the title
        const titleLower = title.toLowerCase();
        const gradientLower = gradientTitle.toLowerCase();
        
        if (titleLower.includes(gradientLower)) {
          // Extract the part before gradient text
          const index = titleLower.indexOf(gradientLower);
          titlePart1 = title.substring(0, index).trim();
          titlePart2 = gradientTitle;
        } else {
          // Gradient text is separate, use title as-is and append gradient
          titlePart2 = gradientTitle;
        }
      }
      
      const primaryCTA = hero.primary_cta || {};
      const secondaryCTA = hero.secondary_cta || {};
      
      const heroHTML = `
        <h1 class="hero-title fade-in-up">
          ${titlePart1}${titlePart2 ? '<br><span class="gradient-text">' + titlePart2 + '</span>' : ''}
        </h1>
        <p class="hero-subtitle fade-in-up delay-1">${subtitle}</p>
        <div class="hero-actions fade-in-up delay-2">
          ${primaryCTA.button_text ? `
            <button class="btn-primary btn-large" onclick="location.href='${primaryCTA.button_link || '#'}'">
              ${primaryCTA.button_text}
            </button>
          ` : ''}
          ${secondaryCTA.button_text ? `
            <button class="btn-secondary btn-large" onclick="location.href='${secondaryCTA.button_link || '#'}'">
              ${secondaryCTA.button_text}
            </button>
          ` : ''}
        </div>
        ${hero.badge_label ? `
          <div class="trusted-badge fade-in-up delay-3">
            <span class="badge-label">${hero.badge_label}</span>
            <div class="company-logos" id="company-logos"></div>
          </div>
        ` : ''}
      `;
      heroContent.innerHTML = heroHTML;
      
      // Render company logos if badge exists
      if (hero.badge_label) {
        await window.renderCompanyLogos();
      }
    }
  } catch (error) {
    console.error('Error rendering hero section:', error);
  }
};

/**
 * Render Company Logos
 */
window.renderCompanyLogos = async function() {
  try {
    const companies = await window.getCompanyLogos();
    const logosContainer = document.getElementById('company-logos');
    
    if (logosContainer && companies && companies.length > 0) {
      const logosHTML = companies.map(company => {
        const name = company.company_name || '';
        
        if (company.logo && company.logo.url) {
          return `<img src="${company.logo.url}" alt="${name}" class="company-logo" />`;
        } else {
          return `<span class="company-name">${name}</span>`;
        }
      }).join('');
      logosContainer.innerHTML = logosHTML;
    }
  } catch (error) {
    console.error('Error rendering company logos:', error);
  }
};

/**
 * Render Feature Cards
 */
window.renderFeatureCards = async function() {
  try {
    const features = await window.getFeatureCards();
    const featuresGrid = document.getElementById('features-grid') || document.querySelector('.features-grid');
    
    console.log('🎨 Rendering feature cards:', features?.length || 0, 'cards found');
    
    if (featuresGrid) {
      if (features && features.length > 0) {
      const iconMap = {
        'cms': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>',
        'personalization': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'analytics': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>',
        'hosting': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>'
      };
      
      const featuresHTML = features.map((feature, index) => {
        const title = feature.title || '';
        const description = feature.description || '';
        const iconName = feature.icon_name || 'cms';
        const iconHTML = iconMap[iconName] || iconMap['cms'];
        const linkUrl = feature.link_url || '#';
        const linkText = feature.link_text || 'Learn more';
        const delayClass = index > 0 ? `delay-${index}` : '';
        
        return `
          <div class="feature-card fade-in-up ${delayClass}">
            <div class="feature-icon">
              ${iconHTML}
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
            ${linkUrl !== '#' ? `
              <a href="${linkUrl}" class="feature-link">
                ${linkText} →
              </a>
            ` : ''}
          </div>
        `;
      }).join('');
      featuresGrid.innerHTML = featuresHTML;
      
      // Re-initialize carousel after content is rendered
      if (window.initCarousel) {
        setTimeout(() => {
          window.initCarousel();
        }, 100);
      }
      } else {
        console.warn('⚠️ No feature cards found in Contentstack');
        featuresGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No feature cards available</p>';
      }
    } else {
      console.error('❌ Features grid element not found in DOM');
    }
  } catch (error) {
    console.error('❌ Error rendering feature cards:', error);
    console.error('Stack trace:', error.stack);
  }
};

/**
 * Render Blog Posts
 */
window.renderBlogPosts = async function() {
  try {
    const posts = await window.getBlogPosts(100); // Get all posts for carousel
    const blogGrid = document.getElementById('blog-grid') || document.querySelector('.blog-grid');
    
    console.log('🎨 Rendering blog posts:', posts?.length || 0, 'posts found');
    
    if (blogGrid) {
      if (posts && posts.length > 0) {
      const postsHTML = posts.map((post, index) => {
        const title = post.title || '';
        const description = post.description || '';
        const category = post.category || '';
        const slug = post.slug || '#';
        
        const imageHTML = post.featured_image && post.featured_image.url 
          ? `<img src="${post.featured_image.url}" alt="${title}" />`
          : `<div class="image-placeholder"></div>`;
        
        const delayClass = index > 0 ? `delay-${index}` : '';
        
        // Store full post data for modal - escape properly
        const postData = encodeURIComponent(JSON.stringify(post));
        
        return `
          <article class="blog-card fade-in-up ${delayClass}" onclick="showBlogDetailsFromEncoded('${postData}')">
            <div class="blog-image">
              ${imageHTML}
              ${category ? `<span class="blog-category">${category}</span>` : ''}
            </div>
            <div class="blog-content">
              <h3>${title}</h3>
              <p>${description}</p>
              <a href="#" class="blog-link" onclick="event.stopPropagation(); showBlogDetailsFromEncoded('${postData}'); return false;">Read more →</a>
            </div>
          </article>
        `;
      }).join('');
      blogGrid.innerHTML = postsHTML;
      
      // Re-initialize blog carousel after content is rendered
      if (window.initBlogCarousel) {
        setTimeout(() => {
          window.initBlogCarousel();
        }, 100);
      }
      } else {
        console.warn('⚠️ No blog posts found in Contentstack');
        blogGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No blog posts available</p>';
      }
    } else {
      console.error('❌ Blog grid element not found in DOM');
    }
  } catch (error) {
    console.error('❌ Error rendering blog posts:', error);
    console.error('Stack trace:', error.stack);
  }
};

/**
 * Render CTA Section
 */
window.renderCTASection = async function() {
  try {
    const cta = await window.getCTASection();
    const ctaContent = document.querySelector('.cta-content');
    
    if (ctaContent && cta) {
      const title = cta.title || '';
      const description = cta.description || '';
      const buttonText = cta.button_text || '';
      const buttonLink = cta.button_link || '#';
      
      const ctaHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="btn-primary btn-large" onclick="location.href='${buttonLink}'">
          ${buttonText}
        </button>
      `;
      ctaContent.innerHTML = ctaHTML;
    }
  } catch (error) {
    console.error('Error rendering CTA section:', error);
  }
};

/**
 * Render Footer Sections
 */
window.renderFooter = async function() {
  try {
    const footerSections = await window.getFooterSections();
    const footerContent = document.querySelector('.footer-content');
    
    if (footerContent && footerSections && footerSections.length > 0) {
      const footerHTML = footerSections.map(section => {
        const sectionTitle = section.section_title || '';
        const links = section.links || [];
        
        const linksHTML = links.map(link => {
          const linkText = link.link_text || '';
          const linkUrl = link.link_url || '#';
          return `<li><a href="${linkUrl}">${linkText}</a></li>`;
        }).join('');
        
        return `
          <div class="footer-section">
            <h4>${sectionTitle}</h4>
            <ul>${linksHTML}</ul>
          </div>
        `;
      }).join('');
      footerContent.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error('Error rendering footer:', error);
  }
};

/**
 * Render all content
 */
window.renderAllContent = async function(forceRefresh = false) {
  console.log('🔄 Rendering content from Contentstack...');
  
  try {
    // Clear cache if force refresh
    if (forceRefresh && window.contentCache) {
      window.contentCache.clear();
    }
    
    await Promise.all([
      window.renderNavigationMenu(),
      window.renderHeroSection(),
      window.renderFeatureCards(),
      window.renderBlogPosts(),
      window.renderCTASection(),
      window.renderFooter()
    ]);
    
    console.log('✅ Content rendered successfully from Contentstack!');
    console.log('💡 Tip: Publish changes in Contentstack and they will appear automatically!');
    console.log('💡 To force refresh, run: window.forceRefresh()');
  } catch (error) {
    console.error('❌ Error rendering content:', error);
  }
};

// Auto-render when DOM is ready
// Also re-check periodically to ensure content is always fresh
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.renderAllContent();
    // Re-render every 15 seconds to catch any missed updates
    setInterval(() => {
      window.renderAllContent(true); // Force refresh
    }, 15000);
  });
} else {
  window.renderAllContent();
  // Re-render every 15 seconds to catch any missed updates
  setInterval(() => {
    window.renderAllContent(true); // Force refresh
  }, 15000);
}

