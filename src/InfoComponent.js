import React from "react";
import "./infoComponent.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoComponent({
  active,
  isRed,
  isPurple,
  title,
  cases,
  total,
  ...props
}) {
  return (
    <Card
      className={`infoComponent ${active && "infoComponent--selected"} ${
        isRed && "infoComponent--red"
      } ${isPurple && "infoComponent--purple"}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2
          className={`infoComponent__cases ${
            !isRed && !isPurple && "infoComponent__cases--green"
          } ${isPurple && "infoComponent__cases--purple"}`}
        >
          {cases}
        </h2>
        <Typography className="infoComponent__total" color="textSecondary">
          <p className="total_cases">Total: {total}</p>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoComponent;
