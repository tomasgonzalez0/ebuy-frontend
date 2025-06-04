import { useState } from "react";
import styles from "./ProductImages.module.css";
import Lightbox from "../Lightbox/Lightbox"

export default function ProductImage({ productInformation }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    function handleSecondaryImageClick(index) {
        setSelectedImage(index);
    }

    function handlePrincipalImageClick() {
        setLightboxOpen(true);
    }

    return (
        <div className={styles["div__imagesContainer"]}>
            <div className={styles["div__imagesContainer--principalImageContainer"]} onClick={handlePrincipalImageClick}>
                <PrincipalImage principalImage={productInformation[selectedImage]} />  
            </div>

            <div className={styles["div__imagesContainer--secondaryImages"]}>
                {productInformation.map((image, index) => (
                    <SecondaryImage 
                        key={index} 
                        image={image} 
                        isSelected={selectedImage === index}
                        onClick={() => handleSecondaryImageClick(index)}
                    />
                ))}
            </div>

            {lightboxOpen && (
                <Lightbox 
                    images={productInformation} 
                    initialIndex={selectedImage}
                    onClose={() => setLightboxOpen(false)}
                    onChangeImage={(index) => setSelectedImage(index)}
                />
            )}
        </div>
    );
}

export function PrincipalImage({ principalImage }) {
    return <img src={principalImage} alt="" className={styles["div__principalImageContainer--principalImage"]}/>;
}

export function SecondaryImage({ image, isSelected, onClick }) {
    return (
        <div className={`${styles["div__secondaryImageContainer"]}  ${isSelected ? styles["selected"]: ""}`}>
            <img 
                src={image} 
                alt="" 
                onClick={onClick} 
                className={styles["div__secondaryImageContainer--secondaryImage"]}
            />
        </div>
    );
}