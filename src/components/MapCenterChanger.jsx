import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapCenterChanger({ center }) {
  // This component re-centers the map when the center prop changes

  const map = useMap();
  useEffect(() => {
    map.setView(center, 18);
  }, [center, map]);
  return null;
}

export default MapCenterChanger;
