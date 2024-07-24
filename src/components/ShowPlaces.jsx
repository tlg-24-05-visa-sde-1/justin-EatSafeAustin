import React, { useCallback, useEffect, useState } from "react";
import useSupercluster from "use-supercluster";
import { Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "../showPlaces.css";

const icons = {};
const fetchIcon = (count) => {
  const size = 10 + (count / 100) * 30;
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
              <span>${count}</span>
             </div>`,
      className: "cluster-marker",
      iconSize: [size, size],
    });
  }
  return icons[count];
};

function ShowPlaces({ mapData, markers, clickedPlace }) {
  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(13);
  const map = useMap();

  //so we only calculate clusters within the bounds of the map, so if you move the map, only those on screen are calculated, improves performance
  function updateMap() {
    console.log("updating");
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom());
  }
  //updates map as user moves around in map
  const onMove = useCallback(() => {
    updateMap();
  }, [map]);

  //updateMap is called the first time the map is rendered on screen b/c map is a dependency of the useEffect.  I don't get the React.useEffect though.
  React.useEffect(() => {
    updateMap();
  }, [map]);

  //when user moves, we call onMove(), which calls the updateMap()
  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  //this prepares the data for supercluster- it needs to be an array of GeoJSON Feature objects with the geometry of each being a GeoJSON Point.
  const points = mapData.map((place) => ({
    type: "Feature",
    properties: { cluster: false, id: place.facility_id, place },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(place.address.longitude),
        parseFloat(place.address.latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points: points,
    bounds: bounds,
    zoom: zoom,
    options: { radius: 75, maxZoom: 16 },
  });
  console.log(clusters.length);

  //figure out dynamic styling for markers?
  //   const getColorByScore = (score) => {
  //     if (score < 70) return "red";
  //     if (score >= 70 && score < 80) return "yellow";
  //     if (score >= 80 && score < 90) return "blue";
  //     if (score > 90) return "green";
  //   };

  return (
    <>
      {clusters.map((cluster, index) => {
        //get cluster coordinates
        const [longitude, latitude] = cluster.geometry.coordinates;
        //the point may be a cluster or a place point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        //render cluster
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${index}${cluster.properties.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    maxZoom
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }
        return (
          <Marker
            key={`place-${cluster.properties.id}`}
            position={[latitude, longitude]}
          >
            <Popup>
              {cluster.properties.place.restaurant_name} <br />
              Last Inspection Score: {cluster.properties.place.score}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default ShowPlaces;
