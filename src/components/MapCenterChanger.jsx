import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapCenterChanger({ center, zoom }) {
  // This component re-centers the map when the center prop changes

  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map]);
  return null;
}

export default MapCenterChanger;
