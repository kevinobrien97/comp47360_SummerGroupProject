import "./MiniNav.css";
import "./SideContainer.css";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { yellow } from "@mui/material/colors";
// npm install @mui/material @emotion/react @emotion/styled
const MiniNav = (props) => {
  // const navStyles = makeStyles((theme) => ({


  // })
  return (
    <div className="mininav-items">
      <AppBar
        position="static"
        style={{
          boxShadow: "0px 0px 0px 0px",
          backgroundColor: "#F1B23E",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" />
          <Button
             sx={{
               height:"4rem",
            }}           
            color="inherit"
           
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: true,
                nearest: false,
                route: false,
                stop: false,
                favourites: false,
              })
            }
          >

            Journey
          </Button>
          <Stack direction="row"></Stack>
          <Button
             sx={{
               height:"4rem",
            }}           
            color="inherit"
     
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                nearest: true,
                route: false,
                stop: false,
                favourites: false,
              })
            }
          >

            Nearest
          </Button>
          <Button
              sx={{
              height:"4rem",
            }}                    
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  journey: false,
                  nearest: false,
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
            height:"4rem",
          }}  
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  journey: false,
                  nearest: false,
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
              height:"4rem",
              padding: 2,
           }}           
            color="inherit"
            type="button"
            onClick={() =>
                props.setSidebarOption({
                  journey: false,
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
