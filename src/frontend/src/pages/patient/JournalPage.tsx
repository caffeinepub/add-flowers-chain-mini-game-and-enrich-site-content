import { useState, useEffect, useRef } from 'react';
import { useSearch } from '@tanstack/react-router';
import { BookOpen, Trash2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import SectionHeader from '../../components/patterns/SectionHeader';
import BreezeCard from '../../components/patterns/BreezeCard';
import BreezePrimaryButton from '../../components/patterns/BreezePrimaryButton';
import EmptyState from '../../components/patterns/EmptyState';
import LoadingState from '../../components/patterns/LoadingState';
import LoginButton from '../../components/auth/LoginButton';
import {
  useGetAllJournalEntries,
  useCreateJournalEntry,
  useDeleteJournalEntry,
} from '../../hooks/useQueries';
import { useToast } from '../../components/patterns/ToastProvider';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

export default function JournalPage() {
  const { identity } = useInternetIdentity();
  const { showToast } = useToast();
  const search = useSearch({ strict: false }) as { prompt?: string };
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data: entries = [], isLoading } = useGetAllJournalEntries();
  const createMutation = useCreateJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  // Auto-focus when coming from Today panel
  useEffect(() => {
    if (search?.prompt === 'true' && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Please write something in your journal', 'error');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim() || null,
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      showToast('Journal entry added!');
    } catch (error) {
      showToast('Failed to add journal entry', 'error');
    }
  };

  const handleDelete = async (entryId: bigint) => {
    try {
      await deleteMutation.mutateAsync(entryId);
      showToast('Journal entry deleted');
    } catch (error) {
      showToast('Failed to delete entry', 'error');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <SectionHeader icon={BookOpen} title="Journal" subtitle="Your personal space for reflection" />
        <EmptyState
          title="Login to Start Journaling"
          description="Create an account to keep track of your thoughts and reflections."
          illustration="/assets/generated/breeze-illustration-journal.dim_512x512.png"
          gradient="linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)"
        >
          <LoginButton />
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <SectionHeader icon={BookOpen} title="Journal" subtitle="Your personal space for reflection" />

      {/* Add Entry Form */}
      <BreezeCard
        className="mb-8"
        gradient="linear-gradient(135deg, oklch(0.95 0.03 280) 0%, oklch(0.92 0.04 260) 100%)"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-foreground">
              Title (optional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-foreground">
              What's on your mind?
            </Label>
            <Textarea
              ref={contentRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={6}
              className="mt-1"
              required
            />
          </div>
          <BreezePrimaryButton
            type="submit"
            disabled={createMutation.isPending}
            className="hover:scale-105 active:scale-95"
          >
            {createMutation.isPending ? 'Adding...' : 'Add Entry'}
          </BreezePrimaryButton>
        </form>
      </BreezeCard>

      {/* Entries List */}
      <SectionHeader
        title="Your Entries"
        subtitle={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
      />

      {isLoading ? (
        <LoadingState message="Loading your journal..." />
      ) : entries.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Start writing to capture your thoughts and track your wellness journey!"
          icon={BookOpen}
        />
      ) : (
        <div className="space-y-4">
          {entries
            .sort((a, b) => Number(b.createdAt - a.createdAt))
            .map((entry) => (
              <BreezeCard key={entry.id.toString()} className="relative hover:shadow-soft-lg transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {entry.title && (
                      <h3 className="text-xl font-bold text-foreground mb-2">{entry.title}</h3>
                    )}
                    <p className="text-muted-foreground whitespace-pre-wrap mb-3">{entry.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(entry.createdAt) / 1000000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 active:scale-90"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </BreezeCard>
            ))}
        </div>
      )}
    </div>
  );
}
