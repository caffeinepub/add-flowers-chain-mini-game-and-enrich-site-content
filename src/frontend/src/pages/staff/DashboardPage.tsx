import { useGetAllUsers, useGetAllCommunityActivities, useAddCommunityActivity, useAddNoticeboardPost } from '../../hooks/useQueries';
import { Users, Activity, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../../backend';

export default function DashboardPage() {
  const { data: users = [] } = useGetAllUsers();
  const { data: activities = [] } = useGetAllCommunityActivities();
  const addActivity = useAddCommunityActivity();
  const addPost = useAddNoticeboardPost();

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [postMessage, setPostMessage] = useState('');

  const patients = users.filter(u => u.role === UserRole.user);
  const staff = users.filter(u => u.role === UserRole.admin);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addActivity.mutateAsync({
        name: activityName,
        location: activityLocation,
        description: activityDescription,
      });
      setActivityName('');
      setActivityLocation('');
      setActivityDescription('');
      setShowActivityForm(false);
    } catch (err) {
      console.error('Failed to add activity:', err);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPost.mutateAsync(postMessage);
      setPostMessage('');
      setShowPostForm(false);
    } catch (err) {
      console.error('Failed to add post:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Staff Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-foreground">{patients.length}</h2>
            </div>
            <p className="text-muted-foreground">Total Patients</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-foreground">{staff.length}</h2>
            </div>
            <p className="text-muted-foreground">Staff Members</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-8 w-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-foreground">{activities.length}</h2>
            </div>
            <p className="text-muted-foreground">Community Activities</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Community Activities</h2>
              <button
                onClick={() => setShowActivityForm(!showActivityForm)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Activity
              </button>
            </div>

            {showActivityForm && (
              <form onSubmit={handleAddActivity} className="mb-6 p-4 bg-muted/30 rounded-lg space-y-3">
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Activity name"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  required
                />
                <input
                  type="text"
                  value={activityLocation}
                  onChange={(e) => setActivityLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  required
                />
                <textarea
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm resize-none"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addActivity.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                  >
                    {addActivity.isPending ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowActivityForm(false)}
                    className="px-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map((activity, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                  <h3 className="font-medium text-foreground text-sm">{activity.name}</h3>
                  <p className="text-xs text-muted-foreground">{activity.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Noticeboard</h2>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Post Update
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handleAddPost} className="mb-6 p-4 bg-muted/30 rounded-lg space-y-3">
                <textarea
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                  placeholder="Write a message for the community..."
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm resize-none"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addPost.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                  >
                    {addPost.isPending ? 'Posting...' : 'Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
