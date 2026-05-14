# Geo Map - Feature Overview

## 🗺️ Main Features

### 1. Statistics Dashboard (Top Section)
Four informative cards displaying:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  Total ATPs     │ Total Properties│ Coverage Radius │ Avg Properties  │
│  👥 152         │ 🏢 834          │ 📍 5 km        │ 🏠 5           │
│  Active coords  │ Assigned props  │ Per ATP zone    │ Per ATP         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 2. Interactive Google Map
Full-screen map with multiple layers:

```
┌──────────────────────────────────────────────────────────┐
│  [Refresh Button]                                Header  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│              🔵 ATP Marker (Blue Pin)                    │
│           ╱                        ╲                      │
│         ╱      5km Blue Circle       ╲                   │
│       ╱                                ╲                  │
│      │  🏠 Property (Green House Icon)  │                │
│      │  🏠 Property                      │                │
│       ╲  🏠 Property                    ╱                 │
│         ╲                              ╱                  │
│           ╲                          ╱                    │
│              5km Radius Circle                            │
│                                                           │
│  [Standard Google Maps Controls]                         │
└──────────────────────────────────────────────────────────┘
```

### 3. ATP Marker Details (Click to View)
When clicking an ATP marker, an info window appears:

```
┌─────────────────────────────────────┐
│  👤 [Avatar]  Rajesh Kumar          │
│               ATP-00003             │
├─────────────────────────────────────┤
│  📍 Location                        │
│     Mumbai, Maharashtra             │
│                                     │
│  🏢 Assigned Properties             │
│     3 Properties                    │
│                                     │
│  Properties:                        │
│  🏠 Green Valley Homestay           │
│  🏠 Beach Resort Villa              │
│  🏠 Mountain View Lodge             │
└─────────────────────────────────────┘
```

## 🎨 Color Coding

### ATP Elements (Blue Theme)
- **Markers**: Blue pin icon (#3b82f6)
- **Circle Border**: Blue solid line (#3b82f6)
- **Circle Fill**: Semi-transparent blue (15% opacity)

### Property Elements (Green Theme)
- **Markers**: Green house icon (#10b981)
- **Highlight**: Green accent on hover

### UI Elements
- **Cards**: White background with subtle shadows
- **Stats Icons**: Color-coded circles (Blue, Emerald, Purple, Amber)
- **Badges**: Secondary style for ATP UUIDs

## 🔧 User Interactions

### Map Interactions
1. **Pan**: Click and drag to move the map
2. **Zoom**: Scroll wheel or +/- buttons
3. **Click ATP Marker**: Opens info window with details
4. **Click Property Marker**: Shows property name tooltip
5. **Close Info Window**: Click X button or elsewhere on map

### Header Actions
1. **Refresh Button**: Reloads all data from API
   - Shows spinning icon while loading
   - Updates map markers and statistics

## 📱 Responsive Behavior

### Desktop (>1024px)
```
┌────────────────────────────────────────┐
│ [Stats Cards in Row - 4 cards]        │
├────────────────────────────────────────┤
│                                        │
│          [Full Map View]               │
│                                        │
└────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────┐
│ [Stats - 2x2 Grid]   │
├──────────────────────┤
│                      │
│   [Map View]         │
│                      │
└──────────────────────┘
```

### Mobile (<768px)
```
┌────────────┐
│ [Stat 1]   │
│ [Stat 2]   │
│ [Stat 3]   │
│ [Stat 4]   │
├────────────┤
│            │
│  [Map]     │
│            │
└────────────┘
```

## 🎯 Visual Indicators

### Loading State
```
┌──────────────────────┐
│                      │
│    ⟳  Spinning       │
│    Loading map...    │
│                      │
└──────────────────────┘
```

### Error State
```
┌──────────────────────┐
│        ⚠️           │
│  Error Loading Data  │
│  [Error Message]     │
│                      │
│  [Try Again Button]  │
└──────────────────────┘
```

### No API Key State
```
┌──────────────────────┐
│        ⚠️           │
│   API Key Missing    │
│   [Instructions]     │
└──────────────────────┘
```

## 🗂️ Data Flow

```
User Opens Page
     ↓
Component Mounts
     ↓
fetchGeoMapData()
     ↓
API Call: POST /api/v1/users/geo-map
     ↓
Response Received
     ↓
Parse ATP Data
     ↓
Update State (atps, loading, error)
     ↓
Render Map with Markers
     ↓
User Clicks ATP Marker
     ↓
Show Info Window
     ↓
Display ATP Details & Properties
```

## 📊 Data Structure

### ATP Object
```typescript
{
  id: number
  full_name: string
  atp_uuid: string
  latitude: number        // Required for marker
  longitude: number       // Required for marker
  city: string
  state: string
  properties: Property[]  // Array of assigned properties
}
```

### Property Object
```typescript
{
  id: number
  property_name: string
  latitude: number        // Required for marker
  longitude: number       // Required for marker
  address: string
}
```

## 🎭 Marker Icons

### ATP Marker (Custom SVG)
- Path: Location pin with circle
- Size: 1.5x scale
- Color: Blue (#3b82f6)
- Border: White (2px)
- Anchor: Bottom center

### Property Marker (Custom SVG)
- Path: House/home icon
- Size: 1.2x scale
- Color: Green (#10b981)
- Border: White (2px)
- Anchor: Bottom center

## 🔄 Auto-Centering

When data loads:
1. If ATPs exist → Center on first ATP
2. Zoom level → 7 (city view)
3. If no ATPs → Default center (India center, zoom 5)

When ATP marker clicked:
1. Center on clicked ATP
2. Zoom level → 12 (street view)
3. Open info window

## 💡 Tips for Best Experience

1. **API Key Setup**: Ensure valid Google Maps API key is configured
2. **Network**: Stable internet connection for map tiles
3. **Zoom Level**: Use zoom 10-14 for best radius visualization
4. **Info Windows**: Click outside to close and see full map
5. **Multiple ATPs**: Pan and zoom to explore different regions
6. **Refresh**: Use refresh button if data seems stale

## 🚀 Performance Features

- **Lazy Loading**: Map tiles load on-demand
- **Vector Markers**: SVG markers scale without quality loss
- **Efficient Rendering**: Only visible markers rendered at extreme zoom
- **Smooth Animations**: Hardware-accelerated map movements
- **Memory Management**: Info windows created on-demand

## 🎨 Customization Examples

### Change Radius Size
```typescript
const RADIUS_METERS = 3000 // 3km instead of 5km
```

### Change Circle Opacity
```typescript
fillOpacity={0.25} // More visible (was 0.15)
```

### Change ATP Marker Color to Red
```typescript
fillColor: "#ef4444" // Red instead of blue
```

### Change Property Marker Color to Purple
```typescript
fillColor: "#a855f7" // Purple instead of green
```

## 📋 Checklist for Deployment

- [ ] Google Maps API key configured
- [ ] API endpoint accessible
- [ ] Valid ATP data with coordinates
- [ ] Property data with coordinates (optional)
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Loading states working
- [ ] Info windows functional
- [ ] Statistics calculations correct
