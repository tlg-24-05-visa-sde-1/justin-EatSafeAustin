import { useState, useEffect, useMemo } from "react";
import Map from "./Map.jsx";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlaceCard from "./Card.jsx";
import "../SearchList.css";
import Header from "./Header.jsx";
add;

//TODO
//decide whether or not to ditch the card and just have more info appear when the see more
//button is clicked.

function SearchList({ allData, names }) {
  //state variables
  const [clickedPlace, setClickedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [listArray, setListArray] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [uniqueItems, setUniqueItems] = useState([]);

  //So these don't recalculate on each render
  const uniqueNames = useMemo(() => {
    return [...new Set(names)];
  }, [names]);

  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    //setTimeout to debounce so it doesn't run too frequently
    const timer = setTimeout(() => {
      //check to make sure searchTerm isn't empty and trim it so we don't set a list to either empty or whitespace, this was triggering a whole bunch of list items being made and slowing things down
      if (searchTerm.trim() === "") {
        setListArray([]);
      } else {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredData = allData.filter((item) =>
          //TODO
          //which is better to use here, to use .startsWith() or .includes()
          item.restaurant_name.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setListArray(filteredData);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, allData]);

  useEffect(() => {
    //Need to return only unique places here and then make the cards contain the latest inspection score.
    //set an empty object
    let uniqueItemsObject = {};

    //iterate over each item give it a key that is  a combo of its name and address so that each location is unique
    listArray.forEach((item) => {
      const key = `${item.name}-${item.address.human_address}`;
      //using the key, check if item exists, then compare inspections dates if it does to get the most recent inspection and sets that item to the uniqueItemsObject using the key.  If not, just stores the item in the uniqueItemsObject with the key.
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
    //pull out values to and assign to uniqueItems make an array of objects
    setUniqueItems(Object.values(uniqueItemsObject).sort());
  }, [listArray]);

  return (
    <>
      <Container fluid>
        <Row>
          <Header />
        </Row>
        <Row>
          <Col xs={12} md={4} className="listCol">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search"
                list="names"
                onChange={handleChange}
                value={searchTerm}
              />
              <datalist id="names">
                {uniqueNames
                  .sort((a, b) => a.localeCompare(b))
                  .map((item, index) => {
                    return <option value={item} key={index}></option>;
                  })}
              </datalist>
            </form>

            <ul className="placeList">
              <PlaceCard
                uniqueItems={uniqueItems}
                setListItems={setListItems}
                listItems={listItems}
                setClickedPlace={setClickedPlace}
              ></PlaceCard>
            </ul>
          </Col>

          <Col xs={12} md={8}>
            <Map
              uniqueItems={uniqueItems}
              data={allData}
              setClickedPlace={setClickedPlace}
              clickedPlace={clickedPlace}
            ></Map>
          </Col>
        </Row>
        <Row></Row>
      </Container>
    </>
  );
}

export default SearchList;
