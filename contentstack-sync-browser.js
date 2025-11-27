/**
 * Contentstack Live Sync - Browser Version
 * Automatically syncs content from Contentstack to your localhost
 * No npm installation required - uses Contentstack REST API
 */

// Configuration - These will be used by Contentstack Launch
// Contentstack Launch automatically injects these at build time if using environment variables
const CONTENTSTACK_CONFIG = {
  api_key: 'blt89c08d1b12ee2e55',
  delivery_token: 'csc2289f1a773e5c0e89bfe2f1',
  environment: 'production',
  region: 'us'
};

// For Contentstack Launch, these can also be set via environment variables:
// api_key: process.env.CONTENTSTACK_API_KEY || 'blt89c08d1b12ee2e55',
// delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'csc2289f1a773e5c0e89bfe2f1',
// environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',

const API_BASE = 'https://cdn.contentstack.io/v3';

// Cache for storing content (expose to window for debugging)
window.contentCache = new Map();
let contentCache = window.contentCache;
let lastUpdateTimes = new Map();

// Auto-refresh settings
const AUTO_REFRESH_ENABLED = false; // Disabled - use window.forceRefresh() or window.checkForUpdates() manually
const REFRESH_INTERVAL = 5000; // 5 seconds (faster sync for better responsiveness)

/**
 * Make API request to Contentstack
 */
async function fetchFromContentstack(contentType, query = {}, skipCache = false) {
  const cacheKey = `${contentType}_${JSON.stringify(query)}`;
  const cached = contentCache.get(cacheKey);
  const now = Date.now();
  
  // Skip cache if explicitly requested or for update checks
  if (!skipCache && cached && (now - cached.timestamp) < 5000) {
    return cached.data;
  }
  
  try {
    // Contentstack Delivery API format
    // Requires both api_key and access_token in URL
    // Format: /v3/content_types/{content_type_uid}/entries?api_key={key}&access_token={token}&environment={env}
    let url = `${API_BASE}/content_types/${contentType}/entries?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}`;
    
    // Add query parameters
    // Note: Contentstack defaults to 100 entries max per request
    // If you need more, you'll need to paginate with skip/limit
    if (query.limit) {
      url += `&limit=${query.limit}`;
    } else {
      // Set a high limit to get all entries (Contentstack max is typically 100)
      url += `&limit=100`;
    }
    if (query.skip) url += `&skip=${query.skip}`;
    
    // Handle ordering properly (Contentstack uses specific query format)
    if (query.orderBy && query.sort) {
      url += `&${query.orderBy}[${query.sort}]`;
    }
    
    console.log(`📡 Fetching ${contentType} from Contentstack...`);
    
    // Make request with both api_key and access_token
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result && result.entries) {
      const data = result.entries;
      // Update cache only if not skipping
      if (!skipCache) {
        contentCache.set(cacheKey, { data, timestamp: now });
      }
      console.log(`✅ Successfully fetched ${contentType}:`, data.length || 1, 'entry/entries');
      return data;
    }
    
    console.warn(`⚠️ No entries found for ${contentType}`);
    return null;
  } catch (error) {
    console.error(`❌ Error fetching ${contentType}:`, error);
    // Return cached data as fallback
    return cached ? cached.data : null;
  }
}

/**
 * Fetch Navigation Menu
 */
window.getNavigationMenu = async function(skipCache = false) {
  return await fetchFromContentstack('navigation_menu', { orderBy: 'order', sort: 'asc' }, skipCache);
};

/**
 * Fetch Hero Section
 */
window.getHeroSection = async function(skipCache = false) {
  const result = await fetchFromContentstack('hero_section', { limit: 1 }, skipCache);
  return result && result[0] ? result[0] : null;
};

/**
 * Fetch Feature Cards
 */
window.getFeatureCards = async function(skipCache = false) {
  return await fetchFromContentstack('feature_card', { orderBy: 'order', sort: 'asc' }, skipCache);
};

/**
 * Fetch Blog Posts
 */
window.getBlogPosts = async function(limit = 3, skipCache = false) {
  return await fetchFromContentstack('blog_post', { limit, orderBy: 'publish_date', sort: 'desc' }, skipCache);
};

/**
 * Fetch Company Logos
 */
window.getCompanyLogos = async function(skipCache = false) {
  return await fetchFromContentstack('company_logo', { orderBy: 'order', sort: 'asc' }, skipCache);
};

/**
 * Fetch CTA Section
 */
window.getCTASection = async function(skipCache = false) {
  const result = await fetchFromContentstack('cta_section', { limit: 1 }, skipCache);
  return result && result[0] ? result[0] : null;
};

/**
 * Fetch Footer Sections
 */
window.getFooterSections = async function(skipCache = false) {
  return await fetchFromContentstack('footer_section', { orderBy: 'order', sort: 'asc' }, skipCache);
};

/**
 * Check for content updates
 */
window.checkForUpdates = async function() {
  try {
    console.log('🔍 Checking for content updates...');
    
    // Fetch fresh data without cache for all content types
    const hero = await window.getHeroSection(true);
    
    if (!hero) {
      console.warn('⚠️ Could not fetch hero section for update check');
      // Still check other content types
    }
    
    // Check ALL content types for changes, not just hero
    // This ensures we catch updates in any content type
    const contentTypes = ['hero_section', 'feature_card', 'blog_post', 'cta_section', 'footer_section', 'navigation_menu'];
    let hasChanges = false;
    
    for (const contentType of contentTypes) {
      try {
        let content = null;
        
        if (contentType === 'hero_section') {
          content = hero;
        } else if (contentType === 'feature_card') {
          const features = await window.getFeatureCards(true);
          content = features && features.length > 0 ? features[0] : null;
        } else if (contentType === 'blog_post') {
          const posts = await window.getBlogPosts(1, true);
          content = posts && posts.length > 0 ? posts[0] : null;
        }
        
        if (content) {
          // Use publish_details.time as most reliable indicator
          const publishTime = content.publish_details?.time || content.updated_at || content._version;
          
          // Create hash from key fields that change on publish
          const contentHash = JSON.stringify({
            uid: content.uid,
            time: publishTime,
            version: content._version,
            title: content.title || content.menu_label || content.section_title || '',
            updated: content.updated_at
          });
          
          const lastHash = lastUpdateTimes.get(contentType);
          
          if (lastHash && lastHash !== contentHash) {
            console.log(`🔄 ✅ Changes detected in ${contentType}!`);
            console.log(`🔄 Previous: ${lastHash.substring(0, 50)}...`);
            console.log(`🔄 Current: ${contentHash.substring(0, 50)}...`);
            hasChanges = true;
            lastUpdateTimes.set(contentType, contentHash);
          } else if (!lastHash) {
            // First time - store current hash
            lastUpdateTimes.set(contentType, contentHash);
            console.log(`💾 Stored initial hash for ${contentType}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not check ${contentType} for updates:`, error);
      }
    }
    
    if (hasChanges) {
      console.log('🔄 ✅ Content updated in Contentstack! Changes detected!');
      console.log('🔄 Clearing cache and refreshing page...');
      
      // Clear all cache
      contentCache.clear();
      
      // Small delay then reload to show new content
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } else {
      console.log('✅ No changes detected - content is up to date');
    }
  } catch (error) {
    console.error('❌ Error checking for updates:', error);
    console.error('Stack trace:', error.stack);
  }
  
  return false;
};

/**
 * Start auto-refresh
 */
window.startAutoRefresh = function() {
  if (!AUTO_REFRESH_ENABLED) return;
  
  console.log('🔄 Auto-refresh enabled. Checking for changes every', REFRESH_INTERVAL / 1000, 'seconds');
  console.log('📝 Make changes in Contentstack and publish - they will appear automatically!');
  console.log('💡 To manually check for updates, run: window.checkForUpdates()');
  
  // Initial check after a short delay
  setTimeout(() => {
    window.checkForUpdates();
  }, 2000);
  
  // Set up polling
  setInterval(() => {
    window.checkForUpdates();
  }, REFRESH_INTERVAL);
};

/**
 * Force refresh all content (bypass cache)
 */
window.forceRefresh = async function() {
  console.log('🔄 Force refreshing all content from Contentstack...');
  contentCache.clear();
  lastUpdateTimes.clear();
  if (window.renderAllContent) {
    await window.renderAllContent(true);
  } else {
    window.location.reload();
  }
  console.log('✅ Content refreshed!');
};

// Start auto-refresh when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.startAutoRefresh();
  });
} else {
  window.startAutoRefresh();
}

