import Subtitle from "../Subtitle/Subtitle";
import Styles from "./ProductsInterface.module.css";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { switchStatusProduct } from "../../helpers/product/productService";

export default function ProductsInterface({category, title, products}) {
    return(
        <section className={Styles["products-interface"]}>
            <Subtitle text={title}/>
            <Products category={category} products={products}/>
        </section>
    );
}

function Products({category, products}) {
    const [localProducts, setLocalProducts] = useState(products);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLocalProducts(products);
    }, [products]);

    async function handleActiveSwitch(index) {
        await switchStatusProduct(localProducts[index].IdOnlineListing);
        setLocalProducts(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                status: !updated[index].status 
            };
            return updated;
        });
    }

    function handleOpenModal(index) {
        setSelectedProductIndex(index);
        setShowModal(true);
        setUploadError('');
        setUploadSuccess('');
        setImageFile(null);
    }

    function handleCloseModal() {
        setShowModal(false);
        setSelectedProductIndex(null);
        setImageFile(null);
        setUploadError('');
        setUploadSuccess('');
    }

    function handleImageChange(e) {
        setImageFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    }

    async function handleImageUpload() {
        if (!imageFile || selectedProductIndex === null) {
            setUploadError("Please select an image.");
            return;
        }
        setUploading(true);
        setUploadError('');
        setUploadSuccess('');
        const product = localProducts[selectedProductIndex];
        const formData = new FormData();
        formData.append("files", imageFile);

        try {
            const response = await fetch(
                `http://ebuy.runasp.net/api/UploadFiles?Data=${product.IdProduct}&Proccess=Product`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
               
                                    "Authorization":`${token}`
                    }
                }
            );
            if (!response.ok) {
                throw new Error("Failed to upload image");
            }
            setUploadSuccess("Image uploaded successfully!");
        } catch (err) {
            setUploadError("Error uploading image.");
        } finally {
            setUploading(false);
        }
    }

    if(category === "Employee" || category === "Supplier"){
        return(
        <>
        <section className={Styles["products-container"]}>
            {localProducts.map((product, index) => (
                <Card key={index} style={{ width: '18rem' }} className={Styles["product-card"]}>
                    <Card.Img
                        variant="top"
                        src={product.images[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                    />
                    <Card.Body className={Styles["card-body"]}>
                        <Card.Title id={Styles["title"]}>{product.name}</Card.Title>
                        <Card.Text>
                            {product.Description}
                        </Card.Text>
                        <p className={Styles["price"]}>${product.price}</p>
                        <Button
                            variant="outline-primary"
                            className={Styles["inactivate-sale"]}
                            onClick={() => handleOpenModal(index)}
                        >
                            Actions
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </section>
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton className="bg-dark">
                <Modal.Title>Product Actions</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
                {selectedProductIndex !== null && (
                    <>
                        <div className="mb-3">
                            <Button
                                variant={localProducts[selectedProductIndex].status ? "outline-danger" : "outline-secondary"}
                                onClick={() => {
                                    handleActiveSwitch(selectedProductIndex);
                                }}
                                className="mb-3 w-100"
                            >
                                {localProducts[selectedProductIndex].status ? "Inactivate sale" : "Put on sale"}
                            </Button>
                        </div>
                        <Form.Group controlId="formFile" className="mb-3 ">
                            <Form.Label>Upload product image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Group>
                        <Button
                            variant="success"
                            className="w-100"
                            onClick={handleImageUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
                        {uploadSuccess && <div className="text-success mt-2">{uploadSuccess}</div>}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
        );
    }
    return(
    <section className={Styles["products-container"]}>
        {products.map((product, index) => (
            product.status &&(
            <Card key={index} style={{ width: '18rem' }} className={Styles["product-card"]}>
                        <Card.Img
                        variant="top"
                        src={product.images[0] || "https://via.placeholder.com/300x200?text=No+Image"
                        }
                    />
                <Card.Body className={Styles["card-body"]}>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                        {product.Description}
                    </Card.Text>
                        <p className={Styles["price"]}>${product.price}</p>
                        <NavLink to={`/product/${product.Id}`}>
                            <Button variant="outline-warning" className={Styles["add-button"]}>View product</Button>
                        </NavLink>
                </Card.Body>
            </Card>)
        ))}
    </section>
    );
}