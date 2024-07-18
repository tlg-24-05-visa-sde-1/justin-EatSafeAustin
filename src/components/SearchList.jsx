import { useState, useEffect } from "react";
import Map from "./Map.jsx";

function SearchList({ allData, names }) {
  //state variables
  const [clickedPlace, setClickedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  return (
    <>
      <div>
        <form action="">
          <input type="text" placeholder="Search" list="names" />
          <datalist id="names">
            {names.map((item, index) => {
              return <option value={item} key={index}></option>;
            })}
          </datalist>
        </form>

        <ul></ul>
      </div>
      <Map
        allData={allData}
        setClickedPlace={setClickedPlace}
        clickedPlace={clickedPlace}
      ></Map>
    </>
  );
}

export default SearchList;
