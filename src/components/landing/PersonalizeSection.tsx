import React from "react";
import { UserCheck, Sparkles, ArrowRight } from "lucide-react";

const PersonalizationSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="floating-shape absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="floating-shape absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-lg blur-xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Content */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                Personalized Experience
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Tailored Just for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Your Success
              </span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Take our comprehensive onboarding survey to unlock a completely
              personalized productivity experience. Our AI learns your
              preferences, work style, and goals to create the perfect workflow.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-300 mr-4" />
                <span className="text-white/90">
                  Personalized task prioritization
                </span>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-300 mr-4" />
                <span className="text-white/90">
                  Custom productivity insights
                </span>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-300 mr-4" />
                <span className="text-white/90">
                  Adaptive scheduling recommendations
                </span>
              </div>
            </div>

            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center group">
              Start Personalization
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right column - Survey Preview */}
          <div className="relative">
            <div className=" p-8 rounded-3xl border border-white/20">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Onboarding Survey
                </h3>
                <p className="text-white/70 text-sm">
                  Help us understand your productivity style
                </p>
              </div>

              <div className="space-y-6">
                {/* Question 1 */}
                <div>
                  <p className="text-white mb-3 font-medium">
                    What's your biggest productivity challenge?
                  </p>
                  <div className="space-y-2">
                    {[
                      "Staying focused",
                      "Managing priorities",
                      "Time estimation",
                      "Procrastination",
                    ].map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="challenge"
                          className="mr-3 accent-purple-500"
                        />
                        <span className="text-white/80 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div>
                  <p className="text-white mb-3 font-medium">
                    When are you most productive?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Early morning",
                      "Late morning",
                      "Afternoon",
                      "Evening",
                    ].map((time, index) => (
                      <button
                        key={index}
                        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white text-sm"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-8">
                  <div className="flex justify-between text-white/60 text-sm mb-2">
                    <span>Progress</span>
                    <span>2 of 8</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-pink-400 h-2 rounded-full w-1/4 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizationSection;
