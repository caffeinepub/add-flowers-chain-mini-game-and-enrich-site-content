import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetAllCommunityActivities, useGetAllNoticeboardPosts } from '../../hooks/useQueries';
import Noticeboard from '../../components/community/Noticeboard';
import SectionHeader from '../../components/patterns/SectionHeader';
import { Users, MapPin } from 'lucide-react';

export default function CommunityPage() {
  const { isAuthenticated } = useCurrentUser();
  const { data: activities = [], isLoading: activitiesLoading } = useGetAllCommunityActivities();
  const { data: posts = [], isLoading: postsLoading } = useGetAllNoticeboardPosts();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Community</h1>
          <p className="text-muted-foreground">Please log in to access the community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={Users}
          title="Community"
          subtitle="Connect with others and explore activities"
          className="mb-8"
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Community Activities</h2>
            {activitiesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="bg-card rounded-3xl p-8 text-center shadow-soft">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No activities available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200"
                  >
                    <h3 className="font-semibold text-foreground mb-2 text-lg">{activity.name}</h3>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{activity.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Noticeboard</h2>
            <Noticeboard posts={posts} isLoading={postsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

