const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  console.log('Loaded environment variables from .env file');
} catch (e) {
  console.log('dotenv not available, using process.env directly (Contentstack Launch mode)');
}

const envVars = {
  CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY || '',
  CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT || 'development',
  CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION || 'us'
};

const scriptContent = `
window.CONTENTSTACK_API_KEY = '${envVars.CONTENTSTACK_API_KEY}';
window.CONTENTSTACK_DELIVERY_TOKEN = '${envVars.CONTENTSTACK_DELIVERY_TOKEN}';
window.CONTENTSTACK_ENVIRONMENT = '${envVars.CONTENTSTACK_ENVIRONMENT}';
window.CONTENTSTACK_REGION = '${envVars.CONTENTSTACK_REGION}';
`;

const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

const scriptTag = `<script>${scriptContent}</script>`;
const insertPoint = htmlContent.indexOf('</head>');

if (insertPoint !== -1) {
  htmlContent = htmlContent.slice(0, insertPoint) + scriptTag + '\n    ' + htmlContent.slice(insertPoint);
  fs.writeFileSync(indexPath, htmlContent, 'utf8');
  console.log('Environment variables injected into index.html');
} else {
  console.error('Could not find </head> tag in index.html');
  process.exit(1);
}

