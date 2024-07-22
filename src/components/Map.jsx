import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import MapCenterChanger from "./MapCenterChanger";

function Map({ data, setClickedPlace, clickedPlace, uniqueItems }) {
  //it's taking way to long to make the markers even with the clusters - look into lazy loading or something for clusters.
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([30.2672, -97.7431]);
  const [mapData, setMapData] = useState([]);

  //TODO- have markers make an api call to get directions?

  useEffect(() => {
    if (clickedPlace) {
      setMapCenter([clickedPlace[0], clickedPlace[1]]);
      console.log(mapCenter);
      console.log(clickedPlace);
    }
  }, [clickedPlace]);

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
          markerObject[key] = item; // Update with the latest inspection
        }
      } else {
        markerObject[key] = item; // Initial assignment
      }
    });

    setMapData(Object.values(markerObject));
  }, [data]);

  // Memoize markers to avoid unnecessary re-renders - caches data and returns the cached result when the same values occur again and only computes when its dependency changes, here mapData
  const markers = useMemo(() => {
    return mapData.map((item, index) => {
      const position = [item.address.latitude, item.address.longitude];
      return (
        <Marker position={position} key={index}>
          <Popup>
            {item.restaurant_name} <br />
            Last Inspection Score: {item.score}
          </Popup>
        </Marker>
      );
    });
  }, [mapData]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      ref={mapRef}
      style={{ height: "75vh", width: "100%" }}
      scrollWheelZoom={true}
      preferCanvas={true}
    >
      <MapCenterChanger center={mapCenter} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
    </MapContainer>
  );
}

export default Map;
