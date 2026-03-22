/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, FormEvent, ReactNode, MouseEvent, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Facebook, 
  Instagram, 
  Phone, 
  Mail, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Home,
  User,
  Briefcase,
  LayoutGrid,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react';
import { NavBar } from './components/ui/tubelight-navbar';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore';
import { auth } from './firebase';

// --- Types ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
};

// --- Components ---

const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <NebulaGlow />
          <StarField />
          <FallingStars />
        </Suspense>
      </Canvas>
    </div>
  );
};

const NebulaGlow = () => {
  return (
    <group>
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.05} 
          color="#1a2a4a" 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, -10]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.03} 
          color="#2a1a3a" 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const StarField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
    }
    return pos;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const FallingStars = () => {
  const linesRef = useRef<THREE.LineSegments>(null);
  const count = 400; // Adjusted count for better performance with starfield
  
  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 6);
    const vel = new Float32Array(count);
    const col = new Float32Array(count * 6);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 15;
      
      const speed = 0.008 + Math.random() * 0.02;
      vel[i] = speed;

      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      
      const trailLen = 1.5;
      pos[i * 6 + 3] = x - speed * trailLen * 50;
      pos[i * 6 + 4] = y + speed * trailLen * 50;
      pos[i * 6 + 5] = z;

      // Color variation: mostly white, some blueish, some yellowish
      const colorType = Math.random();
      let r = 1, g = 1, b = 1;
      if (colorType > 0.8) { // Blueish
        r = 0.8; g = 0.9; b = 1;
      } else if (colorType > 0.6) { // Yellowish
        r = 1; g = 1; b = 0.8;
      }

      col[i * 6] = r; col[i * 6 + 1] = g; col[i * 6 + 2] = b;
      col[i * 6 + 3] = r; col[i * 6 + 4] = g; col[i * 6 + 5] = b;
    }
    return [pos, vel, col];
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    const positionsAttr = linesRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const speed = velocities[i];
      const dx = speed;
      const dy = -speed;

      array[i * 6] += dx;
      array[i * 6 + 1] += dy;
      array[i * 6 + 3] += dx;
      array[i * 6 + 4] += dy;
      
      if (array[i * 6 + 1] < -30) {
        array[i * 6 + 1] += 60;
        array[i * 6 + 4] += 60;
      }
      if (array[i * 6] > 30) {
        array[i * 6] -= 60;
        array[i * 6 + 3] -= 60;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count * 2}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count * 2}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

const InteractiveButton = ({ 
  children, 
  onClick, 
  href, 
  className = "",
  isFullWidth = false,
  type = "button",
  disabled = false
}: { 
  children: ReactNode, 
  onClick?: () => void, 
  href?: string,
  className?: string,
  isFullWidth?: boolean,
  type?: "button" | "submit" | "reset",
  disabled?: boolean
}) => {
  const buttonRef = useRef<any>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Magnetic effect
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);

    // Spotlight effect
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => `radial-gradient(80px circle at ${mx}px ${my}px, rgba(255,255,255,0.25), transparent)`
  );

  const baseClasses = `relative overflow-hidden border border-white/20 px-10 py-4 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group cursor-pointer bg-transparent hover:border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] text-white ${isFullWidth ? 'w-full text-center block' : 'inline-block'} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;

  const innerContent = (
    <>
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlightBg }}
      />
      <span className="relative z-10 transition-colors duration-300">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        ref={buttonRef}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
    >
      {innerContent}
    </motion.button>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      
      if (id === 'contact') {
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        const topOffset = absoluteTop - (windowHeight / 2) + (elementHeight / 2);
        
        window.scrollTo({
          top: topOffset,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: absoluteTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-brand-bg/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}
      aria-label="Primary Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl tracking-widest font-normal uppercase text-white">Primus Digital Agency</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 opacity-0 pointer-events-none">
          {['Home', 'About', 'Packages', 'Services', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-[10px] uppercase tracking-[0.2em] font-light text-white relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="md:hidden">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202]">
      <Scene3D />
      {/* Space Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center z-20 px-6 flex flex-col items-center"
      >
        <div className="mb-12">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase text-white leading-none">
            Primus <span className="font-light italic block md:inline text-white">Digital</span>
          </h1>
        </div>
        
        <p className="font-serif italic text-2xl md:text-4xl mb-12 font-light text-white">
          Where Excellence Begins
        </p>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-light mb-10 leading-relaxed text-white">
            Egypt's premier marketing and videography agency — built for brands that refuse to settle.
          </p>
          
          <InteractiveButton href="#packages">
            Begin Your Journey
          </InteractiveButton>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
        <div className="w-[1px] h-12 bg-white" />
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-light mb-10 tracking-tight">The Agency</h2>
          <div className="space-y-6 text-sm font-light leading-relaxed opacity-70 tracking-wide">
            <p>
              Primus Digital stands as Egypt's elite digital powerhouse, a collective of visionaries dedicated to redefining the boundaries of marketing and videography. We merge luxury aesthetics with digital intelligence to create experiences that resonate.
            </p>
            <p>
              Serving high-caliber brands across the region, we believe that true influence is built on the intersection of art and data. Every partnership we undertake is built on a foundation of absolute trust and a relentless pursuit of tangible, high-end results.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "100%", label: "Results-Focused" },
            { num: "Elite", label: "Clientele" },
            { num: "All", label: "Platforms" },
            { num: "Cairo", label: "Egypt" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-brand-card p-8 flex flex-col items-center justify-center text-center border border-white/5"
            >
              <span className="text-3xl font-serif mb-2">{stat.num}</span>
              <span className="text-[8px] uppercase tracking-[0.2em] opacity-50">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Packages = ({ onSelectPackage }: { onSelectPackage: (pkg: any) => void }) => {
  const packages = [
    {
      name: "Signature Starter Pack",
      price: "3,499 EGP/month",
      features: ["2 Reels", "10 Posts", "Facebook Moderation"],
      cta: "Ignite Your Presence",
      collection: "starter_leads"
    },
    {
      name: "Pro Growth Pack",
      price: "4,999 EGP/month",
      features: ["4 Reels", "15 Posts", "FB + IG Moderation", "Monthly Performance Report"],
      cta: "Dominate The Feed",
      popular: true,
      collection: "pro_leads"
    },
    {
      name: "Elite Prestige Pack",
      price: "7,999 EGP/month",
      features: ["6 Reels", "20 Posts", "All Platforms Moderation", "Weekly Performance Reports", "Priority Editing & Shooting"],
      cta: "Establish Your Legacy",
      collection: "prestige_leads"
    },
    {
      name: "Custom Pack",
      price: "Price by Request",
      description: "Every service, tailored entirely to your brand's vision. Fully bespoke — your goals, your platforms, your budget.",
      cta: "Define Your Vision",
      isCustom: true,
      collection: "custom_leads"
    }
  ];

  return (
    <section id="packages" className="py-32 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-light mb-4 tracking-tight">Choose Your Package</h2>
          <div className="w-20 h-[1px] bg-white/20 mx-auto" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative bg-brand-card p-10 flex flex-col h-full border ${
                pkg.popular ? 'border-white/50' : 'border-white/10'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] uppercase tracking-[0.2em] font-bold px-4 py-1">
                  Most Popular
                </div>
              )}

              <h3 className="font-serif text-xl mb-2">{pkg.name}</h3>
              <p className="text-lg font-light mb-8 opacity-80">{pkg.price}</p>
              
              <div className="flex-grow">
                {pkg.isCustom ? (
                  <p className="text-xs font-light leading-relaxed opacity-60 tracking-wide">
                    {pkg.description}
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {pkg.features?.map((feat, j) => (
                      <li key={j} className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <div className="w-1 h-1 bg-white rounded-full" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-10">
                <InteractiveButton onClick={() => onSelectPackage(pkg)} isFullWidth className="py-5 text-[9px]">
                  {pkg.cta}
                </InteractiveButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = ({ onSelectPackage }: { onSelectPackage: (pkg: any) => void }) => {
  const services = [
    {
      id: "01",
      title: "Elite Videography",
      desc: "Cinematic, professional-grade video production crafted to captivate. From concept to final cut, every frame reflects the prestige of your brand.",
      collection: "videography_leads",
      cta: "Capture The Extraordinary"
    },
    {
      id: "02",
      title: "Website Design and Development",
      desc: "Bespoke, luxury-grade websites that don't just look stunning — they convert. Your online presence should be as impressive as your brand.",
      collection: "website_leads",
      cta: "Architect Your Legacy"
    },
    {
      id: "03",
      title: "Mobile App Development",
      desc: "Custom mobile applications engineered for performance, designed for elegance. Put your brand directly in your clients' hands.",
      collection: "mobile_app_leads",
      cta: "Engineer Your Future"
    }
  ];

  return (
    <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-light mb-4 tracking-tight uppercase">Exclusive Services</h2>
        <div className="w-20 h-[1px] bg-white/20 mx-auto" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-brand-card p-12 relative border border-white/5 overflow-hidden group"
          >
            <span className="absolute top-6 right-8 text-7xl font-serif opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
              {service.id}
            </span>
            
            <h3 className="text-2xl font-light mb-6 tracking-tight">{service.title}</h3>
            <p className="text-xs font-light leading-relaxed opacity-60 tracking-widest mb-10">
              {service.desc}
            </p>
            
            <InteractiveButton 
              onClick={() => onSelectPackage({ name: service.title, price: "Price by Request", collection: service.collection })}
              className="px-8 py-3 text-[9px]"
            >
              {service.cta}
            </InteractiveButton>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section id="contact" className="relative py-48 px-6 overflow-hidden bg-[#020202]">
      <Scene3D />
      {/* Space Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-white">Ready to Elevate Your Brand?</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-light opacity-60 mb-12 text-white">Let's build something extraordinary together.</p>
          <InteractiveButton href="https://wa.me/201068072135" className="px-12 py-5 text-[10px]">
            Contact Us
          </InteractiveButton>
        </motion.div>
      </div>
    </section>
  );
};

const PaymentMethods = () => {
  const methods = [
    { name: "InstaPay", icon: "IP" },
    { name: "All E-Wallets", sub: "Vodafone Cash, Orange Cash, Etisalat Cash, WE Pay", icon: "EW" },
    { name: "Bank Transfer", icon: "BT" }
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl font-light mb-4 tracking-tight">How to Pay</h2>
        <div className="w-16 h-[1px] bg-white/20 mx-auto" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {methods.map((method, i) => (
          <div key={i} className="bg-brand-card p-10 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
              <span className="text-xs font-light tracking-widest">{method.icon}</span>
            </div>
            <h3 className="text-sm uppercase tracking-[0.2em] mb-2">{method.name}</h3>
            {method.sub && <p className="text-[8px] uppercase tracking-widest opacity-40">{method.sub}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-brand-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-4">
          <span className="font-serif text-2xl tracking-widest font-bold uppercase">Primus Digital Agency</span>
        </div>
        
        <p className="font-serif italic text-lg mb-10 opacity-60">Where Excellence Begins</p>
        
        <div className="flex gap-8 mb-12">
          <motion.a 
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.facebook.com/profile.php?id=61587403386997" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:opacity-100 opacity-60 transition-colors"
            aria-label="Visit our Facebook page"
          >
            <Facebook size={20} strokeWidth={1.5} aria-hidden="true" />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.instagram.com/primusdigital.global?igsh=MWhxNHp4bmNhdHFlbA==" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:opacity-100 opacity-60 transition-colors"
            aria-label="Visit our Instagram page"
          >
            <Instagram size={20} strokeWidth={1.5} aria-hidden="true" />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href="https://wa.me/201068072135" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:opacity-100 opacity-60 transition-colors"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            href="tel:+201068072135" 
            className="hover:opacity-100 opacity-60 transition-colors"
            aria-label="Call us"
          >
            <Phone size={20} strokeWidth={1.5} aria-hidden="true" />
          </motion.a>
        </div>

        <div className="space-y-4 mb-16">
          <a href="mailto:primusdigitalcorpration@gmail.com" className="block text-[10px] uppercase tracking-[0.2em] font-light opacity-50 hover:opacity-100 transition-opacity">
            primusdigitalcorpration@gmail.com
          </a>
        </div>

        <div className="w-full h-[1px] bg-white/5 mb-8" />
        
        <p className="text-[8px] uppercase tracking-[0.3em] font-light opacity-30">
          © 2025 Primus Digital Agency · Egypt · All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

const OrderModal = ({ pkg, onClose }: { pkg: any, onClose: () => void }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  
  // Custom Pack Counters
  const [reels, setReels] = useState(0);
  const [posts, setPosts] = useState(0);
  const [platforms, setPlatforms] = useState(0);
  const [reports, setReports] = useState(0);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when modal is closed
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!name || !phone || !category) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Save to Firestore (Database)
      const collectionName = pkg.collection || 'leads';
      try {
        const leadData: any = {
          name,
          phone,
          business: category,
          packageName: pkg.name,
          packagePrice: pkg.price,
          createdAt: serverTimestamp()
        };

        if (pkg.isCustom) {
          leadData.customRequirements = {
            reels,
            posts,
            platforms,
            reports
          };
        }

        await addDoc(collection(db, collectionName), leadData);
      } catch (firestoreErr) {
        const info = handleFirestoreError(firestoreErr, OperationType.CREATE, collectionName);
        throw new Error(`Database Error: ${info.error}`);
      }

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setError(err.message || "Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Counter = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/10">
      <span className="text-[8px] uppercase tracking-[0.3em] opacity-40">{label}</span>
      <div className="flex items-center gap-6">
        <motion.button 
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
        >
          <Minus size={12} />
        </motion.button>
        <span className="text-sm font-light w-4 text-center">{value}</span>
        <motion.button 
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
        >
          <Plus size={12} />
        </motion.button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-brand-bg/95 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-brand-card border border-white/20 max-w-md w-full relative max-h-[90vh] flex flex-col"
      >
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-all z-10"
        >
          <X size={20} strokeWidth={1.5} />
        </motion.button>

        <div className="p-10 overflow-y-auto">
          {!isSubmitted ? (
          <>
            <div className="mb-10 text-center">
              <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
              <p className="text-sm font-light opacity-60 tracking-widest">{pkg.price}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[8px] uppercase tracking-[0.3em] opacity-40 mb-3">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setName(val);
                  }}
                  className="w-full bg-transparent border border-white/20 px-4 py-4 text-sm font-light focus:border-white outline-none transition-colors"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-[0.3em] opacity-40 mb-3">Your Mobile Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val);
                  }}
                  className="w-full bg-transparent border border-white/20 px-4 py-4 text-sm font-light focus:border-white outline-none transition-colors"
                  placeholder="+20 ..."
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-[0.3em] opacity-40 mb-3">Business Name</label>
                <input 
                  type="text" 
                  required 
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                    setCategory(val);
                  }}
                  className="w-full bg-transparent border border-white/20 px-4 py-4 text-sm font-light focus:border-white outline-none transition-colors"
                  placeholder="e.g. Primus Agency"
                />
              </div>

              {pkg.isCustom && (
                <div className="pt-4 space-y-2">
                  <Counter label="Reels" value={reels} onChange={setReels} />
                  <Counter label="Posts" value={posts} onChange={setPosts} />
                  <Counter label="Social Platforms" value={platforms} onChange={setPlatforms} />
                  <Counter label="Monthly Reports" value={reports} onChange={setReports} />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-[10px] uppercase tracking-widest">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <InteractiveButton 
                type="submit"
                disabled={isSubmitting}
                isFullWidth
                className="bg-white !text-black hover:bg-opacity-90 font-bold"
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </InteractiveButton>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full animate-pulse" />
                <CheckCircle2 size={64} className="text-white relative z-10" strokeWidth={1} />
              </div>
            </div>
            <h3 className="font-serif text-3xl mb-4">Thank You</h3>
            <p className="text-xs font-light opacity-60 tracking-[0.2em] leading-relaxed uppercase">
              Your request has been received.<br />Our team will contact you shortly.
            </p>
          </motion.div>
        )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();
  }, []);

  const navItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Packages', url: '#packages', icon: Briefcase },
    { name: 'Services', url: '#services', icon: LayoutGrid },
    { name: 'Contact', url: '#contact', icon: Mail }
  ];

  return (
    <div className="relative overflow-x-hidden bg-brand-bg min-h-screen">
      <NavBar items={navItems} />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Packages onSelectPackage={setSelectedPackage} />
          <Services onSelectPackage={setSelectedPackage} />
          <CTASection />
          <PaymentMethods />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {selectedPackage && (
          <OrderModal 
            pkg={selectedPackage} 
            onClose={() => setSelectedPackage(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
