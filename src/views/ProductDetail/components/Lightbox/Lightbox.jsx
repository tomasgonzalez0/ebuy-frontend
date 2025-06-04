import { useState } from "react";
import styles from "./Lightbox.module.css";
import { SecondaryImage } from "../ProductImages/ProductImages";

export default function Lightbox({ images, initialIndex, onClose, onChangeImage }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    function handlePrev() {
        setCurrentIndex(prev => {
            const value = prev === 0 ? images.length - 1 : prev - 1;
            onChangeImage(value);
            return value;
        });
    }
    
    function handleNext() {
        setCurrentIndex(prev => {
            const value = prev === images.length - 1 ? 0 : prev + 1;
            onChangeImage(value);
            return value;
        });
    }
    function handleSecondaryImageClick(index) {
        setCurrentIndex(index);
        onChangeImage(index);
    }

    return (
        <div className={styles["div__lightboxContainer"]}>
            
            <div className={styles["div__lightboxContainer--lightbox"]}>
            <button className={styles["lightboxContainer__closeButton"]} onClick={onClose}>×</button>
                <button className={styles["lightboxContainer__prevButton"]} onClick={handlePrev}>‹</button>
                <div className={styles["lightboxContainer__imageContainer"]}>
                    <img src={images[currentIndex]} alt="" className={styles["lightboxContainer__image"]}/>
                </div>
                
                <button className={styles["lightboxContainer__nextButton"]} onClick={handleNext}>›</button>
                
                
            </div>
                
           <div className={styles["div__lightboxContainer--secondaryImages"]}>
                           {images.map((image, index) => (
                               <SecondaryImage 
                                   key={index} 
                                   image={image} 
                                   isSelected={currentIndex === index}
                                   onClick={() => handleSecondaryImageClick(index)}
                               />
                           ))}
            </div>
        </div>
    );
}
