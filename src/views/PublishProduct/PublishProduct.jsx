import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Styles from './PublishProduct.module.css';
import Button from 'react-bootstrap/Button';
import { getProducts } from '../../helpers/product/productService';
import axios from 'axios';

export default function PublishProduct() {
  const { '*': fullPath } = useParams();
  const rol = localStorage.getItem('role')

  const [productNameOptions, setProductNameOptions] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      setProductNameOptions(productsData.map(product => product.Name));
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productName') {
      setSelectedProductName(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplierId = localStorage.getItem('userId');

    if (!supplierId) {
      alert('No se encontró el ID del proveedor (supplierId).');
      return;
    }
    let url = '';
    if(rol === 'Supplier'){
       url = `http://ebuy.runasp.net/api/OnlineListingBySuppliers/Add?IdSupplier=${supplierId}&productName=${encodeURIComponent(selectedProductName)}`;
    }
    else if(rol === 'Employee'){
       url = `http://ebuy.runasp.net/api/OnlineListingOwns/Add?IdEmployee=${supplierId}&productName=${encodeURIComponent(selectedProductName)}`;
    }

    const body = {
      Description: formData.description,
      Price: parseFloat(formData.price),
      AvailableQuantity: parseInt(formData.stock),
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
      });

      alert('Producto publicado exitosamente.');
      console.log(response.data);
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      alert('Ocurrió un error al publicar el producto.');
    }
  };

  return (
    <div style={{ padding: '2rem', height: '100%' }}>
      <h2>📦 Publish a New Product ({rol})</h2>
      <form onSubmit={handleSubmit}>
        {/* Selección del nombre del producto */}
        <Form.Group className='mb-3' controlId="productName">
          <Form.Label>Select Product</Form.Label>
          <Form.Select
            name="productName"
            className={`${Styles["category-select"]} ${Styles["select"]}`}
            required
            value={selectedProductName}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            {productNameOptions.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {rol === 'Employee' && (
          <>
            
            <Form.Group className="mb-3" controlId="button">
              <Button
                style={{ width: '100%', marginTop: '20px' }}
                as="input"
                type="submit"
                value="Submit"
              />
            </Form.Group>
          </>
        )}

        {rol === 'Supplier' && (
          <>
       <Form.Group className="mb-3" controlId="description">
  <Form.Label>Product Description</Form.Label>
  <Form.Control
    type="text"
    name="description"
    placeholder="Enter a Description"
    required
    value={formData.description}
    onChange={handleChange}
    maxLength={300}
  />
  <Form.Text muted>
    {formData.description.length}/300 characters
  </Form.Text>
</Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter the sale price"
                required
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                placeholder="Enter the stock"
                required
                value={formData.stock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="button">
              <Button
                style={{ width: '100%', marginTop: '20px' }}
                as="input"
                type="submit"
                value="Submit"
              />
            </Form.Group>
          </>
        )}
      </form>
    </div>
  );
}
