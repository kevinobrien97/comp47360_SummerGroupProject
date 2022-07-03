import {useState} from 'react';
import {Link} from "react-router-dom";
import {Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton} from '@mui/material';
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
                            Signup/Login
                        </ListItemText>
                    </ListItemButton>
                </List>
            </Drawer>
            <IconButton sx={{color:"skyblue"}} onClick={()=>setOpenDrawer(!openDrawer)}>
                <MenuRoundedIcon/>
            </IconButton>

        </div>
    )
}
export default NavDrawer;