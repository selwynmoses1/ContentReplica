/**
 * Import Blog Post Content Type and Entries to Contentstack
 * 
 * Usage: node import-blog-posts.js
 * 
 * Make sure to set these environment variables or update the config below:
 * - CONTENTSTACK_MANAGEMENT_TOKEN
 * - CONTENTSTACK_API_KEY
 * - CONTENTSTACK_REGION (default: 'na')
 */

const fs = require('fs');
const path = require('path');

// Contentstack Configuration
const CONFIG = {
  management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'cse8685604d444842a58776998',
  api_key: process.env.CONTENTSTACK_API_KEY || 'blt89c08d1b12ee2e55',
  region: process.env.CONTENTSTACK_REGION || 'na'
};

const API_BASE = `https://api.contentstack.io/v3`;

// Helper function to make API requests
async function makeRequest(url, method = 'GET', body = null, headers = {}) {
  const defaultHeaders = {
    'api_key': CONFIG.api_key,
    'authorization': CONFIG.management_token,
    'Content-Type': 'application/json',
    ...headers
  };

  const options = {
    method,
    headers: defaultHeaders
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    throw error;
  }
}

// Create Content Type
async function createContentType() {
  console.log('📝 Creating blog_post content type...');
  
  const contentTypePath = path.join(__dirname, 'blog-post-content-type.json');
  const contentTypeData = JSON.parse(fs.readFileSync(contentTypePath, 'utf8'));
  
  const url = `${API_BASE}/content_types`;
  const payload = { content_type: contentTypeData.content_type };
  
  try {
    const result = await makeRequest(url, 'POST', payload);
    console.log('✅ Content type created successfully!');
    console.log(`   UID: ${result.content_type.uid}`);
    return result.content_type;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('422')) {
      console.log('⚠️  Content type might already exist, attempting to update...');
      // Try to get existing content type
      try {
        const getUrl = `${API_BASE}/content_types/${contentTypeData.content_type.uid}`;
        const existing = await makeRequest(getUrl);
        console.log('✅ Content type already exists, skipping creation');
        return existing.content_type;
      } catch (getError) {
        console.error('❌ Could not retrieve existing content type:', getError.message);
        throw error;
      }
    }
    throw error;
  }
}

// Create Entries
async function createEntries() {
  console.log('📝 Creating blog post entries...');
  
  const entriesPath = path.join(__dirname, 'blog-post-entries.json');
  const entriesData = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
  
  const createdEntries = [];
  
  for (const entryItem of entriesData.entries) {
    const contentTypeUid = entryItem.content_type;
    const entryData = entryItem.data;
    
    // Extract UID and title if they exist
    const uid = entryData.uid;
    const title = entryData.title;
    
    // Create entry payload
    const entry = { ...entryData };
    if (uid) entry.uid = uid;
    if (title) entry.title = title;
    
    const url = `${API_BASE}/content_types/${contentTypeUid}/entries`;
    
    try {
      const payload = { entry };
      const result = await makeRequest(url, 'POST', payload);
      console.log(`✅ Created entry: "${title}" (UID: ${result.entry.uid})`);
      createdEntries.push(result.entry);
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('422')) {
        console.log(`⚠️  Entry "${title}" might already exist, skipping...`);
      } else {
        console.error(`❌ Failed to create entry "${title}":`, error.message);
      }
    }
  }
  
  return createdEntries;
}

// Publish Entries
async function publishEntries(entries) {
  console.log('📤 Publishing entries...');
  
  for (const entry of entries) {
    const contentTypeUid = entry.content_type || 'blog_post';
    const entryUid = entry.uid;
    
    if (!entryUid) {
      console.warn(`⚠️  Skipping entry without UID`);
      continue;
    }
    
    const url = `${API_BASE}/content_types/${contentTypeUid}/entries/${entryUid}/publish`;
    const payload = {
      entry: {
        environments: ['production'],
        locales: ['en-us']
      }
    };
    
    try {
      await makeRequest(url, 'POST', payload);
      console.log(`✅ Published entry: ${entryUid}`);
    } catch (error) {
      console.error(`❌ Failed to publish entry ${entryUid}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting blog post import...\n');
  console.log(`📋 Configuration:`);
  console.log(`   API Key: ${CONFIG.api_key}`);
  console.log(`   Region: ${CONFIG.region}\n`);
  
  try {
    // Step 1: Create content type
    const contentType = await createContentType();
    console.log('');
    
    // Step 2: Create entries
    const entries = await createEntries();
    console.log('');
    
    // Step 3: Publish entries
    if (entries.length > 0) {
      await publishEntries(entries);
      console.log('');
    }
    
    console.log('✅ Import completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Content Type: ${contentType.uid}`);
    console.log(`   Entries Created: ${entries.length}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Go to Contentstack and verify the content type and entries');
    console.log('   2. Add featured images to blog posts if needed');
    console.log('   3. Update content as needed');
    console.log('   4. Publish changes to see them on your site');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { createContentType, createEntries, publishEntries };

