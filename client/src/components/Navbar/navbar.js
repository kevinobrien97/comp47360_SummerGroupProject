import React, {Component} from "react";
import './navbar.css'
import Popup from './signupPopup/popup.js'

class Navbar extends Component { 
    state = { clicked: false }
    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    loginState = { clicked: false }
    handleLoginClick = () => {
        this.setState({ clicked: !this.loginState.clicked })
    }

    render() { 
        return(
            <nav className="NavbarItems">
                <h1 className="logo">Dublin Bus</h1>
                {/* <div className="menuIcon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars' } />
                </div>  */}
                <ul className={this.state.clicked ? 'navMenu active' : 'navMenu'}>                    
                    <li >
                        <a className="Home"> Home </a>
                    </li>
                    <li>
                        <a>
                            <button onClick={this.handleLoginClick.bind(this)}>SignUp/Login</button>
                        </a>
                        {this.loginState.clicked ? <Popup closePopup={this.handleLoginClick.bind()} /> : null}
                    </li> 
                </ul>
            </nav>     
        )
    }
}

export default Navbar