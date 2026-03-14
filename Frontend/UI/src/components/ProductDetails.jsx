import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';


const ModelViewer = ({ model }) => {
    if (!model) return <div style={{ height: '400px', background: '#111' }}>Loading 3D Model...</div>;
    
    return (
        <Canvas className="product-canvas" camera={{ position: [0, 1, 5], fov: 50 }} style={{height: '480px', width: '100%'}}>
      <ambientLight intensity={1} />
      <Stage environment="city" intensity={0.8}>
        <primitive object={model} scale={2.5} />
      </Stage>
      <OrbitControls enableZoom />
    </Canvas>
  );
};  

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [viewMode, setViewMode] = useState('2D');
  const [model, setModel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth(); 

   const handleAddToCart = async () => {
    if (!user?.email) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      const cartItem = {
        email: user.email,
        title: product.title,
        image: product.image,
        price: product.price,
        size: product.selectedSize || 'M',
        quantity: product.quantity || 1,
        snapshots: {
          front: `http://localhost:5000/${product.image}` 
        },
        totalPrice: product.price * (product.quantity || 1),
        color: '#ffffff', 
        createdAt: new Date()
      };

      await axios.post('http://localhost:5000/api/cart/add', cartItem);
      toast.success('Product added to cart');
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Could not add product to cart");
    }
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
}, [id]);



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.model3D) load3DModel(res.data.model3D);
        fetchSimilar(res.data.category);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    const fetchSimilar = async (category) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?category=${category}`);
        const filtered = res.data.filter(p => p._id !== id);
        setSimilar(filtered);
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      }
    };

    const load3DModel = (path) => {
      const loader = new GLTFLoader();
      loader.load(`http://localhost:5000/${path}`, (gltf) => {
        setModel(gltf.scene);
      });
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="product-details-container">Loading...</div>;

  return (
    <div className="product-details-container">
      <div className="product-main">
        {/* Left Side */}
        <div className="product-image-section">
          {viewMode === '2D' ? (
            <img
              
              src={`http://localhost:5000/${product.image}`}
              alt={product.title}
              className="product-image"
              // style={{height:'500px', width: '40vw', borderRadius: '30px'}}
            />
          ) : (
            <ModelViewer model={model} />
          )}
          <div className="view-toggle">
            <button onClick={() => setViewMode('2D')} className={viewMode === '2D' ? 'active' : ''}>2D View</button>
            <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'active' : ''}>3D View</button>
          </div>
          {/* <div className="view-toggle">
  <button
    className={viewMode === '2D' ? 'active' : ''}
    onClick={() => setViewMode('2D')}
  >
    2D View
  </button>

  <button
    className={viewMode === '3D' ? 'active' : ''}
    onClick={() => setViewMode('3D')}
  >
    3D View
  </button>
</div> */}

        </div>

        {/* Right Side */}
        <div className="product-info-section">
          <h1>{product.title}</h1>
          <p className="brand">By {product.brand}</p>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          {/* Size Selection */}
<div className="size-quantity">
  <div className="size-selector">
    <h4>Size:</h4>
    <div className="size-options">
      {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
        <button
          key={size}
          className={`size-btn ${product.selectedSize === size ? 'selected' : ''}`}
          onClick={() => setProduct({ ...product, selectedSize: size })}
        >
          {size}
        </button>
      ))}
    </div>
  </div>

  {/* Quantity Selector */}
  <div className="quantity-selector">
    <h4>Quantity:</h4>
    <div className="quantity-controls">
      <button onClick={() => setProduct({ ...product, quantity: Math.max(1, (product.quantity || 1) - 1) })}>–</button>
      <span>{product.quantity || 1}</span>
      <button onClick={() => setProduct({ ...product, quantity: (product.quantity || 1) + 1 })}>+</button>
    </div>
  </div>
</div>

{/* Buttons */}
<div className="product-actions">
  <button className="btn-buy">Buy Now</button>
  <button className="btn-cart" onClick={handleAddToCart}>Add to Cart</button>
</div>

        </div>
      </div>

      {/* Similar Products */}
      <div className="similar-products-section">
  <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>Similar Products</h2>
  <div className="similar-scroll-container">
    
    {currentIndex > 0 && (
      <button className="scroll-left" onClick={() => setCurrentIndex(currentIndex - 1)}>❮</button>
    )}

    <div className="similar-products" >
      {similar.slice(currentIndex, currentIndex + 3).map(item => (
        <div
          key={item._id}
          className="similar-card"
          onClick={() => navigate(`/product/${item._id}`)}
        >
          <img src={`http://localhost:5000/${item.image}`} alt={item.title} />
          <div className="similar-info">
            <h3>{item.title}</h3>
            <p>₹{item.price}</p>
          </div>
        </div>
      ))}
    </div>

    {currentIndex + 3 < similar.length && (
      <button className="scroll-right" onClick={() => setCurrentIndex(currentIndex + 1)}>❯</button>
    )}
  </div>
</div>


    </div>
  );
}
