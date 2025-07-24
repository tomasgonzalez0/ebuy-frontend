import NavDropdown from 'react-bootstrap/NavDropdown';
import Styles from './Topbar.module.css';
import { ReactComponent as CartIcon } from '../../images/cart.svg';
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';

function Topbar({ Email, numberOfItems }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(numberOfItems);
  const role = localStorage.getItem("role");

  useEffect(() => {
    setCartItems(numberOfItems);
  }, [numberOfItems]);

  function handleCartClick() {
    if (role === "Customer") {
      navigate("/cart");
    } else {
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <nav className={Styles.topbar} aria-label="Main navigation">
      <div className={Styles.topbarContent}>
        <div className={Styles.firstContainer}>
          <NavLink to="/" className={Styles.navlinkEbuy} aria-label="Go to homepage">
            <h1 className={Styles.eBuy}>eBuy</h1>
          </NavLink>
          <NavDropdown title="Categories" id="basic-nav-dropdown" className={Styles.categoriesDropdown}>
            <NavDropdown.Item href="#category-1">Category 1</NavDropdown.Item>
            <NavDropdown.Item href="#category-2">Category 2</NavDropdown.Item>
            <NavDropdown.Item href="#category-3">Category 3</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#all-categories">See all Categories</NavDropdown.Item>
          </NavDropdown>
        </div>
        <div className={Styles.lastContainer}>
          {!Email ? (
            <NavLink to="/login" className={Styles.logIn} aria-label="Sign in">
              <p>Sign in</p>
            </NavLink>
          ) : (
            <>
              <p className={Styles.userEmail}>{Email}</p>
              <NavLink to="/login" onClick={() => localStorage.clear()} className={Styles.logOut} aria-label="Log out">
                <p>Log out</p>
              </NavLink>
            </>
          )}
          <div className={Styles.cartContainer} onClick={handleCartClick} aria-label="Go to cart" tabIndex={0} role="button">
            <CartIcon className={Styles.cartIcon} />
            <span className={Styles.price}>{cartItems > 99 ? "99+" : cartItems}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;