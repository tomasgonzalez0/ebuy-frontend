import Styles from './ProductDetail.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Topbar from '../../components/Topbar/Topbar';
import ProductImage from './components/ProductImages/ProductImages';
import ProductInfo from './components/ProductInfo/ProductInfo';
import LoadingSpinner from '../components/Loader/Loading';
import { getProductById, getProductImages } from '../../helpers/product/productService';
import { getOnlineListing, getPublisherName } from '../../helpers/product/onlineLIsting';
import { getCart } from '../../helpers/cart/cart';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publisherName, setPublisherName] = useState('');
    const [cartItems, setCartItems] = useState(0);
    let role = localStorage.getItem("role");
    let Email = localStorage.getItem("userEmail");
    let customerId = localStorage.getItem("Id");

    useEffect(() => {
        setLoading(true); // <-- loading inicia en true
        const fetchProduct = async () => {
            const listenings = await getOnlineListing();
            const productData = listenings.find(product => product.Id === parseInt(id));
            if (!productData) {
                setProduct(null);
                setLoading(false);
                return;
            }
            const imageData = await getProductImages(productData.IdProduct);
            const publisher = await getPublisherName(productData.Id);

            const processedProduct = {
                ...productData,
                name: productData.Title,
                description: productData.Description,
                images: imageData?.Images?.map(img => `data:image/jpeg;base64,${img.Content}`) || []
            };

            setProduct(processedProduct);
            setPublisherName(publisher);
            setLoading(false); // <-- loading termina cuando todo está listo
        };

        const fetchCartItems = async () => {
            if (customerId && role === "Customer") {
                const cart = await getCart(customerId);
                const safeCart = Array.isArray(cart) ? cart : [];
                const total = safeCart.reduce((sum, p) => sum + (Number(p.Quantity) || 1), 0);
                setCartItems(total);
            }
        };

        fetchProduct();
        fetchCartItems();
    }, [id, customerId]);

    const handleAddToCart = () => {
        setCartItems(prev => prev + 1);
    };

    if (loading) return <LoadingSpinner text="Loading product..." />;
    if (!product) return <h1>Product not found</h1>;

    return (
        <article className={Styles["product-detail"]}>
            <Topbar Email={Email} numberOfItems={cartItems} />
            <section className={Styles["content"]}>
                <ProductImage productInformation={product.images} />
                <ProductInfo
                    product={product}
                    publisherName={publisherName}
                    role={role}
                    onAddToCart={handleAddToCart}
                    productId={product.IdProduct}
                />
            </section>
        </article>
    );
}