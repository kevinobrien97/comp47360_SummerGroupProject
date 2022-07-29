import { React, useState, useContext } from "react";
// import {Link} from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AuthContext from "../../context/AuthContext";
import AccountOptions from "./AccountOptions";

const NavDrawer = (props) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="nav-drawer">
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
                    </Link>                     */}
        {!user ? (
          <List>
            <ListItemButton onClick={props.toggleLogIn} color="inherit">
              <ListItemText>Login</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={props.toggleRegister} color="inherit">
              <ListItemText>Register</ListItemText>
            </ListItemButton>
          </List>
        ) : (
          <List>
            <ListItemText>{user.username}</ListItemText>
            <ListItemButton onClick={() => logoutUser()} color="inherit">
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
            <ListItemButton color="inherit">
              <ListItemText>Register</ListItemText>
            </ListItemButton>
          </List>
        )}
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
