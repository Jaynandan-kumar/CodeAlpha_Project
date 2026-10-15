# 🚀 VERCEL DEPLOYMENT GUIDE
## ShopVerse E-commerce Platform

**GitHub Repository:** https://github.com/Jaynandan-kumar/CodeAlpha_Project

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Prerequisites
- [ ] GitHub repository created and code pushed
- [ ] Vercel account created (https://vercel.com)
- [ ] MongoDB Atlas cluster created (https://cloud.mongodb.com)
- [ ] Node.js 18+ installed locally
- [ ] npm or yarn installed

---

## 🎯 DEPLOYMENT ARCHITECTURE

### Frontend (Static Site)
- **Framework:** React + Vite + TypeScript
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Deployment:** Vercel Static Hosting
- **URL:** `https://shopverse-frontend.vercel.app` (example)

### Backend (Serverless Functions)
- **Framework:** Express.js + MongoDB
- **Runtime:** Node.js 18+
- **Deployment:** Vercel Functions
- **URL:** `https://shopverse-backend.vercel.app` (example)
- **Database:** MongoDB Atlas

---

## 🗄️ PHASE 1: MONGODB ATLAS SETUP

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com
2. Sign up for a free account
3. Create a new project named "ShopVerse"

### Step 2: Create Cluster
1. Click "Build a Database"
2. Select **M0 Free Tier** (shared cluster)
3. Choose cloud provider & region closest to your users
   - Recommended: AWS Mumbai (ap-south-1) for India
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Set credentials:
   - **Username:** `shopverse_admin`
   - **Password:** (generate a strong password - SAVE THIS!)
   - **Role:** "Read and write to any database"
4. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
   - For Vercel, use 0.0.0.0/0 (serverless IPs change)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → Click "Connect"
2. Select "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://shopverse_admin:<password>@cluster0.xxxxx.mongodb.net/shopverse?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. **SAVE THIS CONNECTION STRING** (you'll need it for Vercel)

---

## 🔧 PHASE 2: ENVIRONMENT VARIABLES

### Required Environment Variables

**Backend (.env):**
```env
# MongoDB Connection (REQUIRED)
MONGO_URI=mongodb+srv://shopverse_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shopverse?retryWrites=true&w=majority

# JWT Secret (REQUIRED - Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Frontend URL (for CORS)
FRONTEND_URL=https://shopverse-frontend.vercel.app

# Environment
NODE_ENV=production
PORT=5000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 PHASE 3: DEPLOY BACKEND TO VERCEL

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the authentication prompts.

### Step 3: Navigate to Backend Directory
```bash
cd backend
```

### Step 4: Deploy Backend
```bash
vercel
```

**First Deployment (Development):**
- Press Enter for all prompts (accept defaults)
- Vercel will create a project and deploy

**Production Deployment:**
```bash
vercel --prod
```

### Step 5: Set Environment Variables
After deployment, Vercel will provide a URL like:
```
https://shopverse-backend.vercel.app
```

**Set Environment Variables via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your backend project
3. Go to "Settings" → "Environment Variables"
4. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://shopverse_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shopverse` | Production |
| `JWT_SECRET` | (your generated secret) | Production |
| `FRONTEND_URL` | `https://shopverse-frontend.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

### Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```

### Step 7: Verify Backend Deployment
Test the health endpoint:
```bash
curl https://shopverse-backend.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

---

## 🎨 PHASE 4: DEPLOY FRONTEND TO VERCEL

### Step 1: Navigate to Project Root
```bash
cd ..
```

### Step 2: Deploy Frontend
```bash
vercel
```

**First Deployment:**
- Accept defaults
- Vercel will detect Vite and configure automatically

**Production Deployment:**
```bash
vercel --prod
```

### Step 3: Get Frontend URL
Vercel will provide a URL like:
```
https://shopverse-frontend.vercel.app
```

### Step 4: Update Backend CORS
1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL=https://shopverse-frontend.vercel.app
   ```
3. Redeploy backend:
   ```bash
   cd backend
   vercel --prod
   ```

---

## ✅ PHASE 5: VERIFICATION

### Test Frontend
1. Open your frontend URL in browser
2. Verify homepage loads
3. Check product listing
4. Test search functionality
5. Test filtering and sorting

### Test Backend API
```bash
# Health check
curl https://shopverse-backend.vercel.app/api/health

# Get products
curl https://shopverse-backend.vercel.app/api/products

# Register user
curl -X POST https://shopverse-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Full Integration
1. Register a new account on frontend
2. Login with credentials
3. Add products to cart
4. Complete checkout
5. View order history

---

## 🔍 PHASE 6: TROUBLESHOOTING

### Issue: Backend returns 500 error
**Solution:**
1. Check Vercel function logs:
   ```bash
   vercel logs https://shopverse-backend.vercel.app
   ```
2. Verify MongoDB connection string
3. Check environment variables are set correctly
4. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Issue: CORS errors in browser console
**Solution:**
1. Verify `FRONTEND_URL` environment variable matches your frontend URL exactly
2. Redeploy backend after updating environment variable
3. Clear browser cache and retry

### Issue: MongoDB connection timeout
**Solution:**
1. Check MongoDB Atlas cluster is running
2. Verify connection string is correct
3. Check network access whitelist
4. Try increasing `serverSelectionTimeoutMS` in db.js

### Issue: Frontend shows old data after deployment
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Check Vercel deployment logs

---

## 📊 DEPLOYMENT VERIFICATION CHECKLIST

### Frontend
- [ ] Homepage loads without errors
- [ ] Product listing displays 102 products
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Price range filtering works
- [ ] Sorting works
- [ ] Product detail page loads
- [ ] Add to cart works
- [ ] Cart page displays items
- [ ] Checkout flow works
- [ ] Order success page displays
- [ ] Order history shows orders
- [ ] Wishlist functionality works
- [ ] Login/Register works
- [ ] Responsive design works on mobile
- [ ] Animations play smoothly

### Backend
- [ ] Health endpoint returns 200 OK
- [ ] Products API returns product list
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated
- [ ] Protected routes require authentication
- [ ] Cart operations work
- [ ] Order creation works
- [ ] MongoDB connection is stable
- [ ] Rate limiting is active
- [ ] CORS allows frontend origin
- [ ] No secrets exposed in responses

### Database
- [ ] MongoDB Atlas cluster is running
- [ ] Database user has correct permissions
- [ ] Connection string is correct
- [ ] IP whitelist allows Vercel
- [ ] Data persists across deployments
- [ ] Seed data is loaded (if needed)

---

## 🔐 SECURITY VERIFICATION

### Environment Variables
- [ ] `MONGO_URI` is set and not exposed in frontend
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] `FRONTEND_URL` matches actual frontend URL
- [ ] No secrets in frontend bundle
- [ ] `.env` files are in `.gitignore`

### API Security
- [ ] Helmet headers are active
- [ ] CORS restricts to frontend origin only
- [ ] Rate limiting is configured
- [ ] JWT tokens have expiry
- [ ] Passwords are hashed with bcrypt
- [ ] Protected routes require authentication
- [ ] Order ownership is verified
- [ ] No sensitive data in API responses

---

## 📝 PRODUCTION URLS

After successful deployment, you'll have:

**Frontend:**
```
https://shopverse-frontend.vercel.app
```

**Backend:**
```
https://shopverse-backend.vercel.app
```

**Backend API Endpoints:**
```
GET  https://shopverse-backend.vercel.app/api/health
GET  https://shopverse-backend.vercel.app/api/products
POST https://shopverse-backend.vercel.app/api/auth/register
POST https://shopverse-backend.vercel.app/api/auth/login
GET  https://shopverse-backend.vercel.app/api/cart
POST https://shopverse-backend.vercel.app/api/orders
```

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Record Demo Video**
   - Follow `DEMO_SCRIPT.md`
   - Show production URLs
   - Demonstrate all features

2. **Update README**
   - Add production URLs
   - Add deployment screenshots
   - Update setup instructions

3. **Share on LinkedIn**
   - Post demo video
   - Include GitHub repo link
   - Include production URLs
   - Tag CodeAlpha

4. **Submit to CodeAlpha**
   - Fill submission form
   - Add GitHub repo link
   - Add LinkedIn post link
   - Add production URLs

5. **Monitor Deployment**
   - Check Vercel dashboard regularly
   - Monitor function logs
   - Watch for errors
   - Track performance

---

## 🆘 SUPPORT & RESOURCES

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/cli

### MongoDB Atlas Documentation
- https://www.mongodb.com/docs/atlas/

### Common Issues
- Vercel Functions timeout: Increase timeout in vercel.json
- MongoDB connection issues: Check network access
- CORS errors: Verify FRONTEND_URL environment variable

---

## ✅ DEPLOYMENT COMPLETE

Once all verification steps pass, your ShopVerse e-commerce platform is live!

**Congratulations! Your project is now production-ready!** 🎉

---

*Deployment guide created for CodeAlpha Full Stack Development Internship*
