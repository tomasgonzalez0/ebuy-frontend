import Image from 'react-bootstrap/Image';
import skinCareImage from '../../../../images/skincare.png';
import toys from '../../../../images/toys.png';
import gadgets from '../../../../images/gadgets.png';
import Styles from './PrincipalCategories.module.css';
import clothes from '../../../../images/clothes.png';
import sports from '../../../../images/sports.png';
import health from '../../../../images/health.png';
import Subtitle from '../../../../components/Subtitle/Subtitle';

function PrincipalCategories({ categories }) {
  const categoryData = [
    { img: gadgets, idx: 11 },
    { img: skinCareImage, idx: 2 },
    { img: toys, idx: 12 },
    { img: clothes, idx: 4 },
    { img: sports, idx: 10 },
    { img: health, idx: 6 },
  ];

  return (
    <section className={Styles["principal-categories"]} aria-label="Principal categories">
      <Subtitle text="Our Principal Categories" />
      <div className={Styles["categories-container"]}>
        {categoryData.map(({ img, idx }, i) => (
          <div className={Styles["category-item"]} key={i} tabIndex={0} aria-label={categories[idx]?.Name || "Category"}>
            <Image className={Styles["rounded-image"]} src={img} roundedCircle alt={categories[idx]?.Name || "Category"} />
            <p>{categories[idx]?.Name || "Category"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PrincipalCategories;