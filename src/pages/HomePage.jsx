import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL;
    axios.get(`${API}/faq`).then((res) => {
      if (Array.isArray(res.data)) setFaqs(res.data);
    }).catch(() => setFaqs([]));
  }, []);

  return (
    <div>
      <section style={{maxWidth: '900px', margin: '1.25rem auto 2rem', textAlign: 'center'}}>
        <h2 className="auth-title" style={{marginBottom: '.5rem'}}>🤖 AI Customer Support Portal</h2>
        <p style={{opacity: .9}}>Find instant answers or chat with the assistant.</p>
      </section>

      <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 1rem'}}>
        <h3 style={{fontWeight: 700, marginBottom: '.75rem'}}>📚 Frequently Asked Questions</h3>

        {faqs.length > 0 ? (
          <div style={{display: 'grid', gap: '12px'}}>
            {faqs.map((faq) => (
              <div key={faq._id} className="faq-card">
                <p style={{fontWeight: 700, color: '#93c5fd'}}>Q: {faq.question}</p>
                <p style={{opacity: .9, marginTop: '.35rem'}}>A: {faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{opacity: .8}}>No FAQs available yet.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
