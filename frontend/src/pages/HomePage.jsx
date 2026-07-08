import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilePlus, FiSearch, FiShield, FiClock } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FiShield size={30} />, title: 'امنیت بلاک‌چین', desc: 'غیرقابل تغییر و جعل' },
    { icon: <FiClock size={30} />, title: 'تایم‌استمپ', desc: 'ثبت زمان دقیق' },
    { icon: <FiFilePlus size={30} />, title: 'هش یکتا', desc: 'الگوریتم SHA256' },
    { icon: <FiSearch size={30} />, title: 'استعلام سریع', desc: 'بررسی در ثانیه' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: '5rem', marginBottom: '1rem' }}
          >
            ⛓️
          </motion.div>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 900,
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            سیستم ثبت اختراع بلاک‌چین
          </h1>
          
          <p style={{ 
            color: '#a0a0cc', 
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            ثبت امن و تغییرناپذیر اسناد اختراع با استفاده از فناوری بلاک‌چین اتریوم
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            width: '100%',
            maxWidth: '900px',
            marginBottom: '3rem'
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass-card"
              style={{ textAlign: 'center', padding: '1.5rem' }}
            >
              <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
                {feature.icon}
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{feature.title}</h3>
              <p style={{ color: '#a0a0cc', fontSize: '0.9rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glow btn-purple"
            onClick={() => navigate('/register')}
            style={{ fontSize: '1.1rem', padding: '16px 40px' }}
          >
            📝 ثبت سند جدید
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glow btn-cyan"
            onClick={() => navigate('/verify')}
            style={{ fontSize: '1.1rem', padding: '16px 40px' }}
          >
            🔍 استعلام سند
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default HomePage;