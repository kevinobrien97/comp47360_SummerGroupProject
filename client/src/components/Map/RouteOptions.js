import './RouteOptions.css'
import { Button } from "@mui/material";
const RouteOptions = (props) => {
    console.log('props', props.options)
    return (
    <ul className='route-options'>
      {props.options.map((option) => (
        <li key={option.id}><Button>{option.time}</Button></li>
      ))}
    </ul>
  );
};

export default RouteOptions;
