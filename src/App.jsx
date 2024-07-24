import { useState, useEffect } from "react";
import "./App.css";
import SearchList from "./components/SearchList.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.jsx";

function App() {
  const [allData, setAllData] = useState([]);
  const [restaurantNames, setRestaurantNames] = useState([]);
  //useEffect() to make API call
  useEffect(() => {
    let baseUrl = "https://data.austintexas.gov/resource/ecmv-9xxi.json";
    let appToken = "u1b3qc5B97zJ4P9XMxp84hkiR";
    let endpoint = `${baseUrl}?$$app_token=${appToken}&$limit=50000`;

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
        throw new error(
          "Error fetching data from City of Austin API: " + error.status
        );
      })
      .then((data) => {
        let names = data.map((item) => {
          return item.restaurant_name;
        });

        setRestaurantNames(names);
        setAllData(
          data.filter((item) => {
            return item.inspection_date > "2023-01-01T00.00.000";
          })
        );
      })
      .catch((error) => {
        console.log("Error after fetching data: " + error);
      });
  }, []);
  return (
    <>
      <Header />
      <SearchList allData={allData} names={restaurantNames}></SearchList>
    </>
  );
}

export default App;
