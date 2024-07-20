import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

function Map({ data, setClickedPlace, clickedPlace, uniqueItems }) {
  //it's taking way to long to make the markers even with the clusters - look into lazy loading or something for clusters.
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([30.2672, -97.7431]);
  const [mapData, setMapData] = useState([]);

  //filter data down to unique places to just get their latest inspection score
  useEffect(() => {
    const markerObject = {};
    data.forEach((item) => {
      const key = `${item.restaurant_name}-${item.address.human_address}`;
      if (markerObject[key]) {
        const existingItem = markerObject[key];
        const existingDate = new Date(existingItem.inspection_date);
        const currDate = new Date(item.inspection_date);
        if (currDate > existingDate) {
          markerObject[key] = item;
        }
      } else markerObject[key] = item;
    });

    setMapData(Object.values(markerObject));
  }, [data]);

  // Memoize markers to avoid unnecessary re-renders
  const markers = useMemo(() => {
    return mapData.map((item, index) => {
      const position = [item.address.latitude, item.address.longitude];
      return (
        <Marker
          position={position}
          key={index}
          eventHandlers={{
            click: () => {
              setClickedPlace(item);
            },
          }}
        >
          <Popup>
            {item.restaurant_name} <br /> {item.address.human_address}
          </Popup>
        </Marker>
      );
    });
  }, [data]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      ref={mapRef}
      style={{ height: "75vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
    </MapContainer>
  );
}

export default Map;
