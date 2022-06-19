// import { subMenu } from "./subMenu";
// import React, {Component} from "react";
// import './subNav.css'

// class navbar extends Component { 
//     state = { clicked: false }
//     handleClick() {
//         this.setState({ clicked: !this.state.clicked })
//      }

//     render() { 
//         return(
//             <nav className="navPages">
//                 <h1 className="logo">Dublin Bus</h1>
//                 <div className="menuIcon" onClick={this.handleClick}>
//                     <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars' } />
//                 </div> 
//                 <ul className={this.state.clicked ? 'navMenu active' : 'navMenu'}>                    
//                 {mainMenu.map((item, index) => {
//                         return(
//                             <li key={index}>
//                                 <a className={item.name}> href={item.url}
//                                 {item.title}
//                                 </a>
//                             </li>
//                         )
//                         })}
//                 </ul>
//             </nav>     
//         )
//     }
// }