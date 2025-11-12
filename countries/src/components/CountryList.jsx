import { useState } from "react";
import CountryDetails from "./CountryDetails";

const CountryList = ({ countries }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {countries.map(c => (
        <div key={c.cca3}>
          {c.name.common}
          <button onClick={() => setSelected(c)}>show</button>
        </div>
      ))}
      {selected && <CountryDetails country={selected} />}
    </div>
  );
};

export default CountryList;
