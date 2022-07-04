import "./navbar.css"
import {AppBar, Toolbar, Typography, Stack, Button} from "@mui/material"
// npm install @mui/material @emotion/react @emotion/styled
const Navbar = (props) => {
    
    return (
        <div className="nav-items">
            <AppBar position='static' 
                style={{
                    boxShadow: "0px 0px 0px 0px",
                    backgroundColor: "darkgrey"
                }}
            >
               <Toolbar>
                   <Typography variant='h7' component='div'/>
                   <Stack direction="row"></Stack> 
                    <Button color="inherit" >Home</Button>
                    <Button onClick={props.openLogIn} color="inherit">Login</Button>
                    <Button onClick={props.openSignUp} color="inherit" >Signup</Button>
                </Toolbar>
            </AppBar>
        </div>
    )                 
}
export default Navbar





// commented out below in case anyone is working on this - I would like for it 
// to be fully replaced by the above 



// class Navbar extends Component { 
//     state = { clicked: false }
//     handleClick = () => {
//         this.setState({ clicked: !this.state.clicked })
//     }

//     loginState = { clicked: false }
//     handleLoginClick = () => {
//         this.setState({ clicked: !this.loginState.clicked })
//     }

//     render() { 
//         return(
//             <nav className="NavbarItems">
//                 <h1 className="logo">Dublin Bus</h1>
//                 {/* <div className="menuIcon" onClick={this.handleClick}>
//                     <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars' } />
//                 </div>  */}
//                 <ul className={this.state.clicked ? 'navMenu active' : 'navMenu'}>                    
//                     <li >
//                         <a className="Home"> Home </a>
//                     </li>
//                     <li>
//                         <a>
//                             <button onClick={this.handleLoginClick.bind(this)}>SignUp/Login</button>
//                         </a>
//                         {this.loginState.clicked ? <Popup closePopup={this.handleLoginClick.bind()} /> : null}
//                     </li> 
//                 </ul>
//             </nav>     
//         )
//     }
// }

