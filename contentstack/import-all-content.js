/**
 * Import All Content Types and Entries to Contentstack
 * 
 * This script creates all content types and entries for the ContentStack Blog project
 * Based on Contentstack website: https://www.contentstack.com/
 * 
 * Usage: node import-all-content.js
 */

const fs = require('fs');
const path = require('path');

// Contentstack Configuration
const CONFIG = {
  management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || 'csc495c21e306b40b500911f58',
  api_key: process.env.CONTENTSTACK_API_KEY || 'blt2c7743a722e0223b',
  region: process.env.CONTENTSTACK_REGION || 'us'
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
async function createContentType(contentTypeDefinition) {
  const contentTypeUid = contentTypeDefinition.content_type.uid;
  console.log(`📝 Creating ${contentTypeUid} content type...`);
  
  const url = `${API_BASE}/content_types`;
  const payload = { content_type: contentTypeDefinition.content_type };
  
  try {
    const result = await makeRequest(url, 'POST', payload);
    console.log(`✅ Content type ${contentTypeUid} created successfully!`);
    return result.content_type;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('422')) {
      console.log(`⚠️  Content type ${contentTypeUid} might already exist, skipping...`);
      try {
        const getUrl = `${API_BASE}/content_types/${contentTypeUid}`;
        const existing = await makeRequest(getUrl);
        console.log(`✅ Content type ${contentTypeUid} already exists`);
        return existing.content_type;
      } catch (getError) {
        console.error(`❌ Could not retrieve existing content type:`, getError.message);
        throw error;
      }
    }
    throw error;
  }
}

// Create Entry
async function createEntry(contentTypeUid, entryData) {
  const url = `${API_BASE}/content_types/${contentTypeUid}/entries`;
  const payload = { entry: entryData };
  
  try {
    const result = await makeRequest(url, 'POST', payload);
    return result.entry;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('422')) {
      console.log(`⚠️  Entry might already exist, skipping...`);
      return null;
    }
    throw error;
  }
}

// Publish Entry
async function publishEntry(contentTypeUid, entryUid) {
  const url = `${API_BASE}/content_types/${contentTypeUid}/entries/${entryUid}/publish`;
  const payload = {
    entry: {
      environments: ['production'],
      locales: ['en-us']
    }
  };
  
  try {
    await makeRequest(url, 'POST', payload);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish entry ${entryUid}:`, error.message);
    return false;
  }
}

// Content Type Definitions
const contentTypes = {
  navigation_menu: {
    content_type: {
      title: "Navigation Menu",
      uid: "navigation_menu",
      schema: [
        {
          data_type: "text",
          display_name: "Menu Label",
          uid: "menu_label",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Link URL",
          uid: "link_url",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "number",
          display_name: "Order",
          uid: "order",
          field_metadata: { default_value: 0 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "menu_label"
      }
    }
  },
  hero_section: {
    content_type: {
      title: "Hero Section",
      uid: "hero_section",
      schema: [
        {
          data_type: "text",
          display_name: "Title",
          uid: "title",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Gradient Title",
          uid: "gradient_title",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Subtitle",
          uid: "subtitle",
          field_metadata: { _default: true, multiline: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "group",
          display_name: "Primary CTA",
          uid: "primary_cta",
          schema: [
            {
              data_type: "text",
              display_name: "Button Text",
              uid: "button_text",
              field_metadata: { _default: true, version: 3 }
            },
            {
              data_type: "text",
              display_name: "Button Link",
              uid: "button_link",
              field_metadata: { _default: true, version: 3 }
            }
          ],
          mandatory: false,
          multiple: false
        },
        {
          data_type: "group",
          display_name: "Secondary CTA",
          uid: "secondary_cta",
          schema: [
            {
              data_type: "text",
              display_name: "Button Text",
              uid: "button_text",
              field_metadata: { _default: true, version: 3 }
            },
            {
              data_type: "text",
              display_name: "Button Link",
              uid: "button_link",
              field_metadata: { _default: true, version: 3 }
            }
          ],
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Badge Label",
          uid: "badge_label",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "title"
      }
    }
  },
  feature_card: {
    content_type: {
      title: "Feature Card",
      uid: "feature_card",
      schema: [
        {
          data_type: "text",
          display_name: "Title",
          uid: "title",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Description",
          uid: "description",
          field_metadata: { _default: true, multiline: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Icon Name",
          uid: "icon_name",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Link URL",
          uid: "link_url",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Link Text",
          uid: "link_text",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "number",
          display_name: "Order",
          uid: "order",
          field_metadata: { default_value: 0 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "title"
      }
    }
  },
  cta_section: {
    content_type: {
      title: "CTA Section",
      uid: "cta_section",
      schema: [
        {
          data_type: "text",
          display_name: "Title",
          uid: "title",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Description",
          uid: "description",
          field_metadata: { _default: true, multiline: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Button Text",
          uid: "button_text",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "text",
          display_name: "Button Link",
          uid: "button_link",
          field_metadata: { _default: true, version: 3 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "title"
      }
    }
  },
  footer_section: {
    content_type: {
      title: "Footer Section",
      uid: "footer_section",
      schema: [
        {
          data_type: "text",
          display_name: "Section Title",
          uid: "section_title",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "group",
          display_name: "Links",
          uid: "links",
          schema: [
            {
              data_type: "text",
              display_name: "Link Text",
              uid: "link_text",
              field_metadata: { _default: true, version: 3 }
            },
            {
              data_type: "text",
              display_name: "Link URL",
              uid: "link_url",
              field_metadata: { _default: true, version: 3 }
            }
          ],
          mandatory: false,
          multiple: true
        },
        {
          data_type: "number",
          display_name: "Order",
          uid: "order",
          field_metadata: { default_value: 0 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "section_title"
      }
    }
  },
  company_logo: {
    content_type: {
      title: "Company Logo",
      uid: "company_logo",
      schema: [
        {
          data_type: "text",
          display_name: "Company Name",
          uid: "company_name",
          field_metadata: { _default: true, version: 3 },
          mandatory: true,
          multiple: false
        },
        {
          data_type: "file",
          display_name: "Logo",
          uid: "logo",
          field_metadata: { image: true },
          mandatory: false,
          multiple: false
        },
        {
          data_type: "number",
          display_name: "Order",
          uid: "order",
          field_metadata: { default_value: 0 },
          mandatory: false,
          multiple: false
        }
      ],
      options: {
        is_page: false,
        singleton: false,
        title: "company_name"
      }
    }
  },
  blog_post: JSON.parse(fs.readFileSync(path.join(__dirname, 'blog-post-content-type.json'), 'utf8'))
};

// Entry Data based on Contentstack website
const entriesData = {
  navigation_menu: [
    { menu_label: "Platform", link_url: "#platform", order: 1 },
    { menu_label: "Solutions", link_url: "#solutions", order: 2 },
    { menu_label: "Resources", link_url: "#resources", order: 3 },
    { menu_label: "Blog", link_url: "#blog", order: 4 },
    { menu_label: "About", link_url: "#about", order: 5 }
  ],
  hero_section: [{
    title: "The world's best digital",
    gradient_title: "experiences start here",
    subtitle: "Create exceptional content experiences across all channels with our modern platform",
    primary_cta: {
      button_text: "Start Free Trial",
      button_link: "#"
    },
    secondary_cta: {
      button_text: "Watch Demo",
      button_link: "#"
    },
    badge_label: "Trusted by industry leaders"
  }],
  feature_card: [
    {
      title: "A headless CMS built for flexibility",
      description: "Maintain complete control of your technology with an API-first, cloud-based headless CMS.",
      icon_name: "cms",
      link_url: "#",
      link_text: "Learn more about Headless CMS",
      order: 1
    },
    {
      title: "Highly personalized",
      description: "Leverage data and automation so you're delivering the right message in the right place and at the right time.",
      icon_name: "personalization",
      link_url: "#",
      link_text: "Learn more about personalization",
      order: 2
    },
    {
      title: "Powerful customer analytics",
      description: "All of your customer data, unified and ready for action, across every channel and audience.",
      icon_name: "analytics",
      link_url: "#",
      link_text: "Learn more about real time data",
      order: 3
    },
    {
      title: "Effortless front-end hosting",
      description: "Fully integrated. Fully automated. MACH-compliant. This is front-end hosting that works for you, not against you.",
      icon_name: "hosting",
      link_url: "#",
      link_text: "Learn more about launch",
      order: 4
    },
    {
      title: "Intelligent agents, built for action",
      description: "Deploy agents that combine reasoning, brand context, and tools to accelerate your work where it matters most.",
      icon_name: "cms",
      link_url: "#",
      link_text: "Learn more about agents",
      order: 5
    },
    {
      title: "Unlock your future",
      description: "Seamlessly integrate intelligent agents, AI-powered automation and advanced workflows, all in one platform",
      icon_name: "cms",
      link_url: "#",
      link_text: "Learn more",
      order: 6
    }
  ],
  blog_post: [
    {
      title: "The Forrester Wave™: Digital Experience Platforms, Q4 2025",
      slug: "forrester-wave-digital-experience-platforms-q4-2025",
      category: "Report",
      description: "A Strong Performer in The Forrester Wave™: Digital Experience Platforms, Q4 2025",
      author: "Contentstack Team",
      publish_date: new Date().toISOString(),
      order: 1,
      content: {
        type: "doc",
        children: [
          {
            type: "p",
            children: [
              { text: "Contentstack has been recognized as a Strong Performer in The Forrester Wave™: Digital Experience Platforms, Q4 2025." }
            ]
          }
        ]
      }
    },
    {
      title: "Contentstack Research",
      slug: "contentstack-research",
      category: "Report",
      description: "Latest research and insights from Contentstack",
      author: "Contentstack Team",
      publish_date: new Date().toISOString(),
      order: 2,
      content: {
        type: "doc",
        children: [
          {
            type: "p",
            children: [
              { text: "Discover the latest research and insights from Contentstack." }
            ]
          }
        ]
      }
    },
    {
      title: "First-party data activation guide for marketers",
      slug: "first-party-data-activation-guide-marketers",
      category: "Report",
      description: "Learn how to leverage first-party data effectively to create personalized experiences that drive engagement and conversions.",
      author: "Contentstack Team",
      publish_date: new Date().toISOString(),
      order: 3,
      content: {
        type: "doc",
        children: [
          {
            type: "p",
            children: [
              { text: "If you can't see them, you can't serve them. Real-time, adaptive personalization powered by first-party data means you get a clear picture of your customers." }
            ]
          }
        ]
      }
    },
    {
      title: "The ultimate guide to headless CMS",
      slug: "ultimate-guide-headless-cms",
      category: "E-book",
      description: "Everything you need to know about headless content management systems and how they can transform your digital strategy.",
      author: "Contentstack Team",
      publish_date: new Date().toISOString(),
      order: 4,
      content: {
        type: "doc",
        children: [
          {
            type: "p",
            children: [
              { text: "The adaptive digital experience era is here. Empowering better, more creative work, and moments that matter to your audience." }
            ]
          }
        ]
      }
    }
  ],
  cta_section: [{
    title: "Reimagine possible",
    description: "Because with Contentstack, it is possible. And we'll help you get there.",
    button_text: "Talk to us",
    button_link: "#"
  }],
  footer_section: [
    {
      section_title: "Platform",
      links: [
        { link_text: "Solution Center", link_url: "#" },
        { link_text: "Marketplace", link_url: "#" },
        { link_text: "Developers & IT", link_url: "#" },
        { link_text: "Plans & Pricing", link_url: "#" }
      ],
      order: 1
    },
    {
      section_title: "Solutions",
      links: [
        { link_text: "Retail", link_url: "#" },
        { link_text: "E-commerce", link_url: "#" },
        { link_text: "Financial Services", link_url: "#" },
        { link_text: "Personalization", link_url: "#" }
      ],
      order: 2
    },
    {
      section_title: "Resources",
      links: [
        { link_text: "Academy", link_url: "#" },
        { link_text: "Documentation", link_url: "#" },
        { link_text: "Blog", link_url: "#" },
        { link_text: "Community", link_url: "#" }
      ],
      order: 3
    },
    {
      section_title: "Company",
      links: [
        { link_text: "About Us", link_url: "#" },
        { link_text: "Careers", link_url: "#" },
        { link_text: "Contact", link_url: "#" },
        { link_text: "Support", link_url: "#" }
      ],
      order: 4
    }
  ],
  company_logo: [
    { company_name: "ASICS", order: 1 },
    { company_name: "Mattel", order: 2 },
    { company_name: "Walmart", order: 3 },
    { company_name: "Top Golf", order: 4 },
    { company_name: "Callway", order: 5 },
    { company_name: "Steve Madden", order: 6 },
    { company_name: "MongoDB", order: 7 },
    { company_name: "Alaska Airlines", order: 8 }
  ]
};

// Main execution
async function main() {
  console.log('🚀 Starting comprehensive content import...\n');
  console.log(`📋 Configuration:`);
  console.log(`   API Key: ${CONFIG.api_key}`);
  console.log(`   Management Token: ${CONFIG.management_token.substring(0, 10)}...`);
  console.log(`   Region: ${CONFIG.region}\n`);

  const createdContentTypes = {};
  const createdEntries = {};

  try {
    // Step 1: Create all content types
    console.log('📝 Step 1: Creating content types...\n');
    for (const [uid, definition] of Object.entries(contentTypes)) {
      const contentType = await createContentType(definition);
      createdContentTypes[uid] = contentType;
      console.log('');
    }

    // Step 2: Create all entries
    console.log('📝 Step 2: Creating entries...\n');
    for (const [contentTypeUid, entries] of Object.entries(entriesData)) {
      console.log(`Creating entries for ${contentTypeUid}...`);
      createdEntries[contentTypeUid] = [];
      
      // For singleton content types (hero_section, cta_section), only create first entry
      const entriesToCreate = (contentTypeUid === 'hero_section' || contentTypeUid === 'cta_section') 
        ? [entries[0]] 
        : entries;
      
      for (const entryData of entriesToCreate) {
        try {
          const entry = await createEntry(contentTypeUid, entryData);
          if (entry) {
            console.log(`  ✅ Created: ${entryData.title || entryData.menu_label || entryData.section_title || entryData.company_name || 'Entry'}`);
            createdEntries[contentTypeUid].push(entry);
          }
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('422')) {
            console.log(`  ⚠️  Entry might already exist, skipping...`);
          } else {
            console.error(`  ❌ Failed to create entry:`, error.message);
          }
        }
      }
      console.log('');
    }

    // Step 3: Publish all entries
    console.log('📤 Step 3: Publishing entries...\n');
    for (const [contentTypeUid, entries] of Object.entries(createdEntries)) {
      for (const entry of entries) {
        if (entry && entry.uid) {
          await publishEntry(contentTypeUid, entry.uid);
        }
      }
    }

    // Summary
    console.log('\n✅ Import completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Content Types Created: ${Object.keys(createdContentTypes).length}`);
    for (const [uid, entries] of Object.entries(createdEntries)) {
      console.log(`   ${uid}: ${entries.length} entries`);
    }
    console.log('\n💡 Next steps:');
    console.log('   1. Go to Contentstack and verify all content types and entries');
    console.log('   2. Add featured images to blog posts if needed');
    console.log('   3. Upload company logos if needed');
    console.log('   4. Update content as needed');
    console.log('   5. Refresh your website to see the new content');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { createContentType, createEntry, publishEntry };

