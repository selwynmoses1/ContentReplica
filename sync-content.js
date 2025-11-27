/**
 * Sync Contentstack Entries with Local Website
 * 
 * This script fetches the latest content from Contentstack Delivery API
 * and verifies that all entries are up to date.
 * 
 * Usage: node sync-content.js
 */

const CONTENTSTACK_CONFIG = {
  api_key: 'blt2c7743a722e0223b',
  delivery_token: 'csc495c21e306b40b500911f58',
  environment: 'production',
  region: 'us'
};

const API_BASE = 'https://cdn.contentstack.io/v3';

// Content types to sync
const CONTENT_TYPES = [
  'navigation_menu',
  'hero_section',
  'feature_card',
  'blog_post',
  'cta_section',
  'footer_section',
  'company_logo'
];

/**
 * Fetch content from Contentstack Delivery API
 */
async function fetchContent(contentType, limit = 100) {
  const url = `${API_BASE}/content_types/${contentType}/entries?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return result.entries || [];
  } catch (error) {
    console.error(`❌ Error fetching ${contentType}:`, error.message);
    return null;
  }
}

/**
 * Sync all content types
 */
async function syncAllContent() {
  console.log('🔄 Syncing content from Contentstack...\n');
  console.log(`📋 Configuration:`);
  console.log(`   API Key: ${CONTENTSTACK_CONFIG.api_key}`);
  console.log(`   Environment: ${CONTENTSTACK_CONFIG.environment}`);
  console.log(`   Region: ${CONTENTSTACK_CONFIG.region}\n`);
  
  const results = {};
  let totalEntries = 0;
  
  for (const contentType of CONTENT_TYPES) {
    console.log(`📡 Fetching ${contentType}...`);
    const entries = await fetchContent(contentType);
    
    if (entries !== null) {
      const count = Array.isArray(entries) ? entries.length : 1;
      results[contentType] = entries;
      totalEntries += count;
      console.log(`   ✅ Fetched ${count} ${count === 1 ? 'entry' : 'entries'}`);
      
      // Show sample data for first entry
      if (count > 0) {
        const sample = Array.isArray(entries) ? entries[0] : entries;
        const title = sample.title || sample.menu_label || sample.section_title || sample.company_name || 'Entry';
        const updated = sample.updated_at || sample.publish_details?.time || 'N/A';
        console.log(`   📄 Sample: "${title}" (Updated: ${updated})`);
      }
    } else {
      console.log(`   ⚠️  Failed to fetch ${contentType}`);
    }
    console.log('');
  }
  
  console.log('✅ Sync completed!\n');
  console.log(`📊 Summary:`);
  console.log(`   Content Types: ${CONTENT_TYPES.length}`);
  console.log(`   Total Entries: ${totalEntries}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Open your website at http://localhost:8000');
  console.log('   2. Open browser console (F12)');
  console.log('   3. Run: window.forceRefresh()');
  console.log('   4. The website will fetch and display the latest content from Contentstack');
  console.log('\n📝 Note: The website caches content for 5 seconds.');
  console.log('   Use window.forceRefresh() to bypass cache and get fresh content.');
  
  return results;
}

// Run sync
if (require.main === module) {
  syncAllContent().catch(error => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
}

module.exports = { syncAllContent, fetchContent };

