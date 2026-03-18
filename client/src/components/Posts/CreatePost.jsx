import { useState } from 'react';

const CATEGORIES = [
  { value: 'junior_youth',    label: 'Junior Youth Group' },
  { value: 'childrens_class', label: "Children's Class" },
  { value: 'devotional',      label: 'Devotional Gathering' },
  { value: 'event',           label: 'Bahá\'í Event / Party' },
];

const COMMUNITIES = [
  'Southwest Harris County',
  'Fort Bend',
  'Plano',
  'Other',
];

export default function CreatePost({ onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: '',
    community: '',
    event_date: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.title || !form.category || !form.community) {
      alert('Please fill in title, category, and community.');
      return;
    }

    setLoading(true);

    try {
      // TODO: replace with real API call when backend is ready
      // const response = await axios.post('/api/posts', form);
      // onPostCreated(response.data);

      // For now, simulate a new post locally
      const newPost = {
        post_id: Date.now(),
        ...form,
        author_name: 'You',
        created_at: new Date().toISOString(),
      };
      onPostCreated(newPost);

      // Reset form
      setForm({ title: '', body: '', category: '', community: '', event_date: '' });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>

      {/* Toggle button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%', padding: '14px',
            borderRadius: 12, border: '2px dashed #D1D5DB',
            background: 'transparent', cursor: 'pointer',
            fontSize: 14, color: '#6B7280', fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#1A6B5A';
            e.currentTarget.style.color = '#1A6B5A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#D1D5DB';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          + Create a Post
        </button>
      ) : (
        <div style={{
          background: 'white', borderRadius: 12, padding: 28,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>New Post</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}
            >×</button>
          </div>

          {/* Category */}
          <label style={labelStyle}>Category *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                style={{
                  padding: '7px 14px', borderRadius: 100, border: 'none',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: form.category === cat.value ? '#1A6B5A' : '#F3F4F6',
                  color: form.category === cat.value ? 'white' : '#4B5563',
                  transition: 'all 0.15s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <label style={labelStyle}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Junior Youth Group — Saturday Session"
            style={inputStyle}
          />

          {/* Body */}
          <label style={labelStyle}>Description</label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Share details about this gathering, class, or event..."
            style={{ ...inputStyle, height: 90, resize: 'none' }}
          />

          {/* Community */}
          <label style={labelStyle}>Community *</label>
          <select
            name="community"
            value={form.community}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select your community...</option>
            {COMMUNITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Event date */}
          <label style={labelStyle}>Event Date (optional)</label>
          <input
            type="datetime-local"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', marginTop: 8,
              borderRadius: 8, border: 'none',
              background: loading ? '#9CA3AF' : '#1A6B5A',
              color: 'white', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Posting...' : 'Post to Community'}
          </button>
        </div>
      )}
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#6B7280',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  fontSize: 14,
  fontFamily: 'inherit',
  marginBottom: 16,
  outline: 'none',
  color: '#111827',
};