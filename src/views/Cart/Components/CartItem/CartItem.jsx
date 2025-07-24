import { Card, Button, Row, Col, Form } from "react-bootstrap";
import styles from "./CartItem.module.css";
import { useState } from "react";

export default function CartItem({ product, onQuantityChange, onRemove }) {
  const [productStock] = useState(product.AvaliableStock);

  return (
    <Card className={`${styles.card} mb-3 w-100`}>
      <Row className={`${styles.row} g-0 align-items-center p-2`}>
        <Col xs={4} md={2} className={styles.imgCol}>
          <Card.Img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.Name}
            className={styles.img}
          />
        </Col>
        <Col xs={8} md={5}>
          <Card.Body className={styles.body}>
            <Card.Title className={styles.title}>{product.Name}</Card.Title>
            <Card.Text className={styles.seller}>Sold by: {product.BranchName}</Card.Text>
          </Card.Body>
        </Col>
        <Col xs={6} md={1} className="d-flex justify-content-center align-items-center">
          <Form.Control
            type="number"
            min={1}
            max={productStock}
            value={product.Quantity}
            className={styles["quantity-input"]}
            aria-label="Product quantity"
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value > productStock) value = productStock;
              if (value < 1 || isNaN(value)) value = 1;
              onQuantityChange(product.id, value);
            }}
          />
        </Col>
        <Col xs={6} md={2} className="d-flex justify-content-center align-items-center">
          <Card.Body className={styles.body}>
            <Card.Text className={styles.price}>
              ${Number(product.price).toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Col>
        <Col xs={12} md={2} className="d-flex justify-content-center align-items-center mt-2 mt-md-0">
          <Button
            variant="danger"
            className={styles.removeBtn}
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.Name} from cart`}
          >
            Remove
          </Button>
        </Col>
      </Row>
    </Card>
  );
}