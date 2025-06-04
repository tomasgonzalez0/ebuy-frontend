import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Styles from './TopSellProducts.module.css';

function TopSellProducts({ topSell }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  if (!topSell || topSell.length === 0) {
    return (
      <div className={Styles["top-sell-products"]}>
        <div>Cargando productos destacados...</div>
      </div>
    );
  }

  return (
    <div className={Styles["top-sell-products"]}>
      <Carousel className={Styles["carousel"]} activeIndex={index} onSelect={handleSelect}>
        {topSell.map((product, idx) => (
          <Carousel.Item className={Styles["carousel-item"]} key={product.IdProduct || idx}>
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : ""}
              alt={product.name || product.title || "Product"}
              className={Styles["carousel-item-image"]}
            />
            <Carousel.Caption className={Styles["carousel-caption"]}>
              <h3>{product.name || product.title}</h3>
              <p>{product.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default TopSellProducts;