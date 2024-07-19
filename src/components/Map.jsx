import PlaceCard from "./Card";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ allData, setClickedPlace, clickedPlace }) {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([30.2672, -97.7431]);

  const position = [30.2672, -97.7431];

  return (
    <>
      <MapContainer
        center={[mapCenter[0], mapCenter[1]]}
        zoom={13}
        ref={mapRef}
        style={{ height: "75vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <PlaceCard></PlaceCard>
    </>
  );
}

export default Map;
