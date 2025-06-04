import Topbar from "../../components/Topbar/Topbar";
import Styles from "./Cart.module.css";
import Subtitle from "../../components/Subtitle/Subtitle";
import CartItem from "./Components/CartItem/CartItem";
import { getProducts, getProductImages } from "../../helpers/product/productService";
import { getImagesByProductName } from "../../helpers/product/productService";
import LoadingSpinner from "../components/Loader/Loading";
import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { getCart } from "../../helpers/cart/cart";
import { getListingByOwn } from "../../helpers/product/onlineLIsting";
import { getCustomerById } from "../../helpers/customer/customer";
import { Navigate, useNavigate } from "react-router-dom";
import { makeOnlineSale, clearCart, removeItemCart } from "../../helpers/cart/cart";

// ...existing code...
export default function Cart() {
  let token = localStorage.getItem("token");
  let Email = localStorage.getItem("userEmail");
  let Id = localStorage.getItem("Id");
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("Credit card");
  const [cartProducts, setCartProducts] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [cartItems, setCartItems] = useState(0);

 useEffect(() => {
    if (Email && token) {
      const fetchCart = async () => {
        setLoading(true);
        const cartFromDb = await getCart(Id); 
        const allProducts = await getProducts(); 

        const productsWithImages = await Promise.all(
          (Array.isArray(cartFromDb) ? cartFromDb : []).map(async (cartProduct) => {
            const realProduct = allProducts.find(p => p.Name === cartProduct.Name);
            if (!realProduct) return null;
            const imageData = await getProductImages(realProduct.Id);

            return {
              id: realProduct.Id,
              Name: cartProduct.Name,
              UnitPrice: Number(cartProduct.UnitPrice) || Number(realProduct.UnitPrice) || 0,
              Quantity: Number(cartProduct.Quantity) || 1,
              price: (Number(cartProduct.UnitPrice) || Number(realProduct.UnitPrice) || 0) * (Number(cartProduct.Quantity) || 1),
              images: imageData?.Images?.map(img => `data:image/jpeg;base64,${img.Content}`) || [],
              BranchName: cartProduct.BranchName || realProduct.BranchName || "",
              AvaliableStock: realProduct.Stock
            };
          })
        );

        setCartProducts(productsWithImages.filter(Boolean));
        setLoading(false);
      };

      const fetchCustomer = async () => {
        const customerData = await getCustomerById(Id);
        if (customerData) {
          setCustomer(customerData);
        } else {
          console.error("No customer found with Id:", Id);
        }
      }

      fetchCustomer();
      fetchCart();
    }
  }, [Email, token, Id]);

// Nuevo useEffect para actualizar cartItems cuando cambie cartProducts
useEffect(() => {
  const numberOfItems = cartProducts.reduce((sum, product) => sum + product.Quantity, 0);
  setCartItems(numberOfItems);
}, [cartProducts]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, Quantity: newQuantity, price: p.UnitPrice * newQuantity }
          : p
      )
    );
  };

const handleRemoveProduct = async (productId) => {
  try {
    await removeItemCart(Id, productId);
    setCartProducts(prev => prev.filter(p => p.id !== productId));
  } catch (error) {
    alert("Error removing product from cart", error);
  }
};
  const buildPayload = async (shippingAddress) => {
    const listingsByOwn = await getListingByOwn();
    const ownProductIds = listingsByOwn.map(l => l.IdProduct);
    const productsToSell = cartProducts
      .filter(p => ownProductIds.includes(p.id))
      .map(p => ({
        Product: { Name: p.Name },
        Quantity: p.Quantity,
        BranchName: p.BranchName
      }));

    return {
      IdCustomer: Number(Id),
      ShippingAddress: shippingAddress,
      PaymentMethod: paymentMethod,
      ProductsToSell: productsToSell
    };
  };

const navigate = useNavigate();

const handlePayNow = async () => {
  try {
    const shippingAddress = customer.Address;
    const payload = await buildPayload(shippingAddress);
    if (payload.ProductsToSell.length === 0) {
      alert("There are no products to sell.");
      return;
    }
    console.log("Payload to send:", payload);
    await makeOnlineSale(payload);
    await clearCart(Id);
    navigate("/"); // <-- Así es correcto
    alert("Successfully purchased products!");
  } catch (error) {
    alert("Something went wrong while processing your order. Please try again later.");
    console.error("Error during payment process:", error);
  }
};
  const total = cartProducts.reduce((sum, p) => sum + (p.price), 0).toFixed(2);
  if (loading) return <LoadingSpinner text="Loading cart..." />;

  return (
    <article className={Styles["cart"]}>
      <Topbar Email={Email} cart={cartProducts} numberOfItems={cartItems}/>
      <section className={Styles["cart-container"]}>
        <div className={Styles["subtitle"]}>
          <Subtitle text={"Cart"} />
        </div>
        <Form>

        </Form>
        <Container className="py-3" style={{ maxWidth: "800px" }}>
          {cartProducts.map((product, index) => (
            <CartItem
              key={product.id}
              product={product}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveProduct}
            />
          ))}


          <div className="mt-4 p-3 border rounded bg-dark" id={Styles["payment"]}>
            <h5>Total: <span className="fw-bold">${total}</span></h5>
          <Form.Group controlId="paymentSelect" className="my-3">
              <Form.Label>Select Paymenth Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={Styles["select"]}
              >
                <option value="Credit card">Credit card</option>
                <option value="Debit card">Debit card</option>
                <option value="Bank transfer">Bank transfer</option>
                <option value="Cash">Cash</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="addressSelect" className="my-3">
              <Form.Label>Select Address</Form.Label>
              <Form.Select
                value={customer.Address || ""}
                onChange={(e) => setCustomer({ ...customer, Address: e.target.value })}
                className={Styles["select"]}
                >
                  <option value={customer.Address || ""}>
                    {customer.Address || "No address available"}
                  </option>
              </Form.Select>
            </Form.Group>

            <Button variant="success" size="lg" className="w-100" onClick={handlePayNow}
            >Pay Now
            </Button>
          </div>
        </Container>
      </section>
    </article>
  );
}