import PlaceCard from "./Card";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ allData, setClickedPlace, clickedPlace }) {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([30.2672, -97.7431]);
  const [map, setMap] = useState(null);

  return (
    <>
      <MapContainer></MapContainer>
      <PlaceCard></PlaceCard>
    </>
  );
}

export default Map;
