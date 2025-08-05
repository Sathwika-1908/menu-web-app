# 🍽️ Menu Web Application

A modern, real-time menu management system built with React, TypeScript, and Firebase Realtime Database.

## ✨ **Features**

- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Changes appear instantly across all devices
- **🔍 Search & Filter** - Find menu items quickly by name, ingredients, or category
- **📝 Rich Content** - Detailed ingredients, cooking instructions, and presentation guides
- **🏷️ Dietary Options** - Gluten-free and sugar-free indicators
- **💰 INR Pricing** - Indian Rupee currency support
- **🖼️ Image Support** - Add beautiful images to menu items
- **📊 Category Management** - Organize items by categories
- **✅ Availability Toggle** - Mark items as available/unavailable

## 🛠 **Tech Stack**

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Firebase Realtime Database
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Build Tool:** Create React App

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- Yarn package manager
- Firebase project with Realtime Database

### **Installation**

1. **Clone or download the project:**
   ```bash
   cd menu-web-app-public
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start development server:**
   ```bash
   yarn start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 **Project Structure**

```
menu-web-app-public/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   └── MenuCard.tsx
│   ├── pages/
│   │   ├── ViewMenu.tsx
│   │   ├── AddEditMenu.tsx
│   │   └── MenuDetail.tsx
│   ├── services/
│   │   └── menuService.ts
│   ├── types/
│   │   └── MenuItem.ts
│   ├── App.tsx
│   ├── firebase.ts
│   └── index.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── deploy.sh
├── DEPLOYMENT.md
└── README.md
```

## 🎯 **Usage**

### **Viewing Menu Items**
- Browse all menu items on the home page
- Use search to find specific items
- Filter by category
- Click "View" to see detailed information

### **Adding New Items**
1. Click "Add New Item" button
2. Fill in all required fields:
   - Name
   - Price (in INR)
   - Category
   - Ingredients
   - Cooking Instructions
   - How to Present
3. Add optional image URL
4. Set dietary options (Gluten Free, Sugar Free)
5. Click "Add Item"

### **Editing Items**
1. Click "Edit" on any menu card
2. Modify the information
3. Click "Update Item"

### **Deleting Items**
1. Click "Delete" on any menu card
2. Confirm the deletion

## 🔧 **Configuration**

### **Firebase Setup**
1. Create a Firebase project
2. Enable Realtime Database
3. Update `src/firebase.ts` with your configuration
4. Set up database rules:

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

## 🚀 **Deployment**

### **Quick Deployment**
```bash
./deploy.sh
```

### **Manual Deployment**
```bash
yarn build
```

Then deploy the `build` folder to your preferred hosting service.

### **Supported Platforms**
- ✅ Firebase Hosting
- ✅ Netlify
- ✅ Vercel
- ✅ GitHub Pages
- ✅ Any static hosting service

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📱 **Screenshots**

### **Main Menu View**
- Grid layout of menu items
- Search and filter functionality
- Dietary badges
- Quick action buttons

### **Add/Edit Form**
- Comprehensive form with all fields
- Real-time validation
- Image preview
- Dietary options

### **Detail View**
- Full item information
- Large image display
- Ingredients and instructions
- Presentation guide

## 🔒 **Security**

- Firebase Realtime Database rules control access
- No sensitive data stored in client-side code
- HTTPS enforced in production

## 📊 **Performance**

- Optimized bundle size (~106KB gzipped)
- Lazy loading for images
- Efficient real-time updates
- Responsive design for all devices

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Build fails:**
   ```bash
   yarn tsc --noEmit
   ```

2. **Firebase connection issues:**
   - Check Firebase configuration
   - Verify database rules
   - Check network connectivity

3. **Styling issues:**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

### **Debug Commands**
```bash
# Type checking
yarn tsc --noEmit

# Build analysis
yarn build --analyze

# Test production build
npx serve -s build
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 📞 **Support**

For support or questions:
- Check the troubleshooting section
- Review Firebase documentation
- Open an issue on GitHub

---

**Built with ❤️ using React, TypeScript, and Firebase** 