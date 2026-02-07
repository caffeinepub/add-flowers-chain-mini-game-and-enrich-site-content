import { Link } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Heart, Users, Calendar, Dumbbell, ArrowRight, Lightbulb } from 'lucide-react';
import SectionHeader from '../../components/patterns/SectionHeader';
import FeatureCard from '../../components/patterns/FeatureCard';

export default function OverviewPage() {
  const { isAuthenticated } = useCurrentUser();

  return (
    <div className="bg-background">
      {/* Hero Section with decorative gradient */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/assets/generated/pt-gradient-ribbon.dim_1400x240.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-peach-50/60 to-mint-50/80 dark:from-pink-950/20 dark:via-peach-950/10 dark:to-mint-950/20" />

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/platonic-logo.dim_512x512.png"
                  alt="Platonic Therapy"
                  className="h-14 w-14 md:h-16 md:w-16"
                />
                <h1 className="text-3xl md:text-5xl font-bold text-foreground">Platonic Therapy</h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground italic font-light leading-relaxed">
                "Reality is created by the mind, we change our reality by changing our mind."
              </p>
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Community-based, multidisciplinary support focused on mental wellbeing, independence, and reducing
                isolation for adults with long-term conditions, anxiety, and low mood.
              </p>
              {isAuthenticated ? (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 px-7 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <p className="text-muted-foreground">Please log in to get started with your wellness journey.</p>
              )}
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-wellbeing.dim_1600x900.png"
                alt="Community wellbeing"
                className="rounded-3xl shadow-soft-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <SectionHeader icon={Lightbulb} title="What We Offer" subtitle="Comprehensive support for your wellbeing journey" className="text-center justify-center mb-10" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Heart}
            title="Initial Consultation"
            description="Free consultation to understand your needs and create a personalized plan."
            className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"
          />
          <FeatureCard
            icon={Dumbbell}
            title="Gym Support"
            description="Guided gym and leisure centre attendance to build confidence and strength."
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
          />
          <FeatureCard
            icon={Users}
            title="Group Sessions"
            description="Home and group therapy sessions to reduce isolation and build community."
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
          />
          <FeatureCard
            icon={Calendar}
            title="Follow-up Care"
            description="Post-therapy follow-up and chair-based exercises for continued progress."
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
          />
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="relative py-12 md:py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/pt-blob-soft.dim_1200x1200.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title="Our Approach" subtitle="Evidence-based, holistic rehabilitation" className="mb-8" />

            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-soft-lg">
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                Platonic Therapy uses the <strong>biopsychosocial model</strong> to provide holistic, evidence-based
                rehabilitation across Greater Manchester.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We support adults with long-term conditions, anxiety, and low mood through a comprehensive journey that
                includes:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                    1
                  </span>
                  <span>Initial consultation and baseline assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                    2
                  </span>
                  <span>Personalized therapy programmes with gym, home, and group sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                    3
                  </span>
                  <span>Chair-based exercises for accessibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                    4
                  </span>
                  <span>Post-therapy follow-up to maintain progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5">
                    5
                  </span>
                  <span>Community activities to reduce isolation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isAuthenticated && (
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-pink-400 to-rose-400 rounded-3xl p-8 md:p-12 text-center text-white shadow-soft-lg">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url(/assets/generated/pt-card-gradient-bg.dim_1200x600.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
                Join our supportive community and take the first step towards improved wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-50 font-semibold py-3.5 px-7 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-200 border-2 border-white/30"
                >
                  Explore More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
