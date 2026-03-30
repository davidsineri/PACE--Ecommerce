import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        const postsWithLikes = data.map((post: any) => ({
          ...post,
          likesCount: Math.floor(Math.random() * 50) + 1 
        }));
        setPosts(postsWithLikes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Setup Realtime subscription
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!user) {
      alert('Silakan login untuk memposting.');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newPost, 
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User' 
        })
      });
      if (res.ok) {
        setNewPost('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = (postId: string) => {
    if (!user) {
      alert('Silakan login untuk menyukai postingan.');
      return;
    }
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#/community?post=${postId}`);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black text-black dark:text-white italic mb-4">KOMUNITAS PACE</h1>
      <p className="text-xl text-stone-500 dark:text-stone-400 font-medium mb-12">Bagikan cerita, inspirasi, dan dukungan Anda untuk UMKM Papua.</p>

      <form onSubmit={handlePost} className="bg-white dark:bg-stone-900 p-6 rounded-[32px] border border-stone-200 dark:border-stone-800 shadow-sm mb-12">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Apa yang ingin Anda bagikan hari ini?"
          className="w-full bg-stone-50 dark:bg-stone-950 p-6 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-32 mb-4 text-black dark:text-white"
        ></textarea>
        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors">
            Kirim Postingan
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-stone-500">Memuat postingan...</div>
        ) : (
          posts.map((post, index) => {
            const isLiked = likedPosts.has(post.id);
            const displayLikes = post.likesCount + (isLiked ? 1 : 0);
            
            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-[32px] border border-stone-100 dark:border-stone-800 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center font-bold text-emerald-600">
                    {post.user_name?.charAt(0) || post.userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg dark:text-white">{post.user_name || post.userName}</h4>
                    <p className="text-sm text-stone-400">{new Date(post.created_at || post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed mb-6">{post.content}</p>
                <div className="flex gap-6 border-t border-stone-100 dark:border-stone-800 pt-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors font-medium ${isLiked ? 'text-red-500' : 'text-stone-500 hover:text-red-500'}`}
                  >
                    <Heart size={20} className={isLiked ? 'fill-current' : ''} /> 
                    {displayLikes} Suka
                  </button>
                  <button className="flex items-center gap-2 text-stone-500 hover:text-blue-500 transition-colors font-medium">
                    <MessageSquare size={20} /> Komentar
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-2 text-stone-500 hover:text-emerald-500 transition-colors font-medium"
                  >
                    {copiedPostId === post.id ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                    {copiedPostId === post.id ? 'Tersalin!' : 'Bagikan'}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
