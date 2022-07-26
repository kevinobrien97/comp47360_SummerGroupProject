import { React, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import DialogueBox from "./DialogueBox";

const Dropdown = (props) => {
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [addFavourite, setAddFavourite] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  return (
    <div>
      {/* Need different onclick functions */}
      {props.viewFavourites ? (
        <div>
          <Autocomplete
            value={selectedList}
            onChange={(_event, newItem) => {
              setSelectedList(newItem);
              setAddFavourite(true);
            }}
            inputValue={autocompleteSelection}
            onInputChange={(_event, newInputValue) => {
              setAutocompleteSelection(newInputValue);
              props.setError(null);
            }}
            disablePortal
            id="search"
            options={props.options}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label={`Select Bus ${props.text}`} />
            )}
          />
          {selectedList && addFavourite ? (
            <DialogueBox
              header={`Add ${props.text} to Favourites?`}
              body={"added to"}
              setDialogueController={setAddFavourite}
              func={props.addStop}
              item={selectedList}
              setSelectedItem={setSelectedList}
            ></DialogueBox>
          ) : null}
        </div>
      ) : (
        <Autocomplete
          value={selectedList}
          onChange={(_event, newItem) => {
            setSelectedList(newItem);
            props.addStop(newItem);
          }}
          inputValue={autocompleteSelection}
          onInputChange={(_event, newInputValue) => {
            setAutocompleteSelection(newInputValue);
          }}
          disablePortal
          id="search"
          options={props.options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label={`Select Bus ${props.text}`} />
          )}
        />
      )}
    </div>
  );
};

export default Dropdown;
