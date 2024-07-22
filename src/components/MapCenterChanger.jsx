function MapCenterChanger() {
  // This component re-centers the map when the center prop changes
  function ChangeMapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  }
}

export default MapCenterChanger;
