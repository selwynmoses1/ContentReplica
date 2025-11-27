const CONTENTSTACK_CONFIG = {
  api_key: window.CONTENTSTACK_API_KEY || process.env.CONTENTSTACK_API_KEY || 'blt2c7743a722e0223b',
  delivery_token: window.CONTENTSTACK_DELIVERY_TOKEN || process.env.CONTENTSTACK_DELIVERY_TOKEN || 'cs51043beeb31a36d548378970',
  environment: window.CONTENTSTACK_ENVIRONMENT || process.env.CONTENTSTACK_ENVIRONMENT || 'development',
  region: window.CONTENTSTACK_REGION || process.env.CONTENTSTACK_REGION || 'us'
};

const API_BASE = 'https://cdn.contentstack.io/v3';

window.contentCache = new Map();
let contentCache = window.contentCache;
let lastUpdateTimes = new Map();

const AUTO_REFRESH_ENABLED = false;
const REFRESH_INTERVAL = 5000;

async function fetchFromContentstack(contentType, query = {}, skipCache = false) {
  const cacheKey = `${contentType}_${JSON.stringify(query)}`;
  const cached = contentCache.get(cacheKey);
  const now = Date.now();
  
  if (!skipCache && cached && (now - cached.timestamp) < 5000) {
    return cached.data;
  }
  
  try {
    let url = `${API_BASE}/content_types/${contentType}/entries?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}`;
    
    if (query.limit) {
      url += `&limit=${query.limit}`;
    } else {
      url += `&limit=100`;
    }
    if (query.skip) url += `&skip=${query.skip}`;
    
    if (query.orderBy && query.sort) {
      url += `&${query.orderBy}[${query.sort}]`;
    }
    
    console.log(`Fetching ${contentType} from Contentstack...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result && result.entries) {
      const data = result.entries;
      if (!skipCache) {
        contentCache.set(cacheKey, { data, timestamp: now });
      }
      console.log(`Successfully fetched ${contentType}:`, data.length || 1, 'entry/entries');
      return data;
    }
    
    console.warn(`No entries found for ${contentType}`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return cached ? cached.data : null;
  }
}

window.getNavigationMenu = async function(skipCache = false) {
  return await fetchFromContentstack('navigation_menu', { orderBy: 'order', sort: 'asc' }, skipCache);
};

window.getHeroSection = async function(skipCache = false, entryUid = null) {
  if (entryUid) {
    try {
      const url = `${API_BASE}/content_types/hero_section/entries/${entryUid}?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}`;
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        return result.entry || null;
      }
    } catch (error) {
      console.error('Error fetching hero by UID:', error);
    }
  }
  
  const result = await fetchFromContentstack('hero_section', { limit: 1 }, skipCache);
  return result && result[0] ? result[0] : null;
};

window.getFeatureCards = async function(skipCache = false) {
  return await fetchFromContentstack('feature_card', { orderBy: 'order', sort: 'asc' }, skipCache);
};

window.getBlogPosts = async function(limit = 3, skipCache = false) {
  return await fetchFromContentstack('blog_post', { limit, orderBy: 'publish_date', sort: 'desc' }, skipCache);
};

window.getCompanyLogos = async function(skipCache = false) {
  return await fetchFromContentstack('company_logo', { orderBy: 'order', sort: 'asc' }, skipCache);
};

window.getCTASection = async function(skipCache = false) {
  const result = await fetchFromContentstack('cta_section', { limit: 1 }, skipCache);
  return result && result[0] ? result[0] : null;
};

window.getFooterSections = async function(skipCache = false) {
  return await fetchFromContentstack('footer_section', { orderBy: 'order', sort: 'asc' }, skipCache);
};

window.checkForUpdates = async function() {
  try {
    console.log('Checking for content updates...');
    
    const hero = await window.getHeroSection(true);
    
    if (!hero) {
      console.warn('Could not fetch hero section for update check');
    }
    
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
          const publishTime = content.publish_details?.time || content.updated_at || content._version;
          
          const contentHash = JSON.stringify({
            uid: content.uid,
            time: publishTime,
            version: content._version,
            title: content.title || content.menu_label || content.section_title || '',
            updated: content.updated_at
          });
          
          const lastHash = lastUpdateTimes.get(contentType);
          
          if (lastHash && lastHash !== contentHash) {
            console.log(`Changes detected in ${contentType}!`);
            console.log(`Previous: ${lastHash.substring(0, 50)}...`);
            console.log(`Current: ${contentHash.substring(0, 50)}...`);
            hasChanges = true;
            lastUpdateTimes.set(contentType, contentHash);
          } else if (!lastHash) {
            lastUpdateTimes.set(contentType, contentHash);
            console.log(`Stored initial hash for ${contentType}`);
          }
        }
      } catch (error) {
        console.warn(`Could not check ${contentType} for updates:`, error);
      }
    }
    
    if (hasChanges) {
      console.log('Content updated in Contentstack! Changes detected!');
      console.log('Clearing cache and refreshing page...');
      
      contentCache.clear();
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } else {
      console.log('No changes detected - content is up to date');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    console.error('Stack trace:', error.stack);
  }
  
  return false;
};

window.startAutoRefresh = function() {
  if (!AUTO_REFRESH_ENABLED) return;
  
  console.log('Auto-refresh enabled. Checking for changes every', REFRESH_INTERVAL / 1000, 'seconds');
  console.log('Make changes in Contentstack and publish - they will appear automatically!');
  console.log('To manually check for updates, run: window.checkForUpdates()');
  
  setTimeout(() => {
    window.checkForUpdates();
  }, 2000);
  
  setInterval(() => {
    window.checkForUpdates();
  }, REFRESH_INTERVAL);
};

window.forceRefresh = async function() {
  console.log('Force refreshing all content from Contentstack...');
  contentCache.clear();
  lastUpdateTimes.clear();
  if (window.renderAllContent) {
    await window.renderAllContent(true);
  } else {
    window.location.reload();
  }
  console.log('Content refreshed!');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.startAutoRefresh();
  });
} else {
  window.startAutoRefresh();
}
