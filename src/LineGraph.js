import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const settings = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const transformChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;

  for (let day in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: day,
        y:
          data[casesType][day] -
          lastDataPoint /* get the everyday nr of cases */,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][day];
  }
  return chartData;
};

function LineGraph({ casesType, country, days, ...props }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=${days}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (country === "all") {
            let chartData = transformChartData(data, casesType);
            setData(chartData);
          } else {
            let chartData = transformChartData(data.timeline, casesType);
            setData(chartData);
          }
        });
    };
    fetchData();
  }, [casesType, days, country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "#682A43",
                borderColor: "black",
              },
            ],
          }}
          options={settings}
        />
      )}
    </div>
  );
}

export default LineGraph;
