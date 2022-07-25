import { React, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

const StopDropdown = (props) => {
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedStopList, setSelectedStopList] = useState(null);
  return (
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
  );
};

export default StopDropdown;
