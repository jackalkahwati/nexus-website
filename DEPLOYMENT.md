# NEXUS FAMILY - Website Deployment

This repository contains the Nexus Family website that automatically deploys to Cloudflare Pages.

## 🌐 Live Website
- **Production**: https://nexus-family.pages.dev
- **Local Development**: http://localhost:8090

## 🚀 Automatic Deployment

This repository is connected to Cloudflare Pages for automatic deployment:

1. **Push to main branch** → Triggers automatic build and deployment
2. **Pull requests** → Creates preview deployments
3. **Cloudflare handles** → Building, caching, and global distribution

## 📁 Project Structure

```
/
├── index.html          # Homepage
├── css/               # Stylesheets
├── js/                # JavaScript files
├── images/            # Image assets
├── pages/             # Additional pages
├── api-docs/          # API documentation
└── package.json       # Dependencies
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local server
npx serve -s . -p 8090

# View at http://localhost:8090
```

## ✅ Features

- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Optimized assets and CDN delivery
- **SEO Optimized**: Meta tags and structured data
- **Modern UI**: Clean, professional design
- **Account Integration**: Links to dashboard at localhost:3001

## 🔗 Routing

The website includes buttons that route to the Nexus dashboard:
- "Go to account" buttons → `http://localhost:3001/signup`
- Seamless integration with the full Nexus platform

## 📊 Analytics

Cloudflare automatically provides:
- Traffic analytics
- Performance metrics
- Security insights
- Global request distribution

---

**Last Updated**: $(date)  
**Deployment Status**: 🟢 Automatic via Cloudflare Pages 