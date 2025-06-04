import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import cart from '../../images/cart.svg';
import Styles from './Topbar.module.css';
import { ReactComponent as CartIcon } from '../../images/cart.svg';
import { useNavigate } from "react-router-dom";
import { NavLink, resolvePath } from "react-router-dom";
import { useState, useEffect } from 'react';


function Topbar({Email, numberOfItems, cart}) {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(numberOfItems);
    const role = localStorage.getItem("role");

    useEffect(() => {
        setCartItems(numberOfItems);
    }, [numberOfItems]);

    function handleCartClick() {
        if(role === "Customer"){
            navigate("/cart");
        }
        else{
            localStorage.clear();
            navigate("/login");
        }
    }
  return (
    <nav className={Styles["topbar"]}>
        <div className={Styles["topbar-content"]}>
            <div className={Styles["first-container"]}>
                <NavLink to={"/" } className={Styles["navlink-ebuy"]}>
                    <h1 className={Styles["eBuy"]}>eBuy</h1>
                </NavLink>
                

                <NavDropdown title="Categories" id="basic-nav-dropdown" className={Styles["categories-dropdown"]}>
                    <NavDropdown.Item href="#category-1">Cateory 1</NavDropdown.Item>
                    <NavDropdown.Item href="#category-2">Category 2</NavDropdown.Item>
                    <NavDropdown.Item href="#category-3">Category 3</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#all-categories">See all Categories</NavDropdown.Item>
                </NavDropdown>
            </div>
            <div className={Styles["last-container"]} >
               {!Email &&  <NavLink to={"/login" } className={Styles["log-in"]}>
                    <p>{"Sign in"}</p>
                </NavLink>}

        {Email &&(
            <>
                <p style={{marginRight: "10px"}}>{Email}</p> 
                <NavLink to={"/login"} onClick={() => localStorage.clear()}>
                    <p>Log out</p>
                </NavLink>
            </>
                )}
                
                <div className={Styles["cart-container"]} onClick={handleCartClick}>
                    <CartIcon className={Styles["cart-icon"]} />
                    <p className={Styles["price"]}>{cartItems>99 ? (99+"+"):cartItems}</p>
                </div>
                 
              
            </div>
        </div>    
    </nav>

    //   <Navbar bg="dark" data-bs-theme="light" className={Styles["topbar"]} expand="lg">
    //     <Container>
    //       <Navbar.Brand href="#home" className={Styles["eBuy"]}>eBuy</Navbar.Brand>
    //       <Nav className="me-auto">

    //         <NavDropdown title="Categories" id="basic-nav-dropdown">
    //           <NavDropdown.Item href="#category-1">Cateory 1</NavDropdown.Item>
    //           <NavDropdown.Item href="#category-2">Category 2</NavDropdown.Item>
    //           <NavDropdown.Item href="#category-3">Category 3</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item href="#all-categories">See all Categories</NavDropdown.Item>
    //         </NavDropdown>
    //       </Nav>
    //       <Navbar.Collapse className="justify-content-end">
    //       <Navbar.Text>
    //         <a href="#cart" className={Styles["cart-link"]}>
    //         <img src={cart} alt="" className={Styles["cart"]} />
    //         </a>
    //       </Navbar.Text>
    //       <Navbar.Text>
    //         <a href="#login" className={Styles["log-in"]}>Log in</a>
    //       </Navbar.Text>
    //     </Navbar.Collapse>
    //     </Container>
    //   </Navbar>
  );
}

export default Topbar;