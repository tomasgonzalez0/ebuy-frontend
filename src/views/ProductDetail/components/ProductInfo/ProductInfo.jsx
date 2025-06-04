import Styles from './ProductInfo.module.css';
import Button from 'react-bootstrap/esm/Button';
import { addToCart } from '../../../../helpers/cart/cart';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function ProductInfo({ product, publisherName, role, onAddToCart, productId }) {
    const customerId = localStorage.getItem("Id");
    const isDisabled = role !== "Customer";

    const handleAddToCartClick = async () => {
        try {
            await addToCart(customerId, productId, publisherName);
            if (onAddToCart) onAddToCart();
            alert("Product added to cart successfully");
        } catch (error) {
            alert("Error adding product to cart");
        }
    };

    return (
        <div className={Styles["product-info"]}>
            <h1 className={Styles["product-title"]}>{product.name}</h1>
            <p className={Styles["product-description"]}>{product.description}</p>
            
            <div className={Styles["price-container"]}>
                <h2 className={Styles["price"]}>${product.Price}</h2>
                <p className={Styles["product-seller"]}>Sold by {publisherName}</p>
            </div>

            <OverlayTrigger
                placement="bottom"
                overlay={
                    isDisabled ? (
                        <Tooltip id="disabled-tooltip">
                            You must be logged in with a customer account to purchase
                        </Tooltip>
                    ) : <></>
                }
            >
                <span className="w-100 d-block">
                    <Button
                        className={`w-100 ${Styles["add-to-cart-button"]}`}
                        size="lg"
                        disabled={isDisabled}
                        onClick={handleAddToCartClick}
                        style={isDisabled ? { pointerEvents: "none" } : {}}
                    >
                        Add to Cart
                    </Button>
                </span>
            </OverlayTrigger>
        </div>
    );
}