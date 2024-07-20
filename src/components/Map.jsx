import { useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

function Map({ data, setClickedPlace, clickedPlace, uniqueItems }) {
  //need to take data and filter it down to only places with unique names and addresses.
  //maybe do this in searchList and pass it down in props
  //it's taking way to long to make the markers even with the clusters - look into lazy loading or something for clusters.
  const mapRef = useRef(null);
  const [mapCenter] = useState([30.2672, -97.7431]);

  // Memoize markers to avoid unnecessary re-renders
  const markers = useMemo(() => {
    return data.map((item, index) => {
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
