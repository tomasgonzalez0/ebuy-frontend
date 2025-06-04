import ProductsInterface from "../../components/ProductsInterface/ProductsInterface";
import { getListingBySupplier, getListingByOwn } from "../../helpers/product/onlineLIsting";
import { getProductImages } from "../../helpers/product/productService";
import { use, useEffect, useState } from "react";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const role = localStorage.getItem('role');
  const supplierId = localStorage.getItem('userId');

useEffect(() => {
    const fetchDataSupplier = async () => {
        const productsData = await getListingBySupplier(supplierId);

        const imagesPromises = productsData.map(async (product) => {
            const imageData = await getProductImages(product.IdProduct);
            return {
                idProduct: product.IdProduct, 
                images: imageData?.Images || []
            };
        });

        const allImages = await Promise.all(imagesPromises);

        const combined = productsData.map(product => {
            const matched = allImages.find(img => img.idProduct === product.IdProduct);
            return {
                ...product,
                name: product.Title,
                description: product.Description,
                price: product.Price,
                images: matched?.images?.map(img => `data:image/jpeg;base64,${img.Content}`) || [],
                status: product.IsActive
            };
        });

        
      
        setProducts(combined);
          
    };
    
   const fetchDataOwn = async () => {
    const userId = parseInt(localStorage.getItem('userId')); 
    const data = await getListingByOwn(); 

    const filteredProducts = data.filter(product => product.IdEmployee === userId);

    const imagesPromises = filteredProducts.map(async (product) => {
        const imageData = await getProductImages(product.IdProduct);
        return {
            idProduct: product.IdProduct, 
            images: imageData?.Images || []
        };
    });

    const allImages = await Promise.all(imagesPromises);

    const combined = filteredProducts.map(product => {
        const matched = allImages.find(img => img.idProduct === product.IdProduct);
        return {
            ...product,
            name: product.Title,
            description: product.Description,
            price: product.Price,
            images: matched?.images?.map(img => `data:image/jpeg;base64,${img.Content}`) || [],
            status: product.IsActive
        };
    });

    setProducts(combined);
    console.log("combinados",combined);
};

    

    if(role === "Supplier") {
        fetchDataSupplier();
    }else if(role === "Employee") {
        fetchDataOwn();
    } else {
        setProducts([]);
    }
}, []);


  return (
    <ProductsInterface title={"Your products"} category={role} products={products}/>
  );
}