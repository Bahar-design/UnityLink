import { useState } from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

// Sample posts — will be replaced by API call later
const SAMPLE_POSTS = [
  {
    post_id: 1,
    category: 'junior_youth',
    title: 'Junior Youth Group — Saturday Session',
    body: 'We will be studying Breezes of Confirmation this Saturday. All youth aged 12-15 welcome. Snacks provided!',
    community: 'Southwest Harris County',
    author_name: 'Layla Hassan',
    event_date: '2026-03-22T10:00:00',
    created_at: '2026-03-18T09:00:00',
  },
  {
    post_id: 2,
    category: 'devotional',
    title: 'Devotional Gathering at the Johnson Home',
    body: 'A warm, informal devotional open to all. We will share prayers and music followed by light refreshments.',
    community: 'Fort Bend',
    author_name: 'Marcus Williams',
    event_date: '2026-03-20T19:00:00',
    created_at: '2026-03-17T14:00:00',
  },
  {
    post_id: 3,
    category: 'childrens_class',
    title: "Children's Class — New Cycle Starting",
    body: "A new 12-week cycle of children's classes is beginning. Ages 5-11. Please register your child by Friday.",
    community: 'Southwest Harris County',
    author_name: 'Priya Sharma',
    event_date: null,
    created_at: '2026-03-16T11:00:00',
  },
  {
    post_id: 4,
    category: 'event',
    title: "Naw-Rúz Celebration 🌸",
    body: 'Join us for our community Naw-Rúz party! Food, music, activities for children. Everyone is welcome.',
    community: 'Fort Bend',
    author_name: 'Ali Tehrani',
    event_date: '2026-03-20T17:00:00',
    created_at: '2026-03-15T08:00:00',
  },
];

const FILTER_OPTIONS = [
  { value: 'all',             label: 'All Posts' },
  { value: 'junior_youth',    label: 'Junior Youth' },
  { value: 'childrens_class', label: "Children's Class" },
  { value: 'devotional',      label: 'Devotional' },
  { value: 'event',           label: 'Events' },
];

export default function PostFeed() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [filter, setFilter] = useState('all');

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.category === filter);

  return (
    <div style={{
      maxWidth: 680,
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
          Community Posts
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>
          Share and discover gatherings, classes, and events in your area.
        </p>
      </div>

      {/* Create post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '7px 16px', borderRadius: 100,
              border: 'none', fontSize: 13, cursor: 'pointer',
              fontWeight: 500,
              background: filter === opt.value ? '#1A6B5A' : '#F3F4F6',
              color: filter === opt.value ? 'white' : '#4B5563',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Post count */}
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
      </p>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: '#9CA3AF', fontSize: 15,
        }}>
          No posts in this category yet. Be the first to share!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPosts.map(post => (
            <PostCard key={post.post_id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}