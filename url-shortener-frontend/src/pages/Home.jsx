import React, { useState, useEffect } from "react";
import URLForm from "../components/URLForm";
import URLList from "../components/URLList";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("create");

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll position
      const formSection = document.getElementById("create-section");
      const listSection = document.getElementById("manage-section");

      if (formSection && listSection) {
        const formTop = formSection.offsetTop - 200;
        const listTop = listSection.offsetTop - 200;

        if (window.scrollY >= listTop) {
          setActiveSection("manage");
        } else if (window.scrollY >= formTop) {
          setActiveSection("create");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const FloatingParticle = ({
    delay,
    size = "w-2 h-2",
    position,
    duration = "20s",
  }) => (
    <div
      className={`absolute ${size} bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-float`}
      style={{
        ...position,
        animationDelay: delay,
        animationDuration: duration,
      }}
    ></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-shift"></div>

        <FloatingParticle delay="0s" position={{ top: "10%", left: "10%" }} />
        <FloatingParticle
          delay="2s"
          position={{ top: "20%", right: "15%" }}
          size="w-3 h-3"
        />
        <FloatingParticle
          delay="4s"
          position={{ top: "60%", left: "5%" }}
          size="w-1 h-1"
        />
        <FloatingParticle
          delay="6s"
          position={{ bottom: "30%", right: "10%" }}
        />
        <FloatingParticle
          delay="8s"
          position={{ bottom: "10%", left: "20%" }}
          size="w-4 h-4"
          duration="25s"
        />
        <FloatingParticle
          delay="1s"
          position={{ top: "40%", left: "80%" }}
          size="w-2 h-2"
        />
        <FloatingParticle
          delay="3s"
          position={{ top: "70%", right: "25%" }}
          size="w-1 h-1"
        />
        <FloatingParticle
          delay="5s"
          position={{ bottom: "50%", left: "15%" }}
          size="w-3 h-3"
        />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LinkForge
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("create-section")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === "create"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Create Link
              </button>
              <button
                onClick={() => scrollToSection("manage-section")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === "manage"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Manage Links
              </button>
            </div>

            <button className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main
        className={`relative z-10 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-300 font-medium">
                  Professional URL Management
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Shorten URLs
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Track Performance
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform your long URLs into powerful, trackable short links
                with advanced analytics and professional management tools.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                {[
                  { number: "10K+", label: "Links Created" },
                  { number: "99.9%", label: "Uptime" },
                  { number: "1B+", label: "Clicks Tracked" },
                  { number: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollToSection("create-section")}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
              >
                <span>Get Started Now</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </button>
            </div>
          </div>
        </section>

        <section id="create-section" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create Your Short Link
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Transform any URL into a powerful short link with custom
                branding, expiration dates, and detailed tracking.
              </p>
            </div>
            <URLForm />
          </div>
        </section>

        <div className="relative py-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <section id="manage-section" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Manage & Analyze
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Monitor your links performance with detailed analytics, manage
                expiration dates, and organize with custom tags.
              </p>
            </div>
            <URLList />
          </div>
        </section>

        <footer className="relative mt-32 py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LinkForge
                </h3>
              </div>
              <p className="text-white/60 max-w-2xl mx-auto mb-8">
                Professional URL shortening and analytics platform designed for
                modern businesses and individuals who value performance and
                insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-blue-500/30">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Secure & Reliable
                </h4>
                <p className="text-white/60">
                  Enterprise-grade security with 99.9% uptime guarantee
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center border border-purple-500/30">
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Advanced Analytics
                </h4>
                <p className="text-white/60">
                  Detailed insights and real-time tracking for all your links
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-blue-600/20 flex items-center justify-center border border-emerald-500/30">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Lightning Fast
                </h4>
                <p className="text-white/60">
                  Optimized for speed with global CDN distribution
                </p>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/40">
                © 2024 LinkForge. Built with ❤️ for the modern web.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease-in-out infinite;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
