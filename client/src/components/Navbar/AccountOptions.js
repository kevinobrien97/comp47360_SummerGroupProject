import { React, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

const AccountOptions = (props) => {
  const [opener, setOpener] = useState(null);
  const open = Boolean(opener);

  const closer = () => {
    setOpener(null);
  };
  const logout = () => {
    setOpener(null);
    props.logoutUser();
  };

  const handleClick = (event) => {
    setOpener(event.currentTarget);
  };

  return (
    <span>
      <Button
        sx={{
          backgroundColor: "black",
          height: "4rem",
          minWidth: "6rem",
          padding: "1rem",
          borderColor: "#323336",
          color: "white",
          "&:hover": {
            backgroundColor: "#fff",
            color: "black",
          },
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {props.user.username}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={opener}
        open={open}
        onClose={closer}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={closer}>My Account</MenuItem> */}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </span>
  );
};

export default AccountOptions;
