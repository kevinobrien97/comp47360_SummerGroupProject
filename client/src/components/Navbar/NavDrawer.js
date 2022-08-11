import { React, useState, useContext } from "react";
// import {Link} from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AuthContext from "../../context/AuthContext";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

const NavDrawer = (props) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="left"
      >
        {/* <Link to={'/'}>
                        <ListItemButton>
                            <ListItemText>
                                Home
                            </ListItemText>
                        </ListItemButton>
                    </Link> */}
        <div>
          <ListItemButton
            sx={{
              backgroundColor: "#F1B23E",
              height: "4rem",
              // minWidth: "6rem",

              color: "black",
              borderRadius: "0",
              fontSize: "100%",
              display: "flex",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "#fff",
                color: "black",
              },
            }}
            // reload on click
            onClick={() => window.location.reload(false)}
          >
            ShuttleUp&nbsp;
            <img
              src={require("./images/bus.png")}
              height={"100%"}
              width={"100%"}
              alt={"bus logo"}
            />
          </ListItemButton>
          {!user ? (
            <List>
              <ListItemButton
                onClick={() => {
                  props.toggleLogIn();
                  setOpenDrawer(false);
                }}
                color="inherit"
              >
                <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                  <BiLogIn />{" "}
                </ListItemIcon>
                <ListItemText>Login</ListItemText>
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.toggleRegister();
                  setOpenDrawer(false);
                }}
                color="inherit"
              >
                <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                  <VscAccount />{" "}
                </ListItemIcon>
                <ListItemText>Register</ListItemText>
              </ListItemButton>
            </List>
          ) : (
            <List>
              <ListItemText
                sx={{ textDecoration: "underline", fontWeight: "900", paddingLeft: "1rem" }}
              >
                {user.username}
              </ListItemText>
              <ListItemButton onClick={() => logoutUser()} color="inherit">
                <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                  <BiLogOut />{" "}
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </ListItemButton>
              {/* <ListItemButton color="inherit">
                <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                  <MdManageAccounts />{" "}
                </ListItemIcon>
                <ListItemText>Account Management</ListItemText>
              </ListItemButton> */}
            </List>
          )}
        </div>
      </Drawer>
      <IconButton
        sx={{ color: "white" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuRoundedIcon />
      </IconButton>
    </div>
  );
};
export default NavDrawer;
