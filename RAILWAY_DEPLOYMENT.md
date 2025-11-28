# Railway Deployment Guide

এই guide টি আপনাকে AMIN TOUCH Staff Management System কে Railway এ deploy করতে সাহায্য করবে।

## Prerequisites

1. **Railway Account** - https://railway.app এ account create করুন
2. **GitHub Repository** - Code already pushed: https://github.com/mdronytalukder42/amin-touch-staff-managment-last-project
3. **Environment Variables** - নিচের variables গুলো প্রয়োজন

## Step-by-Step Deployment

### Step 1: Railway এ Login করুন
- https://railway.app এ যান
- আপনার GitHub account দিয়ে login করুন

### Step 2: New Project Create করুন
- Dashboard এ "New Project" button click করুন
- "Deploy from GitHub repo" select করুন

### Step 3: GitHub Repository Connect করুন
- `amin-touch-staff-managment-last-project` repository select করুন
- Authorize Railway to access your GitHub

### Step 4: Environment Variables Set করুন
Railway dashboard এ এই variables গুলো add করুন:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_here
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_APP_TITLE=AMIN TOUCH Staff Management
VITE_APP_LOGO=/logo.png
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
NODE_ENV=production
```

### Step 5: Database Setup করুন
Railway এ MySQL database add করুন:
- New Service → Database → MySQL select করুন
- DATABASE_URL automatically set হয়ে যাবে

### Step 6: Deploy করুন
- "Deploy" button click করুন
- Build complete হওয়ার জন্য অপেক্ষা করুন (5-10 minutes)
- Deployment successful হলে public URL পাবেন

### Step 7: Database Migration চালান
Deployment এর পর database migration করতে হবে:
```bash
npm run db:push
```

## Important Notes

1. **Environment Variables** - সব variables সঠিকভাবে set করুন, নাহলে app কাজ করবে না
2. **Database** - MySQL database must be configured
3. **Build Time** - প্রথমবার build 10-15 minutes লাগতে পারে
4. **Logs** - কোনো error হলে Railway dashboard এর logs section check করুন

## Troubleshooting

### Build Failed
- Check logs in Railway dashboard
- Ensure all dependencies are installed
- Verify Node.js version compatibility

### Database Connection Error
- DATABASE_URL সঠিকভাবে set করা আছে কি check করুন
- MySQL service running আছে কি verify করুন

### Environment Variables Missing
- Railway dashboard এ সব required variables add করেছেন কি check করুন
- Variable names exactly match করছে কি verify করুন

## Support

কোনো সমস্যা হলে:
1. Railway documentation check করুন: https://docs.railway.app
2. GitHub repository এ issue create করুন
3. Logs carefully read করুন

Happy Deploying! 🚀
