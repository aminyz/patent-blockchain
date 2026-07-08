import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData);
      setResult(response.data);
    } catch (error) {
      setResult({
        status: 'error',
        message: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="container-custom" style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ثبت سند جدید
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card"
        >
          {/* File Upload Area */}
          <div
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <FiUpload size={50} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {file ? file.name : 'فایل خود را اینجا رها کنید یا کلیک کنید'}
            </p>
            <p style={{ color: '#a0a0cc', fontSize: '0.9rem' }}>
              تمامی فرمت‌ها پشتیبانی می‌شود
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: file ? 1.02 : 1 }}
            whileTap={{ scale: file ? 0.98 : 1 }}
            className="btn-glow btn-purple"
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{ width: '100%', opacity: !file ? 0.5 : 1 }}
          >
            {loading ? '⏳ در حال ثبت...' : '🔗 ثبت در بلاک‌چین'}
          </motion.button>

          {/* Loading */}
          {loading && <LoadingSpinner text="در حال ثبت در بلاک‌چین..." />}

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                marginTop: '1.5rem',
                padding: '1.5rem',
                borderRadius: '16px',
                background: result.status === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                           result.status === 'duplicate' ? 'rgba(245, 158, 11, 0.1)' :
                           'rgba(239, 68, 68, 0.1)',
                border: `2px solid ${
                  result.status === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                  result.status === 'duplicate' ? 'rgba(245, 158, 11, 0.3)' :
                  'rgba(239, 68, 68, 0.3)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {result.status === 'success' && <FiCheck size={24} color="#10b981" />}
                {result.status === 'duplicate' && <FiAlertCircle size={24} color="#f59e0b" />}
                <strong style={{ 
                  color: result.status === 'success' ? '#10b981' :
                         result.status === 'duplicate' ? '#f59e0b' : '#ef4444'
                }}>
                  {result.message}
                </strong>
              </div>

              {result.file_hash && (
                <div style={{ marginBottom: '0.8rem' }}>
                  <span style={{ color: '#a0a0cc', fontSize: '0.9rem' }}>هش فایل:</span>
                  <div className="hash-display" style={{ marginTop: '0.3rem' }}>
                    {result.file_hash}
                  </div>
                </div>
              )}

              {result.file_name && (
                <div style={{ marginBottom: '0.8rem', color: '#e0e0ff' }}>
                  <span style={{ color: '#a0a0cc' }}>📄 نام فایل: </span>
                  {result.file_name}
                </div>
              )}

              {result.transaction_hash && (
                <div style={{ marginBottom: '0.8rem' }}>
                  <span style={{ color: '#a0a0cc', fontSize: '0.9rem' }}>🔗 تراکنش:</span>
                  <div className="hash-display" style={{ marginTop: '0.3rem' }}>
                    {result.transaction_hash}
                  </div>
                </div>
              )}

              {result.timestamp && (
                <div style={{ color: '#e0e0ff' }}>
                  <span style={{ color: '#a0a0cc' }}>📅 زمان ثبت: </span>
                  {result.timestamp}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '2rem' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#a0a0cc',
              padding: '10px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Vazirmatn',
              fontSize: '0.95rem'
            }}
          >
            ← بازگشت به صفحه اصلی
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default RegisterPage;