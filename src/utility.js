import React from "react";
import numeral from "numeral";
import { Popup, Circle } from "react-leaflet";

const casesSettings = {
  cases: {
    hex: "#682A43",
    multiplier: 400,
  },
  recovered: {
    hex: "#008000",
    multiplier: 650,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

/* Sort Info */
export const sortInfo = (data) => {
  const sortedInfo = [...data];

  sortedInfo.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedInfo;
};

export const drawCirclesOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.5}
      color={casesSettings[casesType].hex}
      fillColor={casesSettings[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesSettings[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container-popup">
          <div
            className="info-flag-popup"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name-popup">{country.country}</div>
          <div className="info-confirmed-popup">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered-popup">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths-popup">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const nicePrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
