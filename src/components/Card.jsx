import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function PlaceCard({ uniqueItems, setListItems, listItems, setClickedPlace }) {
  const [expandedItems, setExpandedItems] = useState({});

  //when the See More button is clicked, it makes a fetch to city of austin api to get information for that specific facility.
  function onClickHandler(facility_id) {
    let baseUrl = "https://data.austintexas.gov/resource/ecmv-9xxi.json";
    let appToken = "u1b3qc5B97zJ4P9XMxp84hkiR";
    let endpoint = `${baseUrl}?$$app_token=${appToken}&facility_id=${facility_id}`;

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error fetching data from City of Austin API");
      })
      .then((data) => {
        console.log(data);
        const inspections = data
          .sort(
            (a, b) => new Date(b.inspection_date) - new Date(a.inspection_date)
          )
          .map((item, index) => {
            let date = new Date(item.inspection_date);
            return (
              <p key={index}>
                Inspection Date: {date.toLocaleDateString()} Score: {item.score}
              </p>
            );
          });

        //set ExpandedItems
        //using the spread operator here with ...prev, lets us create a new object with the previous state with our changes.  When we pass arguments to a state setter, the first arguments will always be the previous state
        setExpandedItems((prev) => ({
          ...prev,
          [facility_id]: {
            expanded: true,
            inspections,
          },
        })); //setClickedPlace to be passed down from SearchList to Map
        setClickedPlace([data[0].address.latitude, data[0].address.longitude]);
      })
      .catch((error) => {
        console.error("Error after fetching data: ", error);
      });
  }

  //also use previous state to make a new object and update the property we want to update, i.e. expanded.
  const handleSeeLess = (facility_id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [facility_id]: {
        ...prev[facility_id],
        expanded: false,
      },
    }));
  };

  useEffect(() => {
    let items = uniqueItems.map((item, index) => {
      let address = JSON.parse(item.address.human_address);
      let streetAddress = address.address;
      let city = address.city;
      let state = address.state;
      let zip = address.zip;

      const isExpanded = expandedItems[item.facility_id]?.expanded || false;
      const inspections = expandedItems[item.facility_id]?.inspections || [];

      return (
        <div>
          <li key={index}>
            <Card>
              <h5>{item.restaurant_name}</h5>
              <p>{`${streetAddress} ${city}, ${state} ${zip} `}</p>
              {isExpanded ? (
                <>
                  <ul>
                    {inspections.map((inspection, index2) => (
                      <li key={index2}>{inspection}</li>
                    ))}
                  </ul>
                  <Button onClick={() => handleSeeLess(item.facility_id)}>
                    See Less
                  </Button>
                </>
              ) : (
                <Button onClick={() => onClickHandler(item.facility_id)}>
                  See Inspections
                </Button>
              )}
            </Card>
          </li>
        </div>
      );
    });
    setListItems(items); // Update listItems state with updated items
  }, [uniqueItems, expandedItems, setListItems]);

  return <ul className="placeList">{listItems}</ul>;
}

export default PlaceCard;
