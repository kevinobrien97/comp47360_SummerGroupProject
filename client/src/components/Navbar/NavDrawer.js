import {useState} from 'react';
import {Link} from "react-router-dom";
import {Drawer, List, ListItemButton, ListItemText, IconButton} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
const NavDrawer = (props) => {
    const [openDrawer, setOpenDrawer] = useState(false)
    return ( 
        <div className="nav-drawer">
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="left">
                <List>
                    <Link to={'/'}>
                        <ListItemButton>
                            <ListItemText>
                                Home
                            </ListItemText>
                        </ListItemButton>
                    </Link>                    
                    <ListItemButton onClick={props.openLogIn} color="inherit">
                        <ListItemText>
                            Login
                        </ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={props.openLogIn} color="inherit">
                        <ListItemText>
                            Sign-Up
                        </ListItemText>
                    </ListItemButton>

                </List>
            </Drawer>
            <IconButton sx={{color:"white"}} onClick={()=>setOpenDrawer(!openDrawer)}>
                <MenuRoundedIcon/>
            </IconButton>

        </div>
    )
}
export default NavDrawer;