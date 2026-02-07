import { useState } from 'react';
import { useAddNoticeboardPost } from '../../hooks/useQueries';
import type { NoticeboardPost } from '../../backend';
import { MessageSquare, Send } from 'lucide-react';

interface NoticeboardProps {
  posts: NoticeboardPost[];
  isLoading: boolean;
}

export default function Noticeboard({ posts, isLoading }: NoticeboardProps) {
  const [message, setMessage] = useState('');
  const addPost = useAddNoticeboardPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addPost.mutateAsync(message);
      setMessage('');
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-soft">
        <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-3">
          Share a message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={addPost.isPending || !message.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addPost.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Post Message</span>
            </>
          )}
        </button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center shadow-soft">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts
            .slice()
            .reverse()
            .map((post, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200">
                <p className="text-foreground mb-3 leading-relaxed">{post.message}</p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

