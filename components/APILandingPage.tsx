'use client'

import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingDown, Bell, Zap, Shield, BarChart3, ArrowRight, Check, AlertTriangle } from 'lucide-react';

// Type definitions
interface PricingModel {
  input: number;
  output: number;
  color: string;
}

interface ApiPricing {
  [provider: string]: {
    [model: string]: PricingModel;
  };
}

interface UseCase {
  name: string;
  inputRatio: number;
  outputRatio: number;
  volume: number;
}

interface UseCases {
  [key: string]: UseCase;
}

interface CalculationResult {
  provider: string;
  model: string;
  cost: number;
  inputCost: number;
  outputCost: number;
  color: string;
}

// Pricing data (per million tokens) - Updated for 2025
const API_PRICING: ApiPricing = {
  openai: {
    'GPT-4o': { input: 2.50, output: 10.00, color: 'bg-green-500' },
    'GPT-4o-mini': { input: 0.15, output: 0.60, color: 'bg-green-400' },
    'GPT-4-turbo': { input: 0.25, output: 1.25, color: 'bg-green-600' },
    'o1': { input: 15.00, output: 60.00, color: 'bg-green-700' }
  },
  anthropic: {
    'Claude 4 Sonnet': { input: 3.00, output: 15.00, color: 'bg-purple-500' },
    'Claude 4 Opus': { input: 15.00, output: 75.00, color: 'bg-purple-700' },
    'Claude 3.5 Haiku': { input: 0.25, output: 1.25, color: 'bg-purple-400' }
  },
  google: {
    'Gemini 2.5 Pro': { input: 2.50, output: 15.00, color: 'bg-blue-500' },
    'Gemini 2.0 Flash': { input: 0.075, output: 0.30, color: 'bg-blue-400' }
  },
  mistral: {
    'Mistral Large': { input: 2.00, output: 6.00, color: 'bg-orange-500' },
    'Mistral Small': { input: 0.20, output: 0.60, color: 'bg-orange-400' }
  }
};

const USE_CASES: UseCases = {
  'customer-support': { name: 'Customer Support Bot', inputRatio: 1, outputRatio: 2, volume: 50000 },
  'content-generation': { name: 'Content Generation', inputRatio: 1, outputRatio: 10, volume: 10000 },
  'code-assistant': { name: 'Code Assistant', inputRatio: 2, outputRatio: 3, volume: 30000 },
  'data-analysis': { name: 'Data Analysis', inputRatio: 5, outputRatio: 1, volume: 20000 },
  'chatbot': { name: 'General Chatbot', inputRatio: 1, outputRatio: 1.5, volume: 100000 }
};

export default function APILandingPage() {
  const [useCase, setUseCase] = useState<string>('customer-support');
  const [monthlyVolume, setMonthlyVolume] = useState<number>(50000);
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const useCaseData: UseCase = USE_CASES[useCase];
  const inputTokens: number = monthlyVolume * useCaseData.inputRatio;
  const outputTokens: number = monthlyVolume * useCaseData.outputRatio;

  const calculations = useMemo(() => {
    const results: CalculationResult[] = [];
    
    Object.entries(API_PRICING).forEach(([provider, models]) => {
      Object.entries(models).forEach(([modelName, pricing]) => {
        const inputCost = (inputTokens / 1000000) * pricing.input;
        const outputCost = (outputTokens / 1000000) * pricing.output;
        const totalCost = inputCost + outputCost;
        
        results.push({
          provider: provider.charAt(0).toUpperCase() + provider.slice(1),
          model: modelName,
          cost: totalCost,
          inputCost,
          outputCost,
          color: pricing.color
        });
      });
    });
    
    return results.sort((a, b) => a.cost - b.cost);
  }, [inputTokens, outputTokens]);

  const cheapest = calculations[0];
  const mostExpensive = calculations[calculations.length - 1];
  const savings = mostExpensive.cost - cheapest.cost;
  const savingsPercent = ((savings / mostExpensive.cost) * 100).toFixed(0);

  // ConvertKit Integration - Using server-side API route
  const handleSubmit = async () => {
    console.log('Starting email submission...');
    console.log('Email:', email);

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log('Calling API route: /api/subscribe');

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        console.log('SUCCESS! Email sent to ConvertKit!');
        setSubmitted(true);
      } else {
        const errorMsg = `Subscription failed (${response.status}): ${data.error || 'Unknown error'}`;
        console.error(errorMsg);
        setErrorMessage(errorMsg);
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Fetch error:', error);
      setErrorMessage(errorMsg);
      alert(`Network error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold">API Cost Guard</span>
          </div>
          <a href="#waitlist" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors">
            Join Waitlist
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">Save 40-70% on AI API costs</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 pb-2 bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
          Stop Overpaying for AI APIs
        </h1>
        
        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Track costs across OpenAI, Anthropic, Google & more. Get instant savings recommendations. Never blow your budget again.
        </p>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <a href="#calculator" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2">
            Try Free Calculator
            <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#waitlist" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold text-lg transition-colors border border-slate-700">
            Join Waitlist
          </a>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h2 className="text-3xl font-bold">You&apos;re probably overpaying for AI APIs</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Using GPT-4 for everything (even simple tasks)',
              'No idea which provider is cheapest for your use case',
              'Getting surprise $10K+ bills',
              'Can\'t track costs across multiple providers',
              'No way to set budgets or alerts',
              'Manually comparing pricing tables'
            ].map((problem, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <span className="text-slate-300">{problem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Free API Cost Calculator</h2>
          <p className="text-xl text-slate-400">Compare costs across all major providers instantly</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Use Case</label>
              <select 
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              >
                {Object.entries(USE_CASES).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly API Calls: {monthlyVolume.toLocaleString()}
              </label>
              <input 
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1K</span>
                <span>500K</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <TrendingDown className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Potential Savings: ${savings.toFixed(2)}/month ({savingsPercent}%)</h3>
                <p className="text-slate-300">
                  By switching from <span className="font-semibold">{mostExpensive.provider} {mostExpensive.model}</span> to{' '}
                  <span className="font-semibold text-emerald-400">{cheapest.provider} {cheapest.model}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 px-4 text-sm font-medium text-slate-400">
              <span>Provider & Model</span>
              <span>Input Cost</span>
              <span>Output Cost</span>
              <span>Total/Month</span>
            </div>
            
            {calculations.map((result, i) => (
              <div 
                key={i}
                className={`grid grid-cols-4 gap-4 p-4 rounded-lg transition-all ${
                  i === 0 
                    ? 'bg-emerald-500/20 border border-emerald-500/30 scale-[1.02]' 
                    : 'bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${result.color}`}></div>
                  <div>
                    <div className="font-medium">{result.provider}</div>
                    <div className="text-sm text-slate-400">{result.model}</div>
                  </div>
                  {i === 0 && (
                    <span className="ml-auto px-2 py-1 bg-emerald-500 text-xs rounded-full font-semibold">
                      BEST
                    </span>
                  )}
                </div>
                <div className="text-slate-300">${result.inputCost.toFixed(2)}</div>
                <div className="text-slate-300">${result.outputCost.toFixed(2)}</div>
                <div className="font-bold">${result.cost.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            <p>Based on {inputTokens.toLocaleString()} input tokens and {outputTokens.toLocaleString()} output tokens</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">One dashboard for all your AI costs</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BarChart3,
              title: 'Real-Time Tracking',
              description: 'Monitor costs across all providers in one dashboard. See exactly where your money goes.'
            },
            {
              icon: TrendingDown,
              title: 'Smart Recommendations',
              description: 'Get AI-powered suggestions to reduce costs. "Use Haiku for this task → Save 60%"'
            },
            {
              icon: Bell,
              title: 'Budget Alerts',
              description: 'Set monthly budgets and get alerts at 50%, 75%, 90%. Never get surprised again.'
            },
            {
              icon: Zap,
              title: '5-Minute Setup',
              description: 'One line of code. Works with OpenAI, Anthropic, Google, Cohere, Mistral, and more.'
            },
            {
              icon: Shield,
              title: 'Private & Secure',
              description: 'We only see metadata (tokens, costs). Your prompts and data stay 100% private.'
            },
            {
              icon: DollarSign,
              title: 'Cost Allocation',
              description: 'Track spending by team, project, or API key. Perfect for agencies and enterprises.'
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-emerald-500/50 transition-all">
              <feature.icon className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-slate-400 text-center mb-16">Start free. Scale as you grow.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Free',
              price: '$0',
              description: 'Perfect for testing',
              features: [
                'Cost calculator',
                '1 API key',
                '100 tracked calls/month',
                'Basic dashboard',
                'Community support'
              ],
              cta: 'Start Free',
              highlight: false
            },
            {
              name: 'Pro',
              price: '$29',
              description: 'For individuals & small teams',
              features: [
                'Everything in Free',
                'Unlimited API keys',
                '10K tracked calls/month',
                'Smart recommendations',
                'Budget alerts',
                'Email support'
              ],
              cta: 'Start Free Trial',
              highlight: true
            },
            {
              name: 'Team',
              price: '$99',
              description: 'For growing companies',
              features: [
                'Everything in Pro',
                '100K tracked calls/month',
                'Multi-user access',
                'Cost allocation',
                'API integration',
                'Priority support'
              ],
              cta: 'Join Waitlist',
              highlight: false
            }
          ].map((plan, i) => (
            <div 
              key={i}
              className={`rounded-2xl p-8 ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500 scale-105' 
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              {plan.highlight && (
                <div className="inline-block px-3 py-1 bg-emerald-500 text-sm font-semibold rounded-full mb-4">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-8">{plan.description}</p>
              
              <a 
                href="#waitlist"
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors block text-center ${
                  plan.highlight
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {plan.cta}
              </a>

              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 mt-8">
          All plans include 14-day free trial. No credit card required.
        </p>
      </section>

      {/* Email Capture CTA */}
      <section id="waitlist" className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            🔥 First 10 Only!
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
          <p className="text-xl text-slate-300 mb-2">
            Be the first to know when monitoring launches.
          </p>
          <p className="text-2xl font-bold text-emerald-400 mb-8">
            First 10 signups get 50% off for life! 🎉
          </p>

          {!submitted ? (
            <div className="flex gap-4 max-w-md mx-auto flex-wrap justify-center">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="flex-1 min-w-[250px] px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white disabled:opacity-50"
              />
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          ) : (
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-6 max-w-md mx-auto">
              <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold">You&apos;re on the list!</p>
              <p className="text-sm text-slate-400 mt-2">Check your email for confirmation.</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-left">
              <p className="text-red-400 font-semibold mb-1">Error Details:</p>
              <p className="text-sm text-slate-300">{errorMessage}</p>
            </div>
          )}

          <p className="text-sm text-slate-400 mt-4">
            Only 10 lifetime discount spots available • Join 500+ developers already saving on AI costs
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {[
            {
              q: 'Do you see our API calls or data?',
              a: 'No. We only log metadata (model, tokens, cost). Your prompts and responses stay with the provider. We never see or store your actual data.'
            },
            {
              q: 'How is this different from Langfuse/Helicone?',
              a: 'They\'re full observability platforms ($99+/mo) with tracing, debugging, and evaluation. We focus only on cost optimization at 1/3 the price.'
            },
            {
              q: 'What providers do you support?',
              a: 'OpenAI, Anthropic (Claude), Google (Gemini), Cohere, Mistral, Azure OpenAI, AWS Bedrock, and more. Request support for any provider.'
            },
            {
              q: 'How do the recommendations work?',
              a: 'We analyze your usage patterns and suggest cheaper models for specific tasks. For example, using Claude Haiku instead of GPT-4 for simple tasks can reduce costs by 90%+.'
            },
            {
              q: 'Can I self-host?',
              a: 'Enterprise plan includes self-hosting option. You get the full source code and can run it on your own infrastructure.'
            },
            {
              q: 'What if I go over my plan limit?',
              a: 'You\'ll get a notification and can upgrade anytime. We never cut off access - you just pay $0.50 per 1,000 extra calls.'
            }
          ].map((faq, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
              <p className="text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <span className="font-bold">API Cost Guard</span>
              </div>
              <p className="text-slate-400 text-sm">
                Stop overpaying for AI APIs. Track, optimize, and save.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white">Features</a>
                <a href="#" className="block hover:text-white">Pricing</a>
                <a href="#calculator" className="block hover:text-white">Calculator</a>
                <a href="#" className="block hover:text-white">Docs</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white">About</a>
                <a href="#" className="block hover:text-white">Blog</a>
                <a href="#" className="block hover:text-white">Careers</a>
                <a href="#" className="block hover:text-white">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="#" className="block hover:text-white">Privacy</a>
                <a href="#" className="block hover:text-white">Terms</a>
                <a href="#" className="block hover:text-white">Security</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 API Cost Guard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}