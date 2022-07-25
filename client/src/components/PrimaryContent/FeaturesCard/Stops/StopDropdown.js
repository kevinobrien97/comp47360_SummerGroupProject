import { React, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import DialogueBox from "../DialogueBox";

const StopDropdown = (props) => {
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [addFavourite, setAddFavourite] = useState(false);
  const [selectedStopList, setSelectedStopList] = useState(null);
  return (
    <div>
      {/* Need different onclick functions */}
      {props.viewFavourites ? (
        <div>
          <Autocomplete
            value={selectedStopList}
            onChange={(_event, newStop) => {
              setSelectedStopList(newStop);
              setAddFavourite(true);
              console.log(newStop);
            }}
            inputValue={autocompleteSelection}
            onInputChange={(_event, newInputValue) => {
              setAutocompleteSelection(newInputValue);
              props.setError(null)
            }}
            disablePortal
            id="stop-search"
            options={props.options}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Bus Stop" />
            )}
          />
          {selectedStopList && addFavourite ? (
            <DialogueBox
              header={"Add Stop to Favourites?"}
              body={"added to"}
              setDialogueController={setAddFavourite}
              func={props.addStop}
              item={selectedStopList}
              setSelectedItem={setSelectedStopList}
            ></DialogueBox>
          ) : null}
        </div>
      ) : (
        <Autocomplete
          value={selectedStopList}
          onChange={(_event, newStop) => {
            setSelectedStopList(newStop);
            props.addStop(newStop);
          }}
          inputValue={autocompleteSelection}
          onInputChange={(_event, newInputValue) => {
            setAutocompleteSelection(newInputValue);
          }}
          disablePortal
          id="stop-search"
          options={props.options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Bus Stop" />
          )}
        />
      )}
    </div>
  );
};

export default StopDropdown;
