import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

const BusMap = ({ lat, lng }) => {
  if (!lat || !lng) return <p>Loading map...</p>;

  console.log("Map coords:", lat, lng); // DEBUG

  return (
    <MapContainer center={[lat, lng]} zoom={16} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <Marker position={[lat, lng]}>
        <Popup>Bus is here</Popup>
      </Marker>
      <RecenterMap lat={lat} lng={lng} />
    </MapContainer>
  );
};

export default BusMap;
