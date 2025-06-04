import Image from 'react-bootstrap/Image';
import skinCareImage from '../../../../images/skincare.png'
import toys from '../../../../images/toys.png'
import gadgets from '../../../../images/gadgets.png'
import Styles from './PrincipalCategories.module.css';
import clothes from '../../../../images/clothes.png';
import sports from '../../../../images/sports.png';
import health from '../../../../images/health.png';
import { getCategories } from '../../../../helpers/categories/categoriesService';
import Subtitle from '../../../../components/Subtitle/Subtitle';
import { use, useEffect, useState } from 'react';

function PrincipalCategories({categories}) {


  return (
    <section className={Styles["principal-categories"]}>     
        <Subtitle text="Our Principal Categories" />   
        <div className={Styles["categories-container"]}>
            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={gadgets} roundedCircle />
                <p>{categories[11]?.Name || "Category"}</p>
            </div>
 
            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={skinCareImage} roundedCircle />
                <p>{categories[2]?.Name || "Category"}</p>
            </div>
            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={toys} roundedCircle />
                <p>{categories[12]?.Name || "Category"}</p>
            </div>
            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={clothes} roundedCircle />
                <p>{categories[4]?.Name || "Category"}</p>
            </div>
            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={sports} roundedCircle />
                <p>{categories[10]?.Name || "Category"}</p>
            </div>

            <div className={Styles["category-item"]}>
                <Image className={Styles["rounded-image"]} src={health} roundedCircle />
                <p>{categories[6]?.Name || "Category"}</p>
            </div>
        </div>

    </section>
    );

}
export default PrincipalCategories;