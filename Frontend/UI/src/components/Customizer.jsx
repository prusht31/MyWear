import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Customizer.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

/* ── Inline SVG icons ── */
const IconColor = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="12" r="2.5"/>
    <circle cx="13.5" cy="17.5" r="2.5"/><circle cx="8.5" cy="12" r="2.5"/>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" strokeOpacity=".2"/>
  </svg>
);
const IconUpload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconPreview = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  </svg>
);
const IconCart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
  </svg>
);
const IconCanvas = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const Icon3D = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);

export default function Customizer() {
  const [color,         setColor]         = useState('#ffffff');
  const [images,        setImages]        = useState([]);
  const [price,         setPrice]         = useState(499);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isResizing,    setIsResizing]    = useState(false);
  const [showCartForm,  setShowCartForm]  = useState(false);
  const [fourSnapshots, setFourSnapshots] = useState([]);
  // Mobile tab: 'design' | 'preview'
  const [mobileTab,     setMobileTab]     = useState('design');
  const { user } = useAuth();

  /* ── Add to cart ── */
  const handleAddToCart = async (cartData) => {
    try {
      const cartItem = {
        email: user.email,
        color: cartData.color,
        imagesUsed: cartData.imageCount,
        customizationFee: cartData.price - 499,
        totalPrice: cartData.price,
        size: cartData.size,
        quantity: cartData.quantity,
        snapshots: {
          front: cartData.snapshots[0],
          back:  cartData.snapshots[1],
          left:  cartData.snapshots[2],
          right: cartData.snapshots[3],
        },
        createdAt: new Date(),
      };
      await axios.post('http://localhost:5000/api/cart/add', cartItem);
      toast.success('Item added to cart!');
    } catch (err) {
      console.error('❌ Failed to add to cart', err);
      toast.error('Failed to add to cart');
    }
  };

  /* ── Resize listeners ── */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && selectedIndex !== null) {
        setImages(prev => {
          const updated = [...prev];
          const newSize = Math.max(50, Math.min(400, updated[selectedIndex].size + e.movementX));
          updated[selectedIndex].size = newSize;
          return updated;
        });
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, selectedIndex]);

  /* ── Add image ── */
  const addImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const updated = [...images, { img, x: 0.1, y: 0.1, size: 200 }];
          setImages(updated);
          setPrice(499 + updated.length * 50);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  /* ── Wheel resize ── */
  const handleWheel = (e, index) => {
    e.preventDefault();
    const updated = [...images];
    const newSize = Math.max(50, Math.min(400, updated[index].size + e.deltaY * -0.1));
    updated[index].size = newSize;
    setImages(updated);
  };

  /* ── Delete image ── */
  const deleteImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPrice(499 + updated.length * 50);
  };

  /* ── Capture snapshots ── */
  const captureSnapshots = async ({ color, images, setFourSnapshots, setShowCartForm }) => {
    const views = [
      { name: 'front', y: 0 },
      { name: 'back',  y: Math.PI },
      { name: 'left',  y: Math.PI / 2 },
      { name: 'right', y: -Math.PI / 2 },
    ];
    const snapshots = [];
    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setSize(500, 500);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.5, 11);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const dirLight     = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(ambientLight, dirLight);
    const loader = new GLTFLoader();
    loader.load('/assets/tshirt.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);
      model.traverse((child) => {
        if (child.isMesh) {
          const canvas = document.createElement('canvas');
          canvas.width  = 1024;
          canvas.height = 1024;
          const ctx = canvas.getContext('2d');
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          images.forEach((img) => {
            const scale = 1024 / 500;
            ctx.drawImage(img.img, img.x * scale, img.y * scale, img.size * scale, img.size * scale);
          });
          const texture = new THREE.CanvasTexture(canvas);
          child.material = new THREE.MeshStandardMaterial({ map: texture });
          child.material.needsUpdate = true;
        }
      });
      views.forEach((view) => {
        model.rotation.set(0, view.y, 0);
        renderer.render(scene, camera);
        snapshots.push(renderer.domElement.toDataURL('image/jpeg', 0.7));
      });
      setFourSnapshots(snapshots);
      setShowCartForm(true);
    });
  };

  /* close modal on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShowCartForm(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="customizer-container">

      {/* ─── PAGE HEADER ─── */}
      <header className="customizer-header">
        <span className="customizer-eyebrow">3D Design Studio</span>
        <h1>Craft Your Identity</h1>
        <p>Place graphics, choose colors, and see your creation come alive in real-time 3D.</p>
      </header>

      {/* ─── MOBILE TAB SWITCHER ─── */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab${mobileTab === 'design' ? ' active' : ''}`}
          onClick={() => setMobileTab('design')}
        >
          <IconCanvas /> Design Canvas
        </button>
        <button
          className={`mobile-tab${mobileTab === 'preview' ? ' active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <Icon3D /> 3D Preview
        </button>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="Topper-custome">

        {/* ═══ LEFT: Template + Controls ═══ */}
        <div className={`left${mobileTab === 'design' ? ' mobile-active' : ''}`}>

          {/* Template editor */}
          <div className="template-editor">
            <h3>Design Canvas &amp; Double-click image to remove</h3>

            <div
              className="template-canvas"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const index = parseInt(e.dataTransfer.getData('imageIndex'));
                const rect = e.currentTarget.getBoundingClientRect();
                const updated = [...images];
                updated[index] = {
                  ...updated[index],
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                };
                setImages(updated);
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  onDoubleClick={() => deleteImage(i)}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('imageIndex', i)}
                  onDragEnd={(e) => {
                    const rect = e.currentTarget.parentNode.getBoundingClientRect();
                    const updated = [...images];
                    updated[i] = {
                      ...updated[i],
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    };
                    setImages(updated);
                  }}
                  style={{
                    position: 'absolute',
                    top: img.y,
                    left: img.x,
                    width: `${img.size}px`,
                    height: `${img.size}px`,
                    border: selectedIndex === i ? '2px solid #7b2ff7' : 'none',
                    cursor: 'move',
                  }}
                >
                  <img
                    src={img.img.src}
                    style={{ width: '100%', height: '100%' }}
                    draggable={false}
                    alt={`layer-${i}`}
                  />
                  {selectedIndex === i && (
                    <div
                      onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); }}
                      className="resize-handle"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="controls-title">Customization Options</div>

            <label>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                <IconColor /> Shirt Color
              </span>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>

            <label>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                <IconUpload /> Upload Graphic
              </span>
              <input type="file" accept="image/*" onChange={addImage} />
            </label>

            <div className="price-block">
              <div className="price-row">
                <span>Base Price</span>
                <span>₹499</span>
              </div>
              <div className="price-row">
                <span>Customization Fee</span>
                <span>₹{price - 499}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹{price}</span>
              </div>
            </div>

            <button
              className="btn-preview"
              onClick={() => captureSnapshots({ color, images, setFourSnapshots, setShowCartForm })}
            >
              <IconPreview /> Preview &amp; Add to Cart
            </button>
          </div>
        </div>

        {/* ═══ RIGHT: 3D Canvas ═══ */}
        <div className={`canvas-wrapper${mobileTab === 'preview' ? ' mobile-active' : ''}`}>
          <Canvas camera={{ position: [0, 1.2, 10], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model color={color} images={images} />
            <OrbitControls target={[0, 1, 0]} />
          </Canvas>
        </div>

      </div>

      {/* ─── CART FORM MODAL ─── */}
      {showCartForm && (
        <>
          <div
            className="cart-form-backdrop"
            onClick={() => setShowCartForm(false)}
          />
          <div className="cart-form" role="dialog" aria-modal="true" aria-label="Review Your Design">

            <div className="cart-form-header">
              <h3>Review Your Design</h3>
              <button
                className="cart-form-close"
                onClick={() => setShowCartForm(false)}
                aria-label="Close"
              >✕</button>
            </div>

            <div className="cart-form-body">

              <div className="cart-detail-rows">
                <div className="cart-detail-row">
                  <span>Shirt Color</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: 20, height: 20,
                      borderRadius: 5,
                      background: color,
                      border: '1.5px solid rgba(0,0,0,.12)',
                      flexShrink: 0,
                    }} />
                    <strong>{color.toUpperCase()}</strong>
                  </span>
                </div>
                <div className="cart-detail-row">
                  <span>Graphics Added</span>
                  <strong>{images.length} {images.length === 1 ? 'image' : 'images'}</strong>
                </div>
                <div className="cart-detail-row">
                  <span>Base Price</span>
                  <strong>₹499</strong>
                </div>
                <div className="cart-detail-row">
                  <span>Customization Fee</span>
                  <strong>₹{price - 499}</strong>
                </div>
                <div className="cart-detail-row">
                  <span>Total</span>
                  <strong style={{
                    fontSize: '1.05rem',
                    color: 'transparent',
                    background: 'linear-gradient(90deg, var(--c4), var(--c1))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}>₹{price}</strong>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddToCart({
                    color,
                    imageCount: images.length,
                    price,
                    size:     e.target.size.value,
                    quantity: e.target.quantity.value,
                    snapshots: fourSnapshots,
                  });
                  setShowCartForm(false);
                }}
              >
                <label>
                  Size
                  <select name="size" required>
                    <option value="">Select your size</option>
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                  </select>
                </label>

                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={1}
                    min={1}
                    max={10}
                    required
                  />
                </label>

                {fourSnapshots.length > 0 && (
                  <>
                    <p className="snapshot-section-title">Design Snapshots</p>
                    <div className="snapshot-grid">
                      {['Front', 'Back', 'Left', 'Right'].map((label, idx) =>
                        fourSnapshots[idx] ? (
                          <div className="snapshot-item" key={idx}>
                            <img src={fourSnapshots[idx]} alt={label} title={label} />
                            <span className="snapshot-label">{label}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </>
                )}

                <div className="cart-form-actions">
                  <button
                    type="button"
                    className="btn-recapture"
                    onClick={() => captureSnapshots({ color, images, setFourSnapshots, setShowCartForm })}
                  >
                    <IconRefresh /> Re-capture Snapshots
                  </button>
                  <button type="submit" className="btn-add-cart">
                    <IconCart /> Add to Cart
                  </button>
                </div>

              </form>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

/* ════════════════════════
   3D MODEL — UNCHANGED
   ════════════════════════ */
function Model({ color, images }) {
  const ref = useRef();
  const [model, setModel] = useState();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/assets/tshirt.glb', (gltf) => { setModel(gltf.scene); });
  }, []);

  useFrame(() => { if (model) model.rotation.y += 0.00; });

  useEffect(() => {
    if (!model) return;
    model.traverse((child) => {
      if (child.isMesh) {
        const canvas = document.createElement('canvas');
        canvas.width  = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        images.forEach((img) => {
          const scaleX = 1024 / 500;
          const scaleY = 1024 / 600;
          ctx.drawImage(img.img, img.x * scaleX, img.y * scaleY, 200, 200);
        });
        const texture = new THREE.CanvasTexture(canvas);
        child.material = new THREE.MeshStandardMaterial({ map: texture });
        child.material.needsUpdate = true;
      }
    });
  }, [color, images, model]);

  return model
    ? <primitive object={model} ref={ref} scale={1.5} position={[0, -1.1, 0]} />
    : null;
}