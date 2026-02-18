import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminFaqDashboard = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [docMessage, setDocMessage] = useState('');

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API}/faq`);
      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch FAQs');
      setFaqs([]);
    }
  };

  const handleAddFaq = async () => {
    if (!question.trim() || !answer.trim()) return;
    try {
      setLoading(true);
      await axios.post(`${API}/faq`, { question, answer });
      setQuestion('');
      setAnswer('');
      fetchFaqs();
    } catch {
      setError('Failed to add FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/faq/${id}`);
      fetchFaqs();
    } catch {
      setError('Failed to delete FAQ');
    }
  };

  const handleDocUpload = async () => {
    if (!docFile) return;
    try {
      const formData = new FormData();
      formData.append('faq', docFile);
      await axios.post(`${API}/upload-faq`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocMessage('📄 Document uploaded successfully');
      setDocFile(null);
    } catch {
      setDocMessage('❌ Upload failed');
    }
  };

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4 text-center">🛠️ Admin FAQ Portal</h1>

      {error && (
        <div className="block" style={{borderColor:'#fecaca', background:'#fff1f2'}}>
          {error}
        </div>
      )}

      <div className="block" style={{marginBottom:'1rem'}}>
        <h3>Add FAQ</h3>
        <input
          placeholder="Enter question..."
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{marginBottom: '8px'}}
        />
        <input
          placeholder="Enter answer..."
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{marginBottom: '10px'}}
        />
        <button
          className="btn"
          onClick={handleAddFaq}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add FAQ'}
        </button>

        <div style={{marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e5e7eb'}}>
          <label className="text-sm" style={{display:'block', marginBottom: '6px'}}>Upload Document (.txt)</label>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setDocFile(e.target.files[0])}
            className="input"
            style={{marginBottom: '8px', background:'#fff'}}
          />
          <button
            onClick={handleDocUpload}
            className="btn"
            disabled={!docFile}
          >
            Upload Document
          </button>
          {docMessage && <p className="auth-help" style={{marginTop: '8px'}}>{docMessage}</p>}
        </div>
      </div>

      <div className="space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="faq-card" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <p style={{fontWeight:700, color:'#1d4ed8'}}>Q: {faq.question}</p>
                  <p style={{opacity:.9, marginTop:'.35rem'}}>A: {faq.answer}</p>
                </div>
                <button
                  className="nav-item logout-btn"
                  onClick={() => handleDelete(faq._id)}
                  title="Delete"
                  style={{background:'#ef4444'}}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p style={{opacity:.8, textAlign:'center', fontStyle:'italic'}}>No FAQs yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminFaqDashboard;
