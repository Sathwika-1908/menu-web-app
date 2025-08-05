# Menu Web App - Deployment Guide

## 🚀 **Deployment Options**

### **Option 1: Firebase Hosting (Recommended)**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting:**
   ```bash
   firebase init hosting
   ```
   - Select your project: `the-house-of-tovio`
   - Public directory: `build`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build the app:**
   ```bash
   yarn build
   ```

5. **Deploy:**
   ```bash
   firebase deploy
   ```

### **Option 2: Netlify**

1. **Build the app:**
   ```bash
   yarn build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `build` folder to [Netlify](https://netlify.com)
   - Or connect your GitHub repository for automatic deployments

### **Option 3: Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### **Option 4: GitHub Pages**

1. **Add homepage to package.json:**
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

2. **Install gh-pages:**
   ```bash
   yarn add --dev gh-pages
   ```

3. **Add deploy scripts to package.json:**
   ```json
   "scripts": {
     "predeploy": "yarn build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy:**
   ```bash
   yarn deploy
   ```

## 🔧 **Environment Setup**

### **Firebase Configuration**
Make sure your Firebase configuration in `src/firebase.ts` is correct for production:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAE3ewoDEKKZW6PfLq9VWr0qYMkhsWavHc",
  authDomain: "the-house-of-tovio.firebaseapp.com",
  databaseURL: "https://the-house-of-tovio-default-rtdb.firebaseio.com",
  projectId: "the-house-of-tovio",
  storageBucket: "the-house-of-tovio.firebasestorage.app",
  messagingSenderId: "638466303348",
  appId: "1:638466303348:web:f5de324f3f722f71cd7821",
  measurementId: "G-P2664PCGB5"
};
```

### **Firebase Realtime Database Rules**
Ensure your database rules allow read/write access:

```json
{
  "rules": {
    "menuItems": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 📁 **Project Structure**
```
menu-web-app-public/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── firebase.ts
│   └── index.tsx
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🛠 **Local Development**

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start development server:**
   ```bash
   yarn start
   ```

3. **Build for production:**
   ```bash
   yarn build
   ```

## 🔒 **Security Considerations**

- **Firebase Rules:** Configure proper security rules for production
- **API Keys:** Consider using environment variables for sensitive data
- **HTTPS:** Ensure your hosting provider supports HTTPS
- **CORS:** Configure CORS settings if needed

## 📊 **Performance Optimization**

- **Code Splitting:** React Router DOM provides automatic code splitting
- **Image Optimization:** Use optimized images and consider lazy loading
- **Bundle Analysis:** Use `yarn build --analyze` to analyze bundle size
- **Caching:** Configure proper caching headers for static assets

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Build fails:** Check for TypeScript errors
2. **Firebase connection issues:** Verify Firebase configuration
3. **Routing issues:** Ensure hosting provider supports SPA routing
4. **Styling issues:** Verify Tailwind CSS is properly configured

### **Debug Commands:**
```bash
# Check for TypeScript errors
yarn tsc --noEmit

# Analyze bundle
yarn build --analyze

# Test production build locally
npx serve -s build
``` 