import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import maplibregl from 'maplibre-gl';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 18);
    }
  }, [lat, lng]);
  return null;
};

const BusMap = ({ lat, lng, details }) => {
  if (!lat || !lng) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={18}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom={true}
    >
      {/* Satellite background */}
      <TileLayer
        url="https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=se80gRWG0V6Ek8Iq1vqQ"
        attribution='&copy; MapTiler & OpenStreetMap contributors'
      />
      {/* Transparent labels
      <TileLayer
        url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=se80gRWG0V6Ek8Iq1vqQ"
        attribution='&copy; MapTiler'
        opacity={0.4}
      /> */}

      <Marker position={[lat, lng]}>
        <Popup>
          <strong>Bus Location</strong><br />
          Latitude: {lat.toFixed(5)}<br />
          Longitude: {lng.toFixed(5)}<br />
          {details?.time && <>Last Updated: {details.time}<br /></>}
          {details?.speed && <>Speed: {details.speed} km/h</>}
        </Popup>
      </Marker>

      <RecenterMap lat={lat} lng={lng} />
    </MapContainer>
  );
};

export default BusMap;
