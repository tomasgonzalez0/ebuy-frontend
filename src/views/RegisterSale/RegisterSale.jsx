import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Styles from './RegisterSale.module.css';
import { getBranchs } from '../../helpers/branch/branch';
import { getProductsByBranch } from '../../helpers/product/productService';
import { sendInStoreSale } from '../../helpers/storeSales/storeSales';

export default function RegisterSale() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [branchs, setBranchs] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [productsToSell, setProductsToSell] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [productsByBranch, setProductsByBranch] = useState([]);
  const [quantityError, setQuantityError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Para el modal de producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 1,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const branchs = await getBranchs();
      setBranchs(branchs);
    };
    fetchInitialData();
  }, []);

  // Traer productos cuando cambia la branch seleccionada
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedBranchName) {
        const products = await getProductsByBranch(selectedBranchName);
        setProductsByBranch(products);
      } else {
        setProductsByBranch([]);
      }
      setNewProduct({ name: '', quantity: 1 });
    };
    fetchProducts();
  }, [selectedBranchName]);

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      const selected = productsByBranch.find(p => p.Name === newProduct.name);
      const maxStock = selected ? selected.Stock : 1;
      const val = Math.max(1, parseInt(value) || 1);
      if (val > maxStock) {
        setQuantityError(`Only ${maxStock} units available in stock.`);
      } else {
        setQuantityError('');
      }
      setNewProduct(prev => ({
        ...prev,
        quantity: val
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductSelect = (e) => {
    setQuantityError('');
    setNewProduct(prev => ({
      ...prev,
      name: e.target.value,
      quantity: 1
    }));
  };


  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      alert("Product name is required");
      return;
    }
    const selected = productsByBranch.find(p => p.Name === newProduct.name);
    if (!selected) {
      alert("Invalid product selected.");
      return;
    }
    if (newProduct.quantity > selected.Stock) {
      setQuantityError(`Only ${selected.Stock} units available in stock.`);
      return;
    }
    setProductsToSell([...productsToSell, newProduct]);
    setNewProduct({ name: '', quantity: 1 });
    setShowModal(false);
    setQuantityError('');
  };

  const handleDeleteProduct = (indexToDelete) => {
    setProductsToSell(productsToSell.filter((_, idx) => idx !== indexToDelete));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!customerEmail || !selectedBranchName || productsToSell.length === 0) {
    alert("Please fill all fields and add at least one product.");
    return;
  }
  setSubmitLoading(true);
  const payload = {
    CustomerEmail: customerEmail,
    PaymentMethod: paymentMethod,
    BranchName: selectedBranchName,
    ProductsToSell: productsToSell.map(prod => ({
      Product: { Name: prod.name },
      Quantity: prod.quantity
    }))
  };
  try {
    await sendInStoreSale(payload);
    alert("Sale registered successfully 🎉");
    setCustomerEmail('');
    setSelectedBranchName('');
    setProductsToSell([]);
  } catch (error) {
    if (error.message === "Customer not found.") {
      alert("Customer not found. Please enter a registered customer email.");
    } else {
      alert("Error sending the sale order: " + error.message);
    }
  } finally {
    setSubmitLoading(false);
  }
};

  const selectedProduct = productsByBranch.find(p => p.Name === newProduct.name);

  return (
    <div style={{ padding: '2rem', height: '100vh' }}>
      <h2>💰 Register a Sale</h2>
      <form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId="email">
          <Form.Label>Customer Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@email.com"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            required
          />
          <Form.Text className="text-light">
            The customer must already be registered.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="paymentSelect" className="my-3">
          <Form.Label>Select Payment Method</Form.Label>
          <Form.Select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className={Styles["select"]}
          >
            <option value="Cash">Cash</option>
            <option value="Credit card">Credit card</option>
            <option value="Debit card">Debit card</option>
            <option value="Bank transfer">Bank transfer</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3' controlId="branchName">
          <Form.Label>Select Branch</Form.Label>
          <Form.Select
            required
            value={selectedBranchName}
            onChange={e => setSelectedBranchName(e.target.value)}
            className={`${Styles["category-select"]} ${Styles["select"]}`}
          >
            <option value="">-- Select --</option>
            {branchs.map(branch => (
              <option key={branch.IdBranch} value={branch.Name}>{branch.Name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          variant="primary"
          onClick={e => { e.preventDefault(); setShowModal(true); }}
          disabled={!selectedBranchName}
        >
          + Add Product
        </Button>
        {!selectedBranchName && (
          <div style={{ color: 'red', marginTop: 8 }}>Selecciona una branch antes de agregar productos.</div>
        )}

        <hr />
        <h4>📝 Products to Sell</h4>
        {productsToSell.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <ul className="list-group bg-dark">
            {productsToSell.map((product, index) => (
              <li key={index} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }}>
                <div onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} style={{ flex: 1 }}>
                  <strong>{product.name}</strong>
                  {expandedIndex === index && (
                    <div className="mt-2">
                      <p><strong>Quantity:</strong> {product.quantity}</p>
                    </div>
                  )}
                </div>
                <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(index)} style={{ marginLeft: '1rem' }}>
                  ❌
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Form.Group className="mb-3" controlId="button">
          <Button
            style={{ width: "100%", marginTop: "20px" }}
            as="input"
            type="submit"
            value={submitLoading ? "Sending..." : "Confirm"}
            disabled={submitLoading}
          />
        </Form.Group>
      </form>

      <Modal show={showModal} onHide={() => { setShowModal(false); setQuantityError(''); }}>
        <Modal.Header closeButton className='bg-dark'>
          <Modal.Title className='bg-dark'>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleProductSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Select
                name='name'
                value={newProduct.name}
                onChange={handleProductSelect}
                required
              >
                <option value="" className='bg-dark text-light'>-- Select Product --</option>
                {productsByBranch.map(prod => (
                  <option key={prod.Id} value={prod.Name} className='bg-dark text-light'>{prod.Name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                name='quantity'
                min={1}
                max={selectedProduct ? selectedProduct.Stock : 1}
                value={newProduct.quantity}
                onChange={handleNewProductChange}
                required
              />
              {selectedProduct && (
                <Form.Text className="text-muted">
                  Available: {selectedProduct.Stock}
                </Form.Text>
              )}
              {quantityError && (
                <div style={{ color: 'red', fontSize: 13 }}>{quantityError}</div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" style={{ width: '100%' }}>
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}