// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Layers,
  MapPin,
  Sparkles,
  Heart,
  Truck,
  Building2,
  Navigation,
  Globe,
  Camera,
  X,
  ExternalLink,
  RotateCw,
  Compass,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Eye,
} from 'lucide-react';
import { FoodListing, NGO, Volunteer, PickupRecord } from '../../types';
import { useFoodBridge } from '../../hooks/useFoodBridge';
import { toLatLng } from '../../data/initialData';
import { InteractiveMap } from './InteractiveMap';

interface GoogleMapViewProps {
  listings?: FoodListing[];
  ngos?: NGO[];
  volunteers?: Volunteer[];
  pickups?: PickupRecord[];
  activePickupId?: string;
  className?: string;
  heightClass?: string;
}

// Subcomponent to imperatively control Google Map camera and draw active route
const MapCameraController: React.FC<{
  targetCenter: { lat: number; lng: number } | null;
  targetZoom: number | null;
  tilt: number;
  heading: number;
  activeRouteCoords?: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    courier?: { lat: number; lng: number };
  } | null;
}> = ({ targetCenter, targetZoom, tilt, heading, activeRouteCoords }) => {
  const map = useMap();
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;
    if (targetCenter) {
      map.panTo(targetCenter);
    }
    if (targetZoom) {
      map.setZoom(targetZoom);
    }
    map.setTilt(tilt);
    map.setHeading(heading);
  }, [map, targetCenter, targetZoom, tilt, heading]);

  // Draw real polyline connecting the active route on the Google Map
  useEffect(() => {
    const google = (window as any).google;
    if (!map || !google?.maps) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (activeRouteCoords) {
      const path = [
        activeRouteCoords.origin,
        activeRouteCoords.courier || {
          lat: (activeRouteCoords.origin.lat + activeRouteCoords.destination.lat) / 2,
          lng: (activeRouteCoords.origin.lng + activeRouteCoords.destination.lng) / 2,
        },
        activeRouteCoords.destination,
      ];

      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#4855fe',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor: '#070e6a',
              fillColor: '#4855fe',
              fillOpacity: 1,
              scale: 3,
            },
            offset: '50%',
          },
        ],
      });

      polylineRef.current.setMap(map);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, activeRouteCoords]);

  return null;
};

// Street View Panorama Interactive Container
const StreetViewPanel: React.FC<{
  position: { lat: number; lng: number };
  title: string;
  onClose: () => void;
}> = ({ position, title, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const google = (window as any).google;
    if (!containerRef.current || !google?.maps) return;

    try {
      const panorama = new google.maps.StreetViewPanorama(containerRef.current, {
        position,
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: true,
        showRoadLabels: true,
        motionTracking: false,
      });

      const streetViewService = new google.maps.StreetViewService();
      streetViewService.getPanorama({ location: position, radius: 100 }, (data: any, status: any) => {
        if (status !== google.maps.StreetViewStatus.OK) {
          setLoadError(true);
        } else {
          setLoadError(false);
          if (data && data.location?.latLng) {
            panorama.setPosition(data.location.latLng);
          }
        }
      });
    } catch (e) {
      console.warn('Street view initialization notice:', e);
      setLoadError(true);
    }
  }, [position]);

  return (
    <div className="absolute inset-0 z-30 bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 text-white border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#4855fe] dark:text-[#9ea6ff]" />
          <div>
            <span className="text-xs font-bold text-white block leading-tight">{title}</span>
            <span className="text-[10px] text-slate-400">Street view</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Street View</span>
        </button>
      </div>

      <div className="flex-1 relative w-full h-full">
        <div ref={containerRef} className="w-full h-full" />
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-6 text-center text-white space-y-3">
            <div>
              <Camera className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold">Street view unavailable</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                Showing 3D aerial instead.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-1.5 rounded-full bg-[#4855fe] text-white font-bold text-xs"
              >
                Back to 3D Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  listings: propListings,
  ngos: propNgos,
  volunteers: propVolunteers,
  pickups: propPickups,
  activePickupId,
  className = '',
  heightClass = 'h-96 md:h-[520px]',
}) => {
  const {
    listings: contextListings,
    ngos: contextNgos,
    volunteers: contextVolunteers,
    pickups: contextPickups,
    setCurrentView,
    acceptDonation,
    addToast,
  } = useFoodBridge();

  const listings = propListings || contextListings;
  const ngos = propNgos || contextNgos;
  const volunteers = propVolunteers || contextVolunteers;
  const pickups = propPickups || contextPickups;

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyBMl0F_8w5bd-KZFqzDK15tjHJ25WVeJNc';

  // Map modes: '2d' (roadmap), 'satellite' (high-res photos), 'hybrid' (satellite + labels), '3d' (45° tilt aerial)
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'satellite' | 'hybrid'>('3d');
  const [activeFilter, setActiveFilter] = useState<'all' | 'listings' | 'ngos' | 'couriers'>('all');

  // Camera settings
  const [cameraTilt, setCameraTilt] = useState<number>(45);
  const [cameraHeading, setCameraHeading] = useState<number>(45);
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number } | null>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [cameraZoom, setCameraZoom] = useState<number>(13);

  // Street view state
  const [streetViewActive, setStreetViewActive] = useState<boolean>(false);
  const [streetViewTarget, setStreetViewTarget] = useState<{
    position: { lat: number; lng: number };
    title: string;
  } | null>(null);

  // Selected item InfoWindow
  const [selectedItem, setSelectedItem] = useState<{
    type: 'listing' | 'ngo' | 'courier';
    data: any;
    position: { lat: number; lng: number };
  } | null>(null);

  const [hasMapError, setHasMapError] = useState(false);

  // Calculate active route coords if an active pickup is selected
  const targetPickup = activePickupId
    ? pickups.find((p) => p.id === activePickupId)
    : pickups.find((p) => p.status === 'in_transit' || p.status === 'assigned');

  const activeRouteCoords = targetPickup
    ? {
        origin: toLatLng(targetPickup.providerCoords),
        destination: toLatLng(targetPickup.ngoCoords),
        courier: targetPickup.courierCoords ? toLatLng(targetPickup.courierCoords) : undefined,
      }
    : null;

  // Listen for global quota exceeded or auth failure
  useEffect(() => {
    const handleQuota = () => {
      setHasMapError(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // When activePickup changes, center camera on route
  useEffect(() => {
    if (activeRouteCoords) {
      setCameraCenter(activeRouteCoords.origin);
      setCameraZoom(14);
    }
  }, [activePickupId]);

  const handleSelectMode = (mode: '2d' | '3d' | 'satellite' | 'hybrid') => {
    setViewMode(mode);
    if (mode === '3d') {
      setCameraTilt(45);
      setCameraHeading(45);
    } else if (mode === '2d') {
      setCameraTilt(0);
      setCameraHeading(0);
    } else {
      setCameraTilt(0);
    }
  };

  const rotateCamera = () => {
    setCameraHeading((prev) => (prev + 45) % 360);
  };

  const openStreetViewForLocation = (position: { lat: number; lng: number }, title: string) => {
    setStreetViewTarget({ position, title });
    setStreetViewActive(true);
    addToast('Opening Street View', `Loading 360° ground-level imagery for ${title}.`, 'info');
  };

  const focusLocation = (pos: { lat: number; lng: number }, item: any, type: 'listing' | 'ngo' | 'courier') => {
    setCameraCenter(pos);
    setCameraZoom(15);
    setSelectedItem({ type, data: item, position: pos });
  };

  if (hasMapError) {
    return (
      <div className="relative">
        <div className="p-2 mb-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <span>Showing local route view.</span>
          <button
            onClick={() => setHasMapError(false)}
            className="text-xs font-bold underline hover:no-underline cursor-pointer"
          >
            Retry Google Maps
          </button>
        </div>
        <InteractiveMap heightClass={heightClass} className={className} />
      </div>
    );
  }

  // Determine Google Maps mapTypeId based on mode
  const mapTypeId =
    viewMode === '2d'
      ? 'roadmap'
      : viewMode === 'satellite'
      ? 'satellite'
      : 'hybrid';

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}
    >
      <APIProvider apiKey={apiKey} language="en">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={13}
          mapTypeId={mapTypeId}
          tilt={cameraTilt}
          heading={cameraHeading}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={true}
          fullscreenControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Camera Controller & Polyline Renderer */}
          <MapCameraController
            targetCenter={cameraCenter}
            targetZoom={cameraZoom}
            tilt={cameraTilt}
            heading={cameraHeading}
            activeRouteCoords={activeRouteCoords}
          />

          {/* 1. Food Listings Markers */}
          {(activeFilter === 'all' || activeFilter === 'listings') &&
            listings.map((item) => {
              const pos = toLatLng(item.coordinates);
              const isUrgent = item.urgency === 'HIGH' || item.urgency === 'CRITICAL';

              return (
                <AdvancedMarker
                  key={item.id}
                  position={pos}
                  title={`${item.title} (${item.quantityMeals} meals)`}
                  onClick={() =>
                    setSelectedItem({
                      type: 'listing',
                      data: item,
                      position: pos,
                    })
                  }
                >
                  <Pin
                    background={isUrgent ? '#EF4444' : '#4855fe'}
                    borderColor={isUrgent ? '#B91C1C' : '#2e38b8'}
                    glyphColor="#FFFFFF"
                    scale={isUrgent ? 1.2 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

          {/* 2. NGO Shelters Markers */}
          {(activeFilter === 'all' || activeFilter === 'ngos') &&
            ngos.map((ngo) => {
              const pos = toLatLng(ngo.coordinates);
              return (
                <AdvancedMarker
                  key={ngo.id}
                  position={pos}
                  title={`${ngo.name} (Capacity: ${ngo.capacityMealsDaily})`}
                  onClick={() =>
                    setSelectedItem({
                      type: 'ngo',
                      data: ngo,
                      position: pos,
                    })
                  }
                >
                  <Pin
                    background="#ff5a00"
                    borderColor="#4338CA"
                    glyphColor="#FFFFFF"
                    scale={1.05}
                  />
                </AdvancedMarker>
              );
            })}

          {/* 3. Volunteer Couriers Markers */}
          {(activeFilter === 'all' || activeFilter === 'couriers') &&
            volunteers.map((vol) => {
              const pos = toLatLng(vol.coordinates);
              return (
                <AdvancedMarker
                  key={vol.id}
                  position={pos}
                  title={`${vol.name} (${vol.vehicleType})`}
                  onClick={() =>
                    setSelectedItem({
                      type: 'courier',
                      data: vol,
                      position: pos,
                    })
                  }
                >
                  <Pin
                    background="#22C55E"
                    borderColor="#15803D"
                    glyphColor="#000000"
                    scale={1.1}
                  />
                </AdvancedMarker>
              );
            })}

          {/* Info Window Popup with Real Photos & Actions */}
          {selectedItem && (
            <InfoWindow
              position={selectedItem.position}
              onCloseClick={() => setSelectedItem(null)}
            >
              <div className="p-1 max-w-[270px] text-slate-900">
                {selectedItem.type === 'listing' && (
                  <div className="space-y-2 text-xs">
                    {/* Real food photo thumbnail */}
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={
                          selectedItem.data.imageUrl ||
                          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={selectedItem.data.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#070e6a]/90 text-white font-bold text-[10px] backdrop-blur-xs">
                        {selectedItem.data.quantityMeals} Meals
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-teal-600/90 text-white font-bold text-[10px] backdrop-blur-xs">
                        {selectedItem.data.dietaryType}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm leading-tight text-slate-900">
                        {selectedItem.data.title}
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        <strong>Provider:</strong> {selectedItem.data.providerName}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Available until: <strong>{selectedItem.data.availableUntil}</strong> · {selectedItem.data.distanceKm} km
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() =>
                          openStreetViewForLocation(
                            selectedItem.position,
                            selectedItem.data.providerName
                          )
                        }
                        className="py-1.5 px-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-[#4855fe] dark:text-[#9ea6ff]" />
                        <span>Street View</span>
                      </button>

                      <button
                        onClick={() => {
                          setCameraTilt(45);
                          setCameraHeading(60);
                          setCameraZoom(16);
                          setViewMode('3d');
                        }}
                        className="py-1.5 px-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Globe className="w-3 h-3 text-indigo-600 dark:text-[#9ea6ff]" />
                        <span>3D Aerial</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        acceptDonation(selectedItem.data.id, 'ngo_hope');
                        setSelectedItem(null);
                        setCurrentView('pickups');
                      }}
                      className="w-full py-2 px-3 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Claim</span>
                    </button>
                  </div>
                )}

                {selectedItem.type === 'ngo' && (
                  <div className="space-y-2 text-xs">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                        alt={selectedItem.data.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#ff5a00]/90 text-white font-bold text-[10px]">
                        Community Shelter
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm leading-tight text-slate-900">
                        {selectedItem.data.name}
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        Capacity: <strong>{selectedItem.data.capacityMealsDaily} meals daily</strong>
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Need today: <strong className="text-rose-600">{selectedItem.data.currentDemandMeals} meals</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() =>
                          openStreetViewForLocation(
                            selectedItem.position,
                            selectedItem.data.name
                          )
                        }
                        className="py-1.5 px-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-[#4855fe] dark:text-[#9ea6ff]" />
                        <span>Street View</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('ngos');
                          setSelectedItem(null);
                        }}
                        className="py-1.5 px-2 rounded-full bg-[#ff5a00] text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                      >
                        View Shelter
                      </button>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'courier' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">Electric Cargo Courier</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm leading-tight text-slate-900">
                        {selectedItem.data.name}
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        Vehicle: {selectedItem.data.vehicleType}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Completed Deliveries: <strong>{selectedItem.data.completedPickups}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('pickups');
                        setSelectedItem(null);
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Track route
                    </button>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Street View Full Panorama Overlay */}
      {streetViewActive && streetViewTarget && (
        <StreetViewPanel
          position={streetViewTarget.position}
          title={streetViewTarget.title}
          onClose={() => setStreetViewActive(false)}
        />
      )}

      {/* Top Floating Bar: 2D / 3D / Real Satellite / Street View Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center p-1 bg-white/95 dark:bg-[#070c47]/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
          {/* 2D Vector Street Map */}
          <button
            onClick={() => handleSelectMode('2d')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '2d'
                ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="2D map"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>2D Map</span>
          </button>

          {/* 3D Photorealistic Aerial Tilt */}
          <button
            onClick={() => handleSelectMode('3d')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '3d'
                ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="3D tilt"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Aerial</span>
          </button>

          {/* Real-Time Satellite */}
          <button
            onClick={() => handleSelectMode('satellite')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'satellite'
                ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Satellite"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Satellite Photo</span>
          </button>

          {/* Hybrid Aerial */}
          <button
            onClick={() => handleSelectMode('hybrid')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'hybrid'
                ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Hybrid"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hybrid</span>
          </button>

          {/* 3D Camera Rotate Button */}
          {viewMode === '3d' && (
            <button
              onClick={rotateCamera}
              className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Rotate 45°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-white/95 dark:bg-[#070c47]/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('listings')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              activeFilter === 'listings'
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Surplus Food ({listings.length})
          </button>
          <button
            onClick={() => setActiveFilter('ngos')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              activeFilter === 'ngos'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            NGOs ({ngos.length})
          </button>
          <button
            onClick={() => setActiveFilter('couriers')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              activeFilter === 'couriers'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Couriers ({volunteers.length})
          </button>
        </div>
      </div>

      {/* Floating Quick Location Fly-to Drawer */}
      <div className="absolute bottom-3 left-3 z-10 hidden md:flex items-center gap-2 p-1.5 bg-white/95 dark:bg-[#070c47]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-[80%] overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 whitespace-nowrap">
          Quick Jump:
        </span>
        {listings.slice(0, 3).map((l) => (
          <button
            key={l.id}
            onClick={() => focusLocation(toLatLng(l.coordinates), l, 'listing')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#4855fe]" />
            <span className="truncate max-w-[110px]">{l.providerName}</span>
          </button>
        ))}
        {ngos.slice(0, 2).map((n) => (
          <button
            key={n.id}
            onClick={() => focusLocation(toLatLng(n.coordinates), n, 'ngo')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff5a00]" />
            <span className="truncate max-w-[110px]">{n.name}</span>
          </button>
        ))}
      </div>

      {/* Bottom Map Info Legend */}
      <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#070c47]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4855fe]" />
          <span>Surplus Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a00]" />
          <span>Community NGO</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          <span>Active Courier</span>
        </div>
      </div>
    </div>
  );
};
