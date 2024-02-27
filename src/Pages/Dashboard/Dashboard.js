import { Grid } from "@mui/material";
import React from "react";
import CountUp  from "react-countup";
import'./dashboard.css'
function Dashboard() {
  return (
    <>
      <Grid container>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp  className="counter-number" start={0} end={45686} duration={4} />
          </div>
        </Grid>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp className="counter-number" start={0} end={145794} duration={4} />
          </div>
        </Grid>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp className="counter-number" start={0} end={789458} duration={4} />
          </div>
        </Grid>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp className="counter-number" start={0} end={475896} duration={4} />
          </div>
        </Grid>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp className="counter-number" start={0} end={458796} duration={4} />
          </div>
        </Grid>
        <Grid item  xs={12}  sm={6}  lg={4}>
          <div className="dashboard-card">
            {" "}
            <CountUp className="counter-number" start={0} end={488565} duration={4} />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
