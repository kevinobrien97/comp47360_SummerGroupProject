import "./MiniNav.css";
import "./SideContainer.css";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";
// npm install @mui/material @emotion/react @emotion/styled
const MiniNav = (props) => {
  return (
    <div className="mininav-items">
      <AppBar
        position="static"
        style={{
          boxShadow: "0px 0px 0px 0px",
          borderRadius: "10px",
        }}
      >
        <Toolbar>
          <Typography variant="h7" fontSize={8} component="div" />
          <Stack direction="row"></Stack>
          <Button
            color="inherit"
            fontSize={8}
            type="button"
            onClick={() =>
              props.setSidebarOption({
                nearest: true,
                route: false,
                stop: false,
                favourites: false,
              })
            }
          >

            Nearest Stops
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  nearest: false,
                  route: true,
                  stop: false,
                  favourites: false,
                })
              }
          >
            Route Search
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  nearest: false,
                  route: false,
                  stop: true,
                  favourites: false,
                })
              }
          >
            Stop Search
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  nearest: false,
                  route: false,
                  stop: false,
                  favourites: true,
                })
              }
          >
            Favourites
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default MiniNav;
