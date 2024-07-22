import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function PlaceCard({
  uniqueItems,
  setListItems,
  listItems,
  clickedPlace,
  setClickedPlace,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inspectionList, setInspectionList] = useState([]);

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
        const inspections = data.map((item, index) => {
          let date = new Date(item.inspection_date);
          return (
            <p key={index}>
              Inspection Date: {date.toLocaleDateString()} Score: {item.score}
            </p>
          );
        });
        setInspectionList(inspections); // Update inspectionList state with mapped JSX elements
        setIsExpanded(!isExpanded); // Toggle isExpanded state
        setClickedPlace([data[0].address.latitude, data[0].address.longitude]);
        console.log(data[0].address.latitude);
        console.log(data[0].address.longitude);
      })
      .catch((error) => {
        console.error("Error after fetching data: ", error);
      });
  }

  useEffect(() => {
    let items = uniqueItems.map((item, index) => {
      let address = JSON.parse(item.address.human_address);
      let streetAddress = address.address;
      let city = address.city;
      let state = address.state;
      let zip = address.zip;

      if (isExpanded) {
        return (
          <li key={index}>
            <Card>
              <h5>{item.restaurant_name}</h5>
              <p>{`${streetAddress} ${city}, ${state} ${zip} `}</p>
              <ul>
                {inspectionList.map((inspection, idx) => (
                  <li key={idx}>{inspection}</li>
                ))}
              </ul>
              <Button onClick={() => setIsExpanded(false)}>See Less</Button>
            </Card>
          </li>
        );
      } else {
        return (
          <li key={index}>
            <Card>
              <h5>{item.restaurant_name}</h5>
              <p>{`${streetAddress} ${city}, ${state} ${zip} `}</p>
              <Button onClick={() => onClickHandler(item.facility_id)}>
                See More
              </Button>
            </Card>
          </li>
        );
      }
    });
    setListItems(items); // Update listItems state with updated items
  }, [uniqueItems, isExpanded, setListItems, inspectionList]);

  return <ul className="placeList">{listItems}</ul>;
}

export default PlaceCard;
