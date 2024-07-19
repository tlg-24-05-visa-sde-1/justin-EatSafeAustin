import { useState, useEffect, useMemo } from "react";
import Map from "./Map.jsx";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SearchList({ allData, names }) {
  //state variables
  const [clickedPlace, setClickedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [listArray, setListArray] = useState([]);
  const [listItems, setListItems] = useState([]); //filter

  //So these don't recalculate on each render
  const uniqueNames = useMemo(() => {
    return [...new Set(names)];
  }, [names]);

  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  //make list sort exact names first
  //filter out duplicates somewhere to be able to display various inspection dates on one card

  useEffect(() => {
    //setTimeout to debounce so it doesn't run too frequently
    const timer = setTimeout(() => {
      //check to make sure searchTerm isn't empty and trim it so we don't set a list to either empty or whitespace, this was triggering a whole bunch of list items being made and slowing things down
      if (searchTerm.trim() === "") {
        setListArray([]);
      } else {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredData = allData.filter((item) =>
          item.restaurant_name.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setListArray(filteredData);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, allData]);

  useEffect(() => {
    //I need to return only unique places here and then make the cards contain the latest inspection score.

    //set an empty object
    let uniqueItemsObject = {};

    //iterate over each item give it a key that is  a combo of its name and address so that each location is unique
    listArray.forEach((item) => {
      const key = `${item.name}-${item.address.human_address}`;
      //using the key, check if item exists, then compare inspections dates if it does to get the most recent inspection and set that item to the uniqueItemsObject.  If not, just set the item to the uniqueItemsObject.
      if (uniqueItemsObject[key]) {
        const existingItem = uniqueItemsObject[key];
        const existingDate = new Date(existingItem.inspection_date);
        const currentDate = new Date(item.inspection_date);

        if (currentDate > existingDate) {
          uniqueItemsObject[key] = item;
        }
      } else {
        uniqueItemsObject[key] = item;
      }
    });
    //pull out values ot make an array of objects
    const uniqueItems = Object.values(uniqueItemsObject);

    //the address was still in json for some reason so we needed to pull each part of it out
    let items = uniqueItems.map((item, index) => {
      let address = JSON.parse(item.address.human_address);
      let streetAddress = address.address;
      let city = address.city;
      let state = address.state;
      let zip = address.zip;
      return (
        <li key={index}>
          <Card>
            <h5>{item.restaurant_name}</h5>
            <p>{`${streetAddress} ${city}, ${state} ${zip} `}</p>
            <p>Last Inspection Score: {item.score}</p>
            <p>Last Inspection Date: {item.inspection_date}</p>
            <Button>See More</Button>
          </Card>
        </li>
      );
    });
    setListItems(items);
  }, [listArray]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={4}>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search"
                list="names"
                onChange={handleChange}
                value={searchTerm}
              />
              <datalist id="names">
                {uniqueNames.map((item, index) => {
                  return <option value={item} key={index}></option>;
                })}
              </datalist>
            </form>
            <ul className="placeList"> {listItems}</ul>
          </Col>

          <Col md={8}>
            <Map
              data={allData}
              setClickedPlace={setClickedPlace}
              clickedPlace={clickedPlace}
            ></Map>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SearchList;
