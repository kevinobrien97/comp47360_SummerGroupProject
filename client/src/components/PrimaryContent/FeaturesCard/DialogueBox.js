import { React } from "react";
import classes from "./DialogueBox.module.css";
import { Card, Button, ButtonGroup } from "@mui/material/";

const DialogueBox = (props) => {
  const deleteFav = () => {
    props.setList(props.list.filter((stop) => stop !== props.item));
    props.setDialogueController(false);
    props.func(props.item);
    props.reCenter();
    props.setMarker(props.resetMarker);
  };

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
          <h4>{props.header}</h4>
        </header>
        <div className={classes.content}>
          {props.item.label ||
            props.item.stop_name ||
            props.item.route_short_name.concat(
              ": ",
              props.item.trip_headsign
            )}{" "}
          will be {props.body} your favourites. Do you want to continue?
        </div>
        <footer className={classes.footer}>
          <ButtonGroup sx={{ width: "100%", background: "rgba(0, 0, 0, 0.8)" }}>
            {props.setList ? (
              <Button
                sx={{ width: "50%", backgroundColor: "#F1B23E" }}
                type="submit"
                variant="contained"
                onClick={deleteFav}
              >
                Confirm
              </Button>
            ) : (
              <Button
                sx={{ width: "50%", backgroundColor: "#F1B23E" }}
                type="submit"
                variant="contained"
                onClick={() => {
                  props.setDialogueController(false);
                  props.func(props.item);
                }}
              >
                Confirm
              </Button>
            )}

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
