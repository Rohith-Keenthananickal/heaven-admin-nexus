# 🚀 Geo Map - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Get Google Maps API Key (2 minutes)
1. Visit: https://console.cloud.google.com/google/maps-apis
2. Create/select a project
3. Enable "Maps JavaScript API"
4. Go to Credentials → Create API Key
5. Copy the API key

### Step 2: Configure Environment (30 seconds)
Create `.env` file in project root:
```bash
VITE_GOOGLE_MAPS_API_KEY=paste_your_key_here
```

### Step 3: Restart Server (30 seconds)
```bash
npm run dev
```

### Step 4: Navigate to Geo Map
1. Open app in browser
2. Click "ATP" in sidebar
3. Click "Geo Map"

## ✅ You Should See:
- 4 statistics cards at the top
- Interactive Google Map
- Blue circles (5km radius) for each ATP
- Blue markers for ATPs
- Green markers for properties

## 🎯 Quick Test
1. **Click any blue ATP marker** → Info window appears
2. **View ATP details** → Name, location, properties listed
3. **Pan the map** → Click and drag
4. **Zoom in/out** → Scroll wheel or +/- buttons
5. **Click Refresh** → Data reloads

## 🐛 Troubleshooting

### "API Key Missing" Error
```bash
# Check .env file exists
ls -la .env

# Verify content
cat .env
# Should show: VITE_GOOGLE_MAPS_API_KEY=your_key

# Restart dev server
npm run dev
```

### Map Not Loading
1. Check browser console (F12)
2. Verify API key is valid
3. Ensure "Maps JavaScript API" is enabled
4. Check internet connection

### No Markers Visible
1. Check API response in Network tab (F12)
2. Verify ATPs have valid latitude/longitude
3. Try zooming out to see full map

## 📱 Access Points

### Via Navigation
```
Sidebar → ATP → Geo Map
```

### Direct URL
```
http://localhost:5173/geo-map
```

## 🎨 What You'll See

### Statistics Cards (Top)
- **Blue Card**: Total ATPs (e.g., 152)
- **Green Card**: Total Properties (e.g., 834)
- **Purple Card**: Coverage Radius (5 km)
- **Amber Card**: Average Properties (e.g., 5 per ATP)

### Map Features
- **Blue Circles**: 5km coverage areas
- **Blue Pins**: ATP locations (click for details)
- **Green Houses**: Property locations
- **Info Window**: Detailed ATP information

### Controls
- **Refresh Button**: Top-right header
- **Zoom Controls**: Right side of map
- **Street View**: Bottom-right corner (drag pegman)
- **Fullscreen**: Top-right of map

## 💡 Pro Tips

1. **Zoom Level 12** is best for viewing individual ATPs
2. **Click markers** to see details instead of hovering
3. **Use refresh** if data seems outdated
4. **Pan before zooming** to find specific regions
5. **Close info windows** by clicking X or map area

## 📊 Expected Data

The map displays:
- All active ATPs with valid coordinates
- Properties assigned to each ATP
- 5km radius circles centered on each ATP
- Statistics aggregated from all ATPs

## 🔄 Data Refresh

The map automatically loads data on:
- Initial page load
- Clicking Refresh button

Data fetched from:
```
POST /api/v1/users/geo-map
{ "limit": 500, "active_only": true }
```

## 📞 Need Help?

1. Check `GEO_MAP_SETUP.md` for detailed setup
2. Review `GEO_MAP_FEATURES.md` for feature details
3. See `IMPLEMENTATION_SUMMARY.md` for technical info

## ✨ That's It!

You now have a fully functional geo map showing:
- ✅ ATP locations with 5km coverage circles
- ✅ Property markers within ATP zones
- ✅ Interactive info windows
- ✅ Real-time statistics
- ✅ Refresh capability

Enjoy exploring your ATPs on the map! 🗺️
