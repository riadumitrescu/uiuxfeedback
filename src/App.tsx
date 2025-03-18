import React, { useState, useEffect } from 'react';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [uploadHover, setUploadHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Dynamic theme styles
  const themeStyles = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    secondaryBg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    headerBg: isDarkMode 
      ? (isScrolled ? 'bg-black' : 'bg-transparent') 
      : (isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'),
    navText: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    navHover: 'hover:text-[#00D1D1]',
    cardBg: isDarkMode ? 'bg-black' : 'bg-white',
    cardBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    tertiaryText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    footerBorder: isDarkMode ? 'border-gray-800' : 'border-gray-200',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeStyles.bg} ${themeStyles.text}`}>
      {/* Header */}
      <header className={`fixed w-full transition-all duration-300 z-50 ${themeStyles.headerBg}`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">AI UX<span className="text-[#00D1D1]">.</span></span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className={`${themeStyles.navText} ${themeStyles.navHover} transition-colors`}>Home</a>
            <a href="#how-it-works" className={`${themeStyles.navText} ${themeStyles.navHover} transition-colors`}>How It Works</a>
            <a href="#pricing" className={`${themeStyles.navText} ${themeStyles.navHover} transition-colors`}>Pricing</a>
            <a href="#faq" className={`${themeStyles.navText} ${themeStyles.navHover} transition-colors`}>FAQ</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D1D1] transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button className={`px-4 py-2 text-sm ${themeStyles.navHover} transition-colors`}>Log In</button>
            <button className="px-4 py-2 text-sm bg-[#00D1D1] text-white rounded-lg hover:bg-[#00D1D1]/80 transition-colors">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 stagger-children">
              <h1 className="text-4xl md:text-5xl font-bold fadeIn opacity-0">
                Instant AI-Powered UX Feedback on Your Designs.
              </h1>
              <p className={`text-lg ${themeStyles.secondaryText} fadeIn opacity-0`}>
                Upload your UI, and our AI will analyze usability, accessibility, and design flaws – all in seconds.
              </p>
              <div className="pt-4 fadeIn opacity-0">
                <button 
                  className={`px-8 py-4 bg-[#00D1D1] text-white font-medium rounded-lg flex items-center space-x-2 transition-all ${
                    uploadHover ? 'shadow-[0_0_15px_rgba(0,209,209,0.5)]' : ''
                  }`}
                  onMouseEnter={() => setUploadHover(true)}
                  onMouseLeave={() => setUploadHover(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${uploadHover ? 'translate-y-[-2px]' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Upload Your Design</span>
                </button>
                <div className={`mt-4 text-sm ${themeStyles.tertiaryText} text-center`}>
                  or drag and drop your file here
                </div>
              </div>
            </div>
            <div className="relative hidden md:block fadeIn opacity-0">
              <div className="relative z-10">
                <img 
                  src={isDarkMode ? "https://placehold.co/600x400/111111/CCCCCC" : "https://placehold.co/600x400/EEEEEE/333333"} 
                  alt="UI Analysis" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute top-4 left-4 bg-[#00D1D1]/20 p-4 rounded-lg backdrop-blur-sm border border-[#00D1D1]/30">
                <div className="text-sm font-medium text-[#00D1D1]">AI Feedback</div>
                <div className="text-xs text-white/80">Low contrast text detected</div>
              </div>
              <div className="absolute bottom-8 right-8 bg-[#00D1D1]/20 p-4 rounded-lg backdrop-blur-sm border border-[#00D1D1]/30">
                <div className="text-sm font-medium text-[#00D1D1]">UI Issue</div>
                <div className="text-xs text-white/80">Button size too small for mobile</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-20 ${themeStyles.secondaryBg} px-6 transition-colors duration-300`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 fadeIn opacity-0">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                step: 1,
                title: "Upload a Screenshot",
                description: "Drag & drop, auto-scans UI."
              },
              {
                step: 2,
                title: "AI Analyzes Design",
                description: "Checks UX & accessibility issues."
              },
              {
                step: 3,
                title: "Get Actionable Insights",
                description: "See clear, ranked recommendations."
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center fadeIn opacity-0 hover-lift">
                <div className="h-12 w-12 rounded-full bg-[#00D1D1]/20 flex items-center justify-center border border-[#00D1D1] mb-6">
                  <span className="text-[#00D1D1] font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className={`${themeStyles.tertiaryText} text-center`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feedback Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 fadeIn opacity-0">AI Feedback Preview</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-children">
            <div className="relative fadeIn opacity-0 hover-lift">
              <div className="relative">
                <img 
                  src={isDarkMode ? "https://placehold.co/500x300/222222/444444" : "https://placehold.co/500x300/EEEEEE/555555"} 
                  alt="Bad UX Example" 
                  className="w-full rounded-lg border border-red-500/30" 
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 font-medium px-3 py-1 rounded-full border border-red-400/50 text-sm">Bad UX</span>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <span className="text-red-400">✕</span>
              </div>
            </div>
            <div className="relative fadeIn opacity-0 hover-lift">
              <img 
                src={isDarkMode ? "https://placehold.co/500x300/222222/CCCCCC" : "https://placehold.co/500x300/EEEEEE/333333"} 
                alt="Good UX Example" 
                className="w-full rounded-lg border border-[#00D1D1]/30" 
              />
              <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[#00D1D1]/20 border border-[#00D1D1]/30 flex items-center justify-center">
                <span className="text-[#00D1D1]">✓</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-[#00D1D1]/10 backdrop-blur-sm p-3 rounded-lg border border-[#00D1D1]/20">
                <div className="text-sm font-medium text-[#00D1D1]">Improved UX</div>
                <div className="text-xs text-white/80">Contrast fixed, proper spacing applied</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 ${themeStyles.secondaryBg} px-6 transition-colors duration-300`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 fadeIn opacity-0">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-children">
            {[
              {
                title: "Free",
                price: "$0",
                description: "Perfect for trying out the service",
                features: ["3 UX reviews/month", "Basic feedback", "Standard response time"],
                buttonText: "Get Started Free"
              },
              {
                title: "Premium",
                price: "$10",
                period: "/month",
                description: "For regular UX testing needs",
                features: ["Unlimited reviews", "Detailed reports", "Priority support", "PDF export"],
                buttonText: "Upgrade to Premium",
                highlighted: true
              },
              {
                title: "One-Time",
                price: "$5",
                description: "Just need a quick review?",
                features: ["Single AI audit", "Detailed report", "24-hour support"],
                buttonText: "Buy Single Review"
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`${themeStyles.cardBg} rounded-lg p-6 border ${
                  plan.highlighted ? 'border-[#00D1D1]' : themeStyles.cardBorder
                } transition-colors duration-300 fadeIn opacity-0 hover-lift`}
              >
                <div className="text-xl font-semibold mb-2">{plan.title}</div>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className={`${themeStyles.tertiaryText} ml-1`}>{plan.period}</span>}
                </div>
                <p className={`text-sm ${themeStyles.tertiaryText} mb-6`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <svg className="h-5 w-5 text-[#00D1D1] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg transition-all ${plan.highlighted 
                  ? 'bg-[#00D1D1] text-white hover:shadow-[0_0_15px_rgba(0,209,209,0.3)]' 
                  : `${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${themeStyles.text}`}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${themeStyles.bg} border-t ${themeStyles.footerBorder} py-12 px-6 transition-colors duration-300`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold tracking-tight">AI UX<span className="text-[#00D1D1]">.</span></span>
            </div>
            <div className="flex space-x-8 mb-6 md:mb-0">
              <a href="#" className={`text-sm ${themeStyles.tertiaryText} hover:text-[#00D1D1]`}>FAQ</a>
              <a href="#" className={`text-sm ${themeStyles.tertiaryText} hover:text-[#00D1D1]`}>Privacy Policy</a>
              <a href="#" className={`text-sm ${themeStyles.tertiaryText} hover:text-[#00D1D1]`}>Contact</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className={`${themeStyles.tertiaryText} hover:text-[#00D1D1]`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className={`${themeStyles.tertiaryText} hover:text-[#00D1D1]`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div className={`text-center ${themeStyles.tertiaryText} text-sm mt-12`}>
            © {new Date().getFullYear()} AI UX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
