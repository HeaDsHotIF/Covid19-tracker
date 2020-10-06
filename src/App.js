import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import InfoComponent from "./InfoComponent";
import Map from "./Map";
import Table from "./Table";
import { sortInfo } from "./utility";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import { nicePrint } from "./utility";

function App() {
  const [countries, setCountries] = useState(["UsA", "India"]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [days, setDays] = useState("250");
  const [mapCenter, setMapCenter] = useState({
    lat: 34.8,
    lng: -40.5,
  }); /* Center of pacific ocean */
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [countryName, setCountryName] = useState("all");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    async function getCountriesData() {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((countriesData) => {
          const countries = countriesData.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedInfo = sortInfo(countriesData);
          setTableData(sortedInfo);
          setMapCountries(countriesData);
          setCountries(countries);
        });
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        setCountryName(data.country);
        setCountryInfo(data);
        setCountry(countryCode);
        // console.log(data.countryInfo.lat, data.countryInfo.long);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__infos">
          <InfoComponent
            active={casesType === "cases"}
            isPurple
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Cases"
            cases={nicePrint(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0,0a")}
          />
          <InfoComponent
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            cases={nicePrint(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0,0a")}
          />
          <InfoComponent
            active={casesType === "deaths"}
            isRed
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            cases={nicePrint(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0,0a")}
          />
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
          countries={mapCountries}
        />
      </div>
      <div className="app__right">
        <Card className="app__cardRight">
          <CardContent>
            <div className="app__information">
              <h3>Live cases</h3>
              <Table countries={tableData} />
              <h3>
                {countryName != "all" ? countryName : "Worlwide"} new{" "}
                {casesType}
              </h3>
              <LineGraph
                country={countryName}
                className="app__graph"
                casesType={casesType}
                days={days}
              />
            </div>
            <div className="graphButtons">
              <Button
                onClick={(e) => setDays("60")}
                variant="outlined"
                className="button"
              >
                60 Days
              </Button>
              <Button
                onClick={(e) => setDays("90")}
                variant="outlined"
                className="button"
              >
                90 Days
              </Button>
              <Button
                onClick={(e) => setDays("120")}
                variant="outlined"
                className="button"
              >
                120 Days
              </Button>
              <Button
                onClick={(e) => setDays("150")}
                variant="outlined"
                className="button"
              >
                150 Days
              </Button>
              <Button
                onClick={(e) => setDays("180")}
                variant="outlined"
                className="button"
              >
                180 Days
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
