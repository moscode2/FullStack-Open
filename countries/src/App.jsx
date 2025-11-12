import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import CountryDetails from "./components/CountryDetails";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  // fetch all countries
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setCountries(response.data))
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Find countries</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search country..."
      />

      {search && (
        filtered.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filtered.length > 1 ? (
          <CountryList countries={filtered} />
        ) : filtered.length === 1 ? (
          <CountryDetails country={filtered[0]} />
        ) : (
          <p>No matches found</p>
        )
      )}
    </div>
  );
};

export default App;
