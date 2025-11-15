'use client';

import { useState } from 'react';
import Image from 'next/image';

// Theme options
const themes = [
  { id: 'character', label: 'Character', prompt: 'character portrait', emoji: '👤' },
  { id: 'animal', label: 'Animal', prompt: 'animal', emoji: '🦁' },
  { id: 'technology', label: 'Technology', prompt: 'futuristic technology', emoji: '🤖' },
  { id: 'landscape', label: 'Landscape', prompt: 'beautiful landscape', emoji: '🏔️' },
  { id: 'architecture', label: 'Architecture', prompt: 'architecture', emoji: '🏛️' },
  { id: 'abstract', label: 'Abstract', prompt: 'abstract art', emoji: '🎨' },
];

// Style options
const styles = [
  { id: 'realistic', label: 'Realistic', prompt: 'photorealistic, highly detailed, 8k' },
  { id: 'natural', label: 'Natural', prompt: 'natural lighting, organic, serene' },
  { id: 'anime', label: 'Anime', prompt: 'anime style, manga, vibrant colors' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk, neon lights, futuristic city' },
  { id: 'fantasy', label: 'Fantasy', prompt: 'fantasy art, magical, ethereal' },
  { id: 'minimalist', label: 'Minimalist', prompt: 'minimalist, clean, simple composition' },
];

// FAQ data
const faqs = [
  {
    question: 'What is an AI Wallpaper Generator?',
    answer: 'An AI Wallpaper Generator uses advanced artificial intelligence to create unique, high-quality wallpapers based on your selected themes and styles. Simply choose your preferences, and our AI will generate a custom wallpaper in seconds.',
  },
  {
    question: 'How long does it take to generate a wallpaper?',
    answer: 'Generation typically takes 10-30 seconds depending on the complexity of your chosen theme and style. Our AI processes your request in real-time to deliver stunning results quickly.',
  },
  {
    question: 'What resolution are the generated wallpapers?',
    answer: 'All wallpapers are generated in high resolution suitable for modern displays, ensuring crisp and clear visuals on any device.',
  },
  {
    question: 'Can I use the generated wallpapers commercially?',
    answer: 'Generated wallpapers are for personal use. For commercial licensing, please contact us at contact@aggiii.com for more information.',
  },
  {
    question: 'Is there a limit to how many wallpapers I can generate?',
    answer: 'You can generate as many wallpapers as you like. We encourage experimentation with different themes and styles to find your perfect wallpaper.',
  },
];

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Generate wallpaper
  const handleGenerate = async () => {
    if (!selectedTheme || !selectedStyle) {
      setError('Please select both theme and style');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await fetch('/api/wallpaper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: selectedTheme,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Download image
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `wallpaper-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Scroll to generator
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/50 backdrop-blur-lg z-50 border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">AI Wallpaper</h2>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-sm text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#how-to-use" className="text-sm text-gray-300 hover:text-white transition-colors">How to Use</a>
            <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</a>
            <button
              onClick={scrollToGenerator}
              className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-all"
            >
              Start for Free
            </button>
          </div>
        </nav>
      </header>
{/* Hero Section with Background Image Effect */}
<section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background with overlay */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
    <div 
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}
    ></div>

    {/* Gradient orbs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
  </div>

  <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
        AI Image Wallpaper Creation Platform
      </span>
    </h1>

    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
      Transform your ideas into stunning wallpapers with the power of artificial intelligence
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={scrollToGenerator}
        className="group px-8 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl hover:shadow-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Create For Free
      </button>
    </div>
  </div>
</section>

{/* Generator Section */}
<section id="generator" className="relative py-24 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-5xl md:text-6xl font-bold mb-6">
        Create Your AI Image Wallpaper
      </h2>
      <p className="text-xl text-gray-400">Choose your theme and style, let AI do the magic</p>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left: Selection Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-white/20 transition-all">
        {/* Theme Selection */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>Select Theme</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group py-5 px-5 rounded-2xl font-medium transition-all ${
                  selectedTheme === theme.id
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{theme.emoji}</span>
                  <span className="text-sm">{theme.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6">
            Select Style
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`py-4 px-5 rounded-2xl font-medium transition-all ${
                  selectedStyle === style.id
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !selectedTheme || !selectedStyle}
          className="w-full py-5 bg-white text-black text-lg font-bold rounded-2xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-white/20 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Wallpaper'
          )}
        </button>
      </div>

      {/* Right: Preview Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-white/20 transition-all">
        <h3 className="text-xl font-semibold mb-6">
          Preview
        </h3>
        <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 relative group">
          {isLoading ? (
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-300 text-lg">Creating your masterpiece...</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full">
              <Image
                src={generatedImage}
                alt="Generated wallpaper"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">Your wallpaper will appear here</p>
              <p className="text-sm text-gray-500">Select theme and style to begin</p>
            </div>
          )}
        </div>

        {/* Download Button */}
        {generatedImage && (
          <button
            onClick={handleDownload}
            className="w-full mt-6 py-5 bg-white text-black text-lg font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 transform hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Wallpaper
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
</section>

      {/* How to Use Section */}
      <section id="how-to-use" className="relative py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">How to Use</h2>
            <p className="text-xl text-gray-400">Three simple steps to amazing wallpapers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all text-center">
              <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Choose Theme</h3>
              <p className="text-gray-400 leading-relaxed">
                Select from character, animal, technology, landscape, architecture, or abstract themes.
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all text-center">
              <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pick Style</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose your preferred style from realistic, natural, anime, cyberpunk, fantasy, or minimalist.
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all text-center">
              <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Generate & Download</h3>
              <p className="text-gray-400 leading-relaxed">
                Click generate and watch AI create your wallpaper, then download instantly in high resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400">Powered by cutting-edge AI technology</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform">
                  AI
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Stable Diffusion 3 Technology</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Our generator uses Stable Diffusion 3, one of the most advanced AI image generation models, 
                    ensuring high-quality, detailed, and creative results.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Lightning-Fast Processing</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Optimized infrastructure delivers your custom wallpaper in seconds. 
                    No waiting, no complexity—just instant results.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 hover:border-white/20 transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Unlimited Creativity</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Every generation is unique. Combine different themes and styles to create wallpapers 
                    that perfectly match your vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">FAQ</h2>
            <p className="text-xl text-gray-400">Everything you need to know</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqIndex === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">AI Wallpaper</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Create stunning, unique wallpapers with the power of artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#how-to-use" className="text-gray-400 hover:text-white transition-colors">How to Use</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                For inquiries and support:
                <br />
                <a href="mailto:contact@aggiii.com" className="text-white hover:underline">
                  contact@aggiii.com
                </a>
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} aggiii.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}