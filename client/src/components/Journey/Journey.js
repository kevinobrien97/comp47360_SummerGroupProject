import {
  ButtonGroup,
  Button,
  Box,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import "./Journey.css";
import { FaLocationArrow } from "react-icons/fa";

const Journey = () => {
  return (
    <Box className="journey-planner">
      <Grid container direction="row" spacing={2}>
        <TextField
          id="origin"
          placeholder="Origin"
          variant="outlined"
        ></TextField>
        <TextField
          id="destination"
          placeholder="Destination"
          variant="outlined"
        ></TextField>
      </Grid>

      <ButtonGroup>
        <Button type="submit">Calculate Route</Button>
        <Button type="submit">Cancel</Button>
        <Button
            aria-label='center back'
            
         size="large"
            onClick={() => alert(123)}
          >{<FaLocationArrow />}</Button>
      </ButtonGroup>
     
    </Box>
  );
};

export default Journey;
