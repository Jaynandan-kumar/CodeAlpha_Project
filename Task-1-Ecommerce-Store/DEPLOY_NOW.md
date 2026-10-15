# 🚀 DEPLOYMENT GUIDE - ShopVerse E-commerce

## ⚠️ IMPORTANT: I Cannot Deploy For You

I don't have access to your Vercel account or deployment credentials. **You need to deploy the application yourself.** But don't worry - I've prepared everything and will guide you step-by-step!

---

## ✅ WHAT I'VE DONE FOR YOU

1. ✅ Configured your MongoDB database connection
2. ✅ Updated backend configuration
3. ✅ Created `.env` file with your database URL
4. ✅ Prepared all deployment files
5. ✅ Created this step-by-step guide

---

## 📋 PREREQUISITES

Before deploying, make sure you have:

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Vercel account (free): https://vercel.com/signup
- [ ] Your code pushed to GitHub

---

## 🔐 SECURITY WARNING

**Your MongoDB credentials are in `backend/.env`**

⚠️ **IMPORTANT:**
- The `.env` file is in `.gitignore` - it won't be pushed to GitHub
- **Change your MongoDB password** after deployment
- Never share your `.env` file publicly
- Use environment variables in Vercel dashboard

---

## 🗄️ YOUR DATABASE IS READY

I've configured your MongoDB database:
- **Database Name:** shopverse
- **Connection:** Configured in `backend/.env`
- **Status:** Ready to use

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Test Locally First

Before deploying, test everything locally:

```bash
# Navigate to backend
cd backend

# Install dependencies (if not done)
npm install

# Seed the database with products
npm run seed

# Start the backend server
npm run dev
```

The backend should start on `http://localhost:5000`

**Test the API:**
Open browser: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "..."
}
```

**Stop the server:** Press `Ctrl+C`

---

### Step 2: Push Code to GitHub

Make sure all your code is pushed to GitHub:

```bash
# In your project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

### Step 3: Deploy Backend to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository: `CodeAlpha_Project`
4. Configure:
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
5. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to backend
cd backend

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name? **shopverse-backend** (or press Enter)
- Directory? **./  (press Enter)**
- Override settings? **N**

---

### Step 4: Configure Backend Environment Variables

After deployment, you need to set environment variables in Vercel:

1. Go to your Vercel Dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://rajankumar08889_db_user:PAThsKFesV9uvLQ0@cluster0.9uuom02.mongodb.net/shopverse?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your_super_secret_jwt_key_change_this_to_something_random_and_long` |
| `NODE_ENV` | `production` |

**Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`

5. Click "Save"
6. **Redeploy:** Go to Deployments → Click "Redeploy" on the latest deployment

---

### Step 5: Get Backend URL

After deployment, Vercel will give you a URL like:
```
https://shopverse-backend.vercel.app
```

**Copy this URL** - you'll need it for the frontend!

**Test your backend:**
```
https://shopverse-backend.vercel.app/api/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "..."
}
```

---

### Step 6: Deploy Frontend to Vercel

**Option A: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository: `CodeAlpha_Project`
4. Configure:
   - **Root Directory:** `./` (root of the project)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
5. **Before clicking Deploy**, add environment variable:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://shopverse-backend.vercel.app` (your backend URL)
6. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Navigate to project root
cd ..

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name? **shopverse-frontend** (or press Enter)
- Directory? **./  (press Enter)**
- Override settings? **N**

**Add environment variable:**
```bash
vercel env add VITE_API_URL
```
Paste your backend URL when prompted.

**Deploy to production:**
```bash
vercel --prod
```

---

### Step 7: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Add or update:
   - `FRONTEND_URL` = `https://shopverse-frontend.vercel.app` (your frontend URL)
3. Click "Save"
4. **Redeploy backend:** Go to Deployments → Click "Redeploy"

---

### Step 8: Seed the Database

Your database is empty! You need to add products.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Navigate to backend
cd backend

# Run seed script on production
vercel env pull .env.production  # Pull production env vars
node seed/seedProducts.js
```

**Option B: Create a Seed Endpoint**

I'll add a temporary seed endpoint to your backend:

Add this to `backend/server.js` (before the routes):

```javascript
// Temporary seed endpoint (REMOVE AFTER SEEDING)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/seed', async (req, res) => {
    try {
      const Product = require('./models/Product');
      const products = require('./seed/seedProducts');
      
      await Product.deleteMany({});
      await Product.insertMany(products);
      
      res.json({ 
        success: true, 
        message: `Seeded ${products.length} products` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });
}
```

Then visit: `https://shopverse-backend.vercel.app/api/seed`

**⚠️ REMOVE THIS ENDPOINT AFTER SEEDING!**

---

### Step 9: Test Your Live Application

**Frontend URL:** `https://shopverse-frontend.vercel.app`
**Backend URL:** `https://shopverse-backend.vercel.app`

**Test Checklist:**
- [ ] Homepage loads
- [ ] Products display
- [ ] Search works
- [ ] Register new user
- [ ] Login works
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Order history displays

---

## 🎯 QUICK DEPLOYMENT CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set (MONGO_URI, JWT_SECRET, NODE_ENV)
- [ ] Backend health check works
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] Backend CORS updated with frontend URL
- [ ] Database seeded with products
- [ ] All features tested

---

## 🐛 TROUBLESHOOTING

### Backend returns 500 error
**Solution:**
- Check MongoDB connection string in environment variables
- Verify MongoDB Atlas IP whitelist includes all IPs (0.0.0.0/0)
- Check Vercel function logs

### Frontend can't connect to backend
**Solution:**
- Verify `VITE_API_URL` is set correctly
- Check backend CORS allows your frontend URL
- Redeploy both after changes

### Database is empty
**Solution:**
- Run the seed script
- Check MongoDB Atlas dashboard to verify data

### CORS errors
**Solution:**
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend
- Clear browser cache

---

## 📞 NEED HELP?

If you get stuck:

1. Check Vercel deployment logs
2. Check MongoDB Atlas connection status
3. Review environment variables
4. Test backend API directly: `https://your-backend.vercel.app/api/health`

---

## 🎉 YOU'RE DONE!

Once everything is working:

1. **Record a demo video** showing your live application
2. **Update your README** with live URLs
3. **Share on LinkedIn** with your project link
4. **Submit to CodeAlpha**

---

## 📝 IMPORTANT REMINDERS

1. **Change your MongoDB password** after deployment
2. **Never commit `.env` files** to GitHub
3. **Keep your JWT_SECRET secure**
4. **Monitor your MongoDB Atlas usage** (free tier has limits)
5. **Remove the seed endpoint** after seeding (if you added it)

---

## 🔗 USEFUL LINKS

- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://www.mongodb.com/docs/

---

**Good luck with your deployment! 🚀**

You've got this! The hard work is done - now just follow the steps and you'll have your app live in minutes!
