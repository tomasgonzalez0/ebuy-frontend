import { Card, Button, Row, Col, Form } from "react-bootstrap";
import styles from "./CartItem.module.css";
import { getProductById } from "../../../../helpers/product/productService";
import { useEffect, useState } from "react";

export default function CartItem({ product, onQuantityChange, onRemove }) {
  const [productStock, setProductStock] = useState(product.AvaliableStock);
  return (
    <Card className={`${styles["card"]} mb-3 w-100`}>
      <Row className={`${styles["row"]} g-0 align-items-center p-2`}>
        <Col md={2}>
          <Card.Img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.Name}
            className={styles["img"]}
          />
        </Col>
        <Col md={5}>
          <Card.Body>
            <Card.Title className="mb-1">{product.Name}</Card.Title>
            <Card.Text className={styles["seller"]}>Sold by: {product.BranchName}</Card.Text>
          </Card.Body>
        </Col>
        <Col md={1}>
        <Form.Control
          type="number"
          min={1}
          max={productStock}
          value={product.Quantity}
          className={styles["quantity-input"]}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value > productStock) value = productStock;
            if (value < 1 || isNaN(value)) value = 1;
            onQuantityChange(product.id, value);
          }}
        />
        </Col>
        <Col md={2}>
          <Card.Body>
            <Card.Text className="fw-bold fs-5">
              ${Number(product.price).toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={2}>
          <Button variant="danger" onClick={() => onRemove(product.id)}>
            Remove
          </Button>
        </Col>
      </Row>
    </Card>
  );
}