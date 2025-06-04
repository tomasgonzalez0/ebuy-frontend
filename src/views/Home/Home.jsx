import { useEffect, useState } from 'react';
import { getProductImages } from '../../helpers/product/productService';
import { getCart } from '../../helpers/cart/cart';
import { getCategories } from '../../helpers/categories/categoriesService';
import { getOnlineListing } from '../../helpers/product/onlineLIsting';
import TopSellProducts from './components/TopSellProducts/TopSellProducts';
import PrincipalCategories from './components/PrincipalCategories/PrincipalCategories';
import ProductsInterface from '../../components/ProductsInterface/ProductsInterface';
import LoadingSpinner from '../components/Loader/Loading';
import Topbar from '../../components/Topbar/Topbar';
import Styles from './Home.module.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState(0);
    const [topSell, setTopSell] = useState([]);
    const [loading, setLoading] = useState(true);

    let token = localStorage.getItem("token");
    let Email = localStorage.getItem("userEmail");
    let Id = localStorage.getItem("Id");
    let role = localStorage.getItem("role");
    const [categories, setCategories] = useState([]);
useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const productsData = await getOnlineListing();
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
                status: true
            };
        });
        setProducts(combined);

        function selectThreeProducts(products) {
            const validProducts = products.filter(Boolean);
            if (validProducts.length <= 3) return validProducts;
            const selected = new Set();
            while (selected.size < 3) {
                const idx = Math.floor(Math.random() * validProducts.length);
                selected.add(validProducts[idx]);
            }
            return Array.from(selected);
        }
        setTopSell(selectThreeProducts(combined));
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

const fetchCart = async () => {
    if (Email && token && role === "Customer") {
        const cartProducts = await getCart(Id);
        const safeCart = Array.isArray(cartProducts) ? cartProducts : [];
        const totalItems = safeCart.reduce((sum, product) => sum + (product.Quantity || 0), 0);
        setCartItems(totalItems);
        setCart(safeCart);
    } else {
        setCartItems(0);
    }
};

    // Ejecuta todas las funciones y espera a que terminen
    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([
            fetchData(),
            fetchCategories(),
            fetchCart()
        ]);
        setLoading(false);
    };

    fetchAll();
}, []);

    if (loading) return <LoadingSpinner text="Loading..." />;
    console.log(products);
    console.log(images);
    return (
        <article className={Styles["home"]}>
            {(Email !== null && token !== null) ? <Topbar Email={Email} token={token} cart={cart} numberOfItems={cartItems}/> : <Topbar numberOfItems={cartItems}/>}
            <TopSellProducts topSell={topSell}/>
            <PrincipalCategories categories={categories} />
            <ProductsInterface 
                category="home" 
                title="Featured Products" 
                products={products} 
                />
        </article>
    );
}
