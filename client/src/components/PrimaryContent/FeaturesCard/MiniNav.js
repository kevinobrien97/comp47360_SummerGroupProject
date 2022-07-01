import "./MiniNav.css"
import "./SideContainer.css"
import {AppBar, Toolbar, Typography, Stack, Button} from "@mui/material"
import {Link} from "react-router-dom"
// npm install @mui/material @emotion/react @emotion/styled
const MiniNav = () => {
    return (
        <div className="mininav-items">
            <AppBar position='static'
                style={{
                    boxShadow: "0px 0px 0px 0px",
                    borderRadius: "10px",
                }}
            
            >
               <Toolbar>
                   <Typography variant='h7' fontSize={8} component='div'/>
                   <Stack direction="row"></Stack> 
                   <Button color="inherit" fontSize={8}>Nearest Stops</Button>
                    <Button color="inherit">Route Search</Button>
                    <Button color="inherit">Stop Search</Button>
                    <Button color="inherit">Favourites</Button>
                </Toolbar> 
            </AppBar>
        </div>
    )                 

}
export default MiniNav