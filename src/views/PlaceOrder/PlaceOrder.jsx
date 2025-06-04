import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Styles from './PlaceOrder.module.css';
import { getSuppliers } from '../../helpers/suppliers/getSuppliers';
import { getCategories } from '../../helpers/categories/categoriesService';
import { getBrands } from '../../helpers/brands/brandsService';
import { sendPurchaseOrder } from '../../helpers/purchases/purchasesService';
import { getBranchs } from '../../helpers/branch/branch';
import { getProductsByBranch } from '../../helpers/product/productService';

export default function PlaceOrder() {
  const [supplierNameOptions, setSupplierNameOptions] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [addedProducts, setAddedProducts] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    warrantyMonths: '',
    categoryName: '',
    brandName: '',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [branchs, setBranchs] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const suppliers = await getSuppliers();
      const categories = await getCategories();
      const brands = await getBrands();
      const branchs = await getBranchs();

      setBranchs(branchs);
      setSupplierNameOptions(suppliers);
      setCategories(categories);
      setBrands(brands);
    };

    const total = addedProducts.reduce((acc, product) => {
      const cost = parseFloat(product.costPrice) || 0;
      const stock = parseInt(product.stock) || 0;
      return acc + (cost * stock);
    }, 0);

    setTotalPrice(total);
    fetchInitialData();
  }, [addedProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplierId || addedProducts.length === 0) {
      alert("Debes seleccionar un proveedor y añadir al menos un producto.");
      return;
    }

    if (!selectedSupplierId || isNaN(parseInt(selectedSupplierId))) {
  alert("Debes seleccionar un proveedor válido.");
  return;
}

    try {
      const formattedPayload = {
        IdSupplier: Number(selectedSupplierId),
        BranchName: selectedBranchName,
        PaymentMethod: paymentMethod,
        ProductsToBuy: addedProducts.map(product => ({
          Product: {
            Name: product.name,
            Description: product.description,
            CategoryName: product.categoryName,
            BrandName: product.brandName,
            CostPrice: parseFloat(product.costPrice),
            SalePrice: parseFloat(product.salePrice),
            WarrantyMonths: parseInt(product.warrantyMonths),
          },
          Quantity: parseInt(product.stock),
        }))
      };

      console.log("Payload a enviar:", JSON.stringify(formattedPayload, null, 2));
      await sendPurchaseOrder(formattedPayload);
      alert("Orden de compra enviada exitosamente 🎉");

      setSelectedSupplierId('');
      setAddedProducts([]);
      setTotalPrice(0);

    } catch (error) {
      alert("Error al enviar la orden: " + error.message);
    }
  };

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    setAddedProducts([...addedProducts, newProduct]);
    setNewProduct({
      name: '',
      description: '',
      costPrice: '',
      salePrice: '',
      stock: '',
      warrantyMonths: '',
      categoryName: '',
      brandName: '',
    });
    setShowModal(false);
  };

  const handleDeleteProduct = (indexToDelete) => {
    const updatedProducts = addedProducts.filter((_, index) => index !== indexToDelete);
    setAddedProducts(updatedProducts);
  };

  return (
    <div style={{ padding: '2rem', height: '100vh' }}>
      <h2>🛒 Place an Order</h2>
      <form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId="supplierName">
          <Form.Label>Select Supplier</Form.Label>
          <Form.Select
            required
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className={`${Styles["category-select"]} ${Styles["select"]}`}
          >
            <option value="">-- Select --</option>
            {supplierNameOptions.map(supplier => (
              <option key={supplier.IdSupplier} value={supplier.Id}>{supplier.Name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3' controlId="branchName">
          <Form.Label>Select Branch</Form.Label>
          <Form.Select
            required
            value={selectedBranchName}
            onChange={(e) => setSelectedBranchName(e.target.value)}
            className={`${Styles["category-select"]} ${Styles["select"]}`}
          >
            <option value="">-- Select --</option>
            {branchs.map(branch => (
              <option key={branch.IdBranch} value={branch.Name}>{branch.Name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="paymentSelect" className="my-3">
          <Form.Label>Select Payment Method</Form.Label>
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

        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add New Product
        </Button>

        <hr />
        <h2>Total: ${totalPrice.toFixed(2)}</h2>

        <Form.Group className="mb-3" controlId="button">
          <Button style={{ width: "100%", marginTop: "20px" }} as="input" type="submit" value="Order" />
        </Form.Group>
      </form>

      <hr />
      <h4>📝 Products to Order</h4>
      {addedProducts.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <ul className="list-group bg-dark">
          {addedProducts.map((product, index) => (
            <li key={index} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }}>
              <div onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} style={{ flex: 1 }}>
                <strong>{product.name}</strong>
                {expandedIndex === index && (
                  <div className="mt-2">
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Cost Price:</strong> ${product.costPrice}</p>
                    <p><strong>Sale Price:</strong> ${product.salePrice}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Warranty:</strong> {product.warrantyMonths} months</p>
                    <p><strong>Category:</strong> {product.categoryName}</p>
                    <p><strong>Brand:</strong> {product.brandName}</p>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className='bg-dark'>
          <Modal.Title className='bg-dark'>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleProductSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control name='name' value={newProduct.name} onChange={handleNewProductChange} required />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name='description' value={newProduct.description} onChange={handleNewProductChange} required />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Cost Price</Form.Label>
              <Form.Control type='number' name='costPrice' value={newProduct.costPrice} onChange={handleNewProductChange} required />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Sale Price</Form.Label>
              <Form.Control type='number' name='salePrice' value={newProduct.salePrice} onChange={handleNewProductChange} required />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Stock</Form.Label>
              <Form.Control type='number' name='stock' value={newProduct.stock} onChange={handleNewProductChange} required />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Warranty (Months)</Form.Label>
              <Form.Control type='number' name='warrantyMonths' value={newProduct.warrantyMonths} onChange={handleNewProductChange} required />
            </Form.Group>

           <Form.Group className='mb-3'>
          <Form.Label>Category</Form.Label>
            <Form.Select
              name='categoryName'
              value={newProduct.categoryName}
              onChange={handleNewProductChange}
              required
            >
              <option value="" className='bg-dark'>-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.IdCategory} value={cat.Name} className='bg-dark'>{cat.Name}</option>
              ))}
            </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Brand</Form.Label>
            <Form.Select
              name='brandName'
              value={newProduct.brandName}
              onChange={handleNewProductChange}
              required
            >
              <option value="" className='bg-dark'>-- Select Brand --</option>
              {brands.map(brand => (
                <option key={brand.IdBrand} value={brand.Name} className='bg-dark'>{brand.Name}</option>
              ))}
            </Form.Select>
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
