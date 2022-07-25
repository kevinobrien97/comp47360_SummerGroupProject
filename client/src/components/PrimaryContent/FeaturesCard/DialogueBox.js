import { React } from "react";
import classes from "./DialogueBox.module.css";
import { Card, Button, ButtonGroup } from "@mui/material/";

const DialogueBox = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        className={classes.back_ground}
        onClick={() => {
          props.setDialogueController(false);
          props.setSelectedItem(null);
        }}
      ></div>
      <Card className={classes.dialoguebox}>
        <header className={classes.header}>
          <h4>{props.text} Stop to Favourites?</h4>
        </header>
        <div className={classes.content}>
          Do you want to {props.text.toLowerCase()} {props.item.label} to your
          list of favourites?
        </div>
        <footer className={classes.footer}>
          <ButtonGroup sx={{ width: "100%", background: "rgba(0, 0, 0, 0.8)" }}>
            <Button
              sx={{ width: "50%" }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                props.setDialogueController(false);
                props.addFunc(props.item);
              }}
            >
              Confirm
            </Button>
            <Button
              sx={{ width: "50%", backgroundColor: "#323336" }}
              type="submit"
              variant="contained"
              //   color="warning"
              onClick={() => {
                props.setDialogueController(false);
                props.setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </footer>
      </Card>
    </div>
  );
};

export default DialogueBox;
