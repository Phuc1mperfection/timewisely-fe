import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Sparkles, Target, Users, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar",
      description:
        "Intuitive calendar interface with drag & drop functionality",
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description:
        "Get personalized activity recommendations based on your interests",
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description:
        "Maximize your productivity with intelligent time slot analysis",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and achieve your personal and professional objectives",
    },
    {
      icon: Users,
      title: "Social Integration",
      description: "Coordinate with friends and colleagues seamlessly",
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Create events and tasks with lightning-fast shortcuts",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-white to-emerald-500">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--wisely-white)] mb-6">
            Make Every
            <span className="bg-gradient-to-r from-[var(--wisely-purple)] via-[var(--wisely-mint)] to-[var(--wisely-pink)] bg-clip-text text-transparent">
              {" "}
              Moment{" "}
            </span>
            Count
          </h1>
          <p className="text-xl text-[var(--wisely-gray)] mb-8 max-w-2xl mx-auto">
            Use your time wisely with personalized suggestions powered by AI.
            Discover activities that match your goals and make the most of your
            free time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-[var(--wisely-purple)] hover:bg-purple-600 text-white px-8 py-3 text-lg"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[var(--wisely-mint)] text-[var(--wisely-purple)] hover:bg-[var(--wisely-mint)] hover:text-[var(--wisely-dark)] px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--wisely-dark)] mb-4">
            Everything you need to manage time wisely
          </h2>
          <p className="text-[var(--wisely-gray)] max-w-2xl mx-auto">
            From smart scheduling to AI-powered suggestions, TimeWisely has all
            the tools you need to optimize your daily routine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in border-0 bg-white/80 backdrop-blur-sm hover:bg-wisely-white"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-[var(--wisely-purple)] to-[var(--wisely-mint)] rounded-lg mr-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--wisely-dark)]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-[var(--wisely-gray)]">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-[var(--wisely-purple)] via-purple-600 to-[var(--wisely-mint)] text-white text-center p-12 border-0">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your time management?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who have already optimized their schedules
            with TimeWisely.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="bg-white text-[var(--wisely-purple)] hover:bg-[var(--wisely-lightGray)] px-8 py-3 text-lg font-semibold"
          >
            Start Your Free Trial
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
        <div className="text-center text-[var(--wisely-gray)]">
          <p>&copy; 2024 TimeWisely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
