const CATEGORY_STYLES = {
  junior_youth: {
    label: 'Junior Youth',
    background: '#EDE9FE',
    color: '#6D28D9',
  },
  childrens_class: {
    label: "Children's Class",
    background: '#DBEAFE',
    color: '#1D4ED8',
  },
  devotional: {
    label: 'Devotional',
    background: '#D1FAE5',
    color: '#065F46',
  },
  event: {
    label: 'Event',
    background: '#FEF3C7',
    color: '#B45309',
  },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function PostCard({ post }) {
  const category = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.event;

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: '24px 28px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      border: '1px solid #F3F4F6',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
    >
      {/* Top row — category badge + community tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>

        {/* Category badge */}
        <span style={{
          background: category.background,
          color: category.color,
          fontSize: 11,
          fontWeight: 600,
          padding: '4px 12px',
          borderRadius: 100,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {category.label}
        </span>

        {/* Community tag */}
        <span style={{
          fontSize: 12,
          color: '#6B7280',
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          padding: '3px 10px',
          borderRadius: 100,
        }}>
          📍 {post.community}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 17,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 10,
        lineHeight: 1.4,
      }}>
        {post.title}
      </h3>

      {/* Body */}
      {post.body && (
        <p style={{
          fontSize: 14,
          color: '#4B5563',
          lineHeight: 1.65,
          marginBottom: 16,
        }}>
          {post.body}
        </p>
      )}

      {/* Bottom row — author + date */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 14,
        borderTop: '1px solid #F3F4F6',
        fontSize: 13,
        color: '#9CA3AF',
      }}>
        {/* Author avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28,
            borderRadius: '50%',
            background: '#1A6B5A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 600,
          }}>
            {post.author_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ color: '#4B5563', fontWeight: 500 }}>
            {post.author_name || 'Unknown'}
          </span>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {post.event_date && (
            <span style={{
              background: '#F0FDF4',
              color: '#15803D',
              padding: '2px 8px',
              borderRadius: 100,
              fontSize: 12,
              marginRight: 8,
            }}>
              📅 {formatDate(post.event_date)}
            </span>
          )}
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
}