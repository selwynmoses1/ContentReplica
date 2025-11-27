/**
 * Test script to fetch and verify hero_section entry
 * Tests the specific entry UID: bltc322285692a26776
 */

const CONTENTSTACK_CONFIG = {
  api_key: 'blt2c7743a722e0223b',
  delivery_token: 'csc495c21e306b40b500911f58',
  environment: 'production',
  region: 'us'
};

const API_BASE = 'https://cdn.contentstack.io/v3';
const ENTRY_UID = 'bltc322285692a26776';

async function testHeroEntry() {
  console.log('🔍 Testing hero_section entry fetch...\n');
  console.log(`Entry UID: ${ENTRY_UID}`);
  console.log(`Environment: ${CONTENTSTACK_CONFIG.environment}\n`);

  // Method 1: Fetch by UID
  console.log('📡 Method 1: Fetching entry by UID...');
  const urlByUid = `${API_BASE}/content_types/hero_section/entries/${ENTRY_UID}?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}`;
  
  try {
    const response = await fetch(urlByUid);
    const data = await response.json();
    
    if (response.ok && data.entry) {
      console.log('✅ Entry found by UID!');
      console.log('\n📄 Entry Details:');
      console.log(`   UID: ${data.entry.uid}`);
      console.log(`   Title: ${data.entry.title || 'N/A'}`);
      console.log(`   Gradient Title: ${data.entry.gradient_title || 'N/A'}`);
      console.log(`   Updated At: ${data.entry.updated_at || 'N/A'}`);
      console.log(`   Published At: ${data.entry.publish_details?.time || 'N/A'}`);
      console.log(`   Version: ${data.entry._version || 'N/A'}`);
      console.log('\n📋 Full Entry:');
      console.log(JSON.stringify(data.entry, null, 2));
      return data.entry;
    } else {
      console.log('❌ Entry not found or error:', data);
    }
  } catch (error) {
    console.error('❌ Error fetching by UID:', error.message);
  }

  console.log('\n');

  // Method 2: Fetch all entries and find by UID
  console.log('📡 Method 2: Fetching all hero_section entries...');
  const urlAll = `${API_BASE}/content_types/hero_section/entries?api_key=${CONTENTSTACK_CONFIG.api_key}&access_token=${CONTENTSTACK_CONFIG.delivery_token}&environment=${CONTENTSTACK_CONFIG.environment}&limit=10`;
  
  try {
    const response = await fetch(urlAll);
    const data = await response.json();
    
    if (response.ok && data.entries) {
      console.log(`✅ Found ${data.entries.length} entry/entries`);
      
      const targetEntry = data.entries.find(e => e.uid === ENTRY_UID);
      
      if (targetEntry) {
        console.log('\n✅ Target entry found in list!');
        console.log('\n📄 Entry Details:');
        console.log(`   UID: ${targetEntry.uid}`);
        console.log(`   Title: ${targetEntry.title || 'N/A'}`);
        console.log(`   Gradient Title: ${targetEntry.gradient_title || 'N/A'}`);
        console.log(`   Updated At: ${targetEntry.updated_at || 'N/A'}`);
        console.log(`   Published At: ${targetEntry.publish_details?.time || 'N/A'}`);
        console.log(`   Version: ${targetEntry._version || 'N/A'}`);
        return targetEntry;
      } else {
        console.log(`\n⚠️  Entry with UID ${ENTRY_UID} not found in the list`);
        console.log('\n📋 Available entries:');
        data.entries.forEach((entry, index) => {
          console.log(`   ${index + 1}. UID: ${entry.uid}, Title: ${entry.title || 'N/A'}`);
        });
      }
    } else {
      console.log('❌ Error fetching entries:', data);
    }
  } catch (error) {
    console.error('❌ Error fetching all entries:', error.message);
  }

  console.log('\n💡 Troubleshooting Tips:');
  console.log('   1. Verify the entry is published to the "production" environment');
  console.log('   2. Check that the delivery_token has read permissions');
  console.log('   3. Ensure the environment name matches exactly (case-sensitive)');
  console.log('   4. Try fetching from a different environment if available');
}

// Run test
testHeroEntry().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

