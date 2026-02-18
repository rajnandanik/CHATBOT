import React, { useState } from 'react';
import axios from 'axios';

const AdminDocUploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleUpload = async () => {
    if (!file) return setError('Please select a .txt file');
    const formData = new FormData();
    formData.append('faq', file);

    try {
      await axios.post(`${API}/upload-faq`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('📄 Document uploaded successfully');
      setError('');
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('❌ Upload failed');
      setMessage('');
    }
  };

  return (
    <div style={{display:'grid', placeItems:'center'}}>
      <div className="block" style={{maxWidth:'600px', width:'100%', marginTop:'1.5rem'}}>
        <h2 style={{fontSize:'1.4rem', fontWeight:800, textAlign:'center', marginBottom:'10px'}}>📁 Upload Company Document</h2>

        {message && <p style={{color:'#16a34a', marginBottom:'8px'}}>{message}</p>}
        {error && <p style={{color:'#ef4444', marginBottom:'8px'}}>{error}</p>}

        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="input"
          style={{background:'#fff', marginBottom:'10px'}}
        />

        <button onClick={handleUpload} className="btn">Upload</button>
      </div>
    </div>
  );
};

export default AdminDocUploadPage;
