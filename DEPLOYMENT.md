# Deployment Guide for Qmaker

## Quick Deploy Options

### 1. Deploy to Vercel (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/himanshu-hivecorp/qmaker)

1. Click the button above
2. Connect your GitHub account
3. Click "Deploy"
4. Your app will be live in 2 minutes!

### 2. Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/himanshu-hivecorp/qmaker)

1. Click the button above
2. Connect your GitHub account
3. Configure build settings (already set)
4. Deploy!

### 3. Deploy to Caprover

Create a `captain-definition` file in your project root:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM node:18-alpine AS builder",
    "WORKDIR /app",
    "COPY package*.json ./",
    "RUN npm install --legacy-peer-deps",
    "COPY . .",
    "ENV CI=false",
    "RUN npm run build",
    "FROM node:18-alpine",
    "WORKDIR /app",
    "RUN npm install -g serve",
    "COPY --from=builder /app/build ./build",
    "EXPOSE 3000",
    "CMD [\"serve\", \"-s\", \"build\", \"-p\", \"3000\"]"
  ]
}
```

Then deploy:
1. Create app in Caprover dashboard
2. Set Container HTTP Port to 3000
3. Deploy using Git or upload tar

### 4. Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

3. Update homepage in package.json:
```json
"homepage": "https://yourusername.github.io/qmaker"
```

4. Deploy:
```bash
npm run deploy
```

### 5. Deploy to Any Static Host

1. Build the project:
```bash
npm install
npm run build
```

2. Upload the `build` folder to your hosting service

### 6. Deploy with Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t qmaker .
docker run -p 80:80 qmaker
```

## Environment Variables

No environment variables required! The app works out of the box.

## Important Notes

- The app uses localStorage for data persistence (no backend required)
- All features work client-side only
- No API keys or configuration needed
- Fully static deployment supported

## Troubleshooting

### Blank page after deployment
- Check browser console for errors
- Ensure `homepage` in package.json is set correctly:
  - For root domain: `"."`
  - For subdirectory: `"/subdirectory"`
  - For GitHub Pages: `"https://username.github.io/qmaker"`

### 404 errors on routes
- Configure your server to serve index.html for all routes
- For nginx, use try_files directive
- For Apache, use .htaccess with rewrite rules

### Build fails
- Use `npm install --legacy-peer-deps` if you get dependency errors
- Set `CI=false` environment variable to ignore warnings

## Support

For issues or questions, please open an issue on [GitHub](https://github.com/himanshu-hivecorp/qmaker/issues)