import { React } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const StopTable = (props) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div>
      <h4 style={{ marginTop: "0.5rem" }}>
        {days[props.daySelection]}
        {" schedule from "}
        {props.time.toTimeString().split(" ")[0].slice(0, -3)}
        {" onwards."}
      </h4>
      {!props.schedule[0] ? (
        <p>No more busses scheduled at this stop for the selected time.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Route</TableCell>
                <TableCell>Direction</TableCell>
                <TableCell>Scheduled Departure</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.schedule.map((row) => (
                <TableRow
                  key={Math.random()}
                  //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.route_short_name}</TableCell>
                  <TableCell>{row.stop_headsign}</TableCell>
                  {/* if bus leaves after midnight need to subtract 24 hours from time, plus add on a 0 at the beginning */}
                  {row.departure_time.slice(0, 2) >= "24" ? (
                    <TableCell>
                      {"0".concat(
                        String(row.departure_time.slice(0, 2) - "24"),
                        row.departure_time.slice(2, row.departure_time.length)
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>{row.departure_time}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default StopTable;
