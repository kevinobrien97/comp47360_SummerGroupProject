import "./MiniNav.css";
import "./SideContainer.css";
import { AppBar, Toolbar, Button } from "@mui/material";

const MiniNav = (props) => {
  return (
    <div className="mininav-items">
      <AppBar
        position="static"
        style={{
          backgroundColor: "#F1B23E",
        }}
      >
        <Toolbar>
       
          <Button
            sx={{
              height: "4rem",
            }}
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: true,
                route: false,
                stop: false,
                favourites: false,
              })
            }
          >
            Journey
          </Button>

          <Button
            sx={{
              height: "4rem",
            }}
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                route: true,
                stop: false,
                favourites: false,
              })
            }
          >
            Routes
          </Button>
          <Button
            sx={{
              height: "4rem",
            }}
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                route: false,
                stop: true,
                favourites: false,
              })
            }
          >
            Stops
          </Button>
          <Button
            sx={{
              height: "4rem",
              padding: 2,
            }}
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
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
