'use client';
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-white">
              DigiMail
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-200">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="hidden md:block bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center bg-white min-h-screen">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Intelligent Email Analysis,
                <br />
                <span className="text-purple-600">
                  Simplified.
                </span>
              </h1>
              <p className="text-gray-500 mb-8 text-lg">
                Harness the power of AI to summarize, categorize, and generate smart replies for your emails, giving you back time and focus.
              </p>
              <button 
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="bg-gradient-to-br from-green-400 to-green-500 hover:shadow-xl text-white font-bold py-3 px-8 rounded-lg transition-all text-lg shadow-lg shadow-green-400/40"
              >
                Sign In & Get Started
              </button>
            </div>
            <div className="flex justify-center">
              <svg className="w-80 h-80 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H21" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      <section id="about" className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About DigiMail</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            DigiMail is a powerful tool that leverages artificial intelligence to help you manage your inbox more effectively. From summarizing long email threads to generating context-aware smart replies, our goal is to save you time and keep you focused on what matters most.
          </p>
        </div>
      </section>

      <section id="faq" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use Google's secure authentication and APIs to access your emails. Your data is encrypted in transit and at rest, and we never store your email content on our servers.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">How does the AI work?</h3>
              <p className="text-gray-600">
                We use Google's powerful Gemini model to analyze your emails. This allows us to provide high-quality summaries and relevant smart replies tailored to the content of each message.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Can I use this with other email providers?</h3>
              <p className="text-gray-600">
                Currently, DigiMail only supports Gmail accounts. We are working on expanding to other providers in the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-6">
          {/* Footer content can be added here later */}
        </div>
      </footer>

      {/* Sign-in button for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-gradient-to-br from-green-400 to-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
