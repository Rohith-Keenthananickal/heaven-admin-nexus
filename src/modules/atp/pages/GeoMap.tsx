import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { Button } from "@/modules/shared/components/ui/button"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import { 
  MapPin, 
  Home, 
  Loader2, 
  RefreshCw, 
  Users, 
  Building2,
  AlertCircle,
  MapPinned
} from "lucide-react"
import { APIProvider, Map, Marker, Circle, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import AtpService from "../services/atp.service"
import { GeoMapATP, GeoMapProperty } from "../models/atp.models"
import { cn } from "@/modules/shared/lib/utils"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 } // Center of India
const RADIUS_METERS = 5000 // 5km

// Debug: Check API key on load
console.log("Google Maps API Key present:", !!GOOGLE_MAPS_API_KEY)
console.log("API Key length:", GOOGLE_MAPS_API_KEY?.length || 0)

interface SelectedMarker {
  atp: GeoMapATP
  position: { lat: number; lng: number }
}

interface MapContentProps {
  atps: GeoMapATP[]
  selectedMarker: SelectedMarker | null
  onMarkerClick: (atp: GeoMapATP) => void
  onCloseInfoWindow: () => void
}

function MapContent({ atps, selectedMarker, onMarkerClick, onCloseInfoWindow }: MapContentProps) {
  const map = useMap()

  return (
    <>
      {atps.map((atp) => {
        if (!atp.latitude || !atp.longitude) return null
        
        const position = { lat: atp.latitude, lng: atp.longitude }
        const hasProperties = atp.properties && atp.properties.length > 0

        return (
          <div key={atp.id}>
            {/* ATP Circle - 5km radius */}
            <Circle
              center={position}
              radius={RADIUS_METERS}
              strokeColor="#3b82f6"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#3b82f6"
              fillOpacity={0.15}
            />

            {/* ATP Marker */}
            <Marker
              position={position}
              onClick={() => {
                onMarkerClick(atp)
                // Pan to marker when clicked
                if (map) {
                  map.panTo(position)
                  map.setZoom(12)
                }
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                scale: 1.5,
                anchor: { x: 12, y: 22 } as google.maps.Point,
              }}
            />

            {/* Property Markers */}
            {hasProperties && atp.properties.map((property) => {
              if (!property.latitude || !property.longitude) return null
              
              const propPosition = { lat: property.latitude, lng: property.longitude }
              
              return (
                <Marker
                  key={property.id}
                  position={propPosition}
                  icon={{
                    path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                    fillColor: "#10b981",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: 1.2,
                    anchor: { x: 12, y: 24 } as google.maps.Point,
                  }}
                  title={property.property_name}
                />
              )
            })}
          </div>
        )
      })}

      {/* Info Window */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={onCloseInfoWindow}
        >
          <div className="p-3 min-w-[280px]">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedMarker.atp.profile_image} alt={selectedMarker.atp.full_name} />
                <AvatarFallback>
                  {selectedMarker.atp.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">{selectedMarker.atp.full_name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {selectedMarker.atp.atp_uuid}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium break-words">
                    {selectedMarker.atp.city}, {selectedMarker.atp.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Assigned Properties</p>
                  <p className="font-medium">
                    {selectedMarker.atp.properties.length} {selectedMarker.atp.properties.length === 1 ? 'Property' : 'Properties'}
                  </p>
                </div>
              </div>

              {selectedMarker.atp.properties.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Properties:</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {selectedMarker.atp.properties.map((prop) => (
                      <div key={prop.id} className="flex items-start gap-2 text-xs">
                        <Home className="h-3 w-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{prop.property_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export default function GeoMap() {
  const [atps, setAtps] = useState<GeoMapATP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  
  // Calculate map center based on first ATP or use default
  const mapCenter = atps.length > 0 && atps[0].latitude && atps[0].longitude
    ? { lat: atps[0].latitude, lng: atps[0].longitude }
    : DEFAULT_CENTER
  
  const mapZoom = atps.length > 0 ? 7 : 5

  useEffect(() => {
    fetchGeoMapData()
    
    // Listen for Google Maps errors
    window.addEventListener('error', (e) => {
      if (e.message && e.message.includes('Google Maps')) {
        console.error("Google Maps error:", e)
        setMapError(e.message)
      }
    })
  }, [])

  const fetchGeoMapData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("Fetching geo map data...")
      const response = await AtpService.getGeoMapData({
        limit: 500,
        active_only: true
      })

      console.log("Geo map response:", response)

      if (response.status === "success" && response.data) {
        console.log("ATPs loaded:", response.data.length)
        setAtps(response.data)
      } else {
        console.error("API returned error:", response)
        setError(response.message || "Failed to fetch geo map data")
      }
    } catch (err) {
      console.error("Error fetching geo map data:", err)
      setError("An error occurred while fetching geo map data")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkerClick = useCallback((atp: GeoMapATP) => {
    setSelectedMarker({
      atp,
      position: { lat: atp.latitude, lng: atp.longitude }
    })
  }, [])

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedMarker(null)
  }, [])

  const totalProperties = atps.reduce((sum, atp) => sum + atp.properties.length, 0)

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <DashboardLayout title="Geo Map">
        <div className="h-[calc(100vh-8.5rem)] flex items-center justify-center bg-white rounded-lg border shadow-sm">
          <div className="text-center space-y-4 p-8">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold">Google Maps API Key Missing</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables to enable the map.
            </p>
            <p className="text-xs text-muted-foreground">
              Make sure to restart the dev server after adding the environment variable.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Geo Map"
      action={
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchGeoMapData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 h-[calc(100vh-8.5rem)]">
        {/* Compact Stats Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border shadow-sm flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{atps.length}</div>
                <p className="text-xs text-muted-foreground">Total ATPs</p>
              </div>
            </div>

            <div className="h-10 w-px bg-border"></div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalProperties}</div>
                <p className="text-xs text-muted-foreground">Total Properties</p>
              </div>
            </div>

            <div className="h-10 w-px bg-border"></div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <MapPinned className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">5 km</div>
                <p className="text-xs text-muted-foreground">Coverage Radius</p>
              </div>
            </div>

            <div className="h-10 w-px bg-border"></div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Home className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {atps.length > 0 ? Math.round(totalProperties / atps.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Avg Properties</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Showing {atps.length} active coordinators</span>
          </div>
        </div>

        {/* Map Card */}
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden border shadow-lg bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Error Loading Data</h3>
                  <p className="text-sm text-muted-foreground mt-2">{error}</p>
                </div>
                <Button onClick={fetchGeoMapData} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : mapError ? (
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Map Loading Error</h3>
                  <p className="text-sm text-muted-foreground mt-2">{mapError}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please check that your Google Maps API key is valid and has the Maps JavaScript API enabled.
                  </p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            </div>
          ) : (
            <APIProvider 
              apiKey={GOOGLE_MAPS_API_KEY}
              onLoad={() => console.log("Maps API loaded")}
            >
              <Map
                defaultCenter={mapCenter}
                defaultZoom={mapZoom}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: "100%", height: "100%" }}
              >
                <MapContent
                  atps={atps}
                  selectedMarker={selectedMarker}
                  onMarkerClick={handleMarkerClick}
                  onCloseInfoWindow={handleCloseInfoWindow}
                />
              </Map>
            </APIProvider>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
