'use client';
import { useQuery } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setcopy] = useState(false);

  const fech_email = async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`/api/emails?maxResults=50&q=after:${today}`);
    console.log(response)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication error: Please sign out and sign in again to refresh your Gmail access.');
      }
      throw new Error('Error: Failed to fetch emails from Gmail. Please try again.');
    }

    return await response.json();
  }

  const { data: emails, isloading: email_loading, error: email_error } = useQuery({
    queryKey: ['emails'],
    queryFn: fech_email,
    refetchInterval: 50000
  })

  // Combined function that fetches emails and gets AI summary
  const fetchAndSummarizeEmails = async () => {
    const today = new Date().toISOString().split('T')[0];
    const emailsData = emails.messages || [];

    if (emailsData.length === 0) {
      throw new Error(`No emails found for today (${today}). Your inbox might be empty or all emails are from previous days.`);
    }

    // Format emails for AI analysis
    const emailsForAnalysis = emailsData.map(email => ({
      subject: email.subject,
      from: email.from,
      content: email.snippet || email.content || 'No content available',
      date: email.date
    }));

    // Call Gemini API directly here
    const prompt = `Please provide a concise summary of today's emails (${today}). Focus on important information, action items, and key points. Group similar topics together and highlight any urgent matters:\n\n${JSON.stringify(emailsForAnalysis, null, 2)}`;

    const geminiResponse = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!geminiResponse.ok) {
      throw new Error('Failed to get AI summary');
    }

    const aiResult = await geminiResponse.json();

    return {
      summary: aiResult.result,
      emails: emailsData
    };
  };

  // New useQuery for the complete flow
  const { data: emailSummary, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['email-summary'], // No dependency since we're using manual trigger
    queryFn: fetchAndSummarizeEmails,
    enabled: false // Manual trigger
  });

  // Simple function to trigger the email summary
  const summarizeTodaysEmails = () => {
    refetch();
  };

  function copy() {
    navigator.clipboard.writeText(emailSummary?.summary || '');
    setcopy(true);
    setTimeout(() => setcopy(false), 1800);
  }

  function downloadPdf() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margins = { top: 20, left: 20, right: 20, bottom: 20 };

    // Centered title
    doc.setFontSize(16);
    doc.text('Email Summary', pageWidth / 2, margins.top, { align: 'center' });

    // Content with proper wrapping and page breaks
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(emailSummary?.summary || '', pageWidth - margins.left - margins.right);

    let currentY = margins.top + 20;
    const lineHeight = 7;

    splitText.forEach(line => {
      if (currentY + lineHeight > pageHeight - margins.bottom) {
        doc.addPage();
        currentY = margins.top;
      }
      doc.text(line, margins.left, currentY);
      currentY += lineHeight;
    });

    doc.save('summary.pdf');
  }



  // Authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  return (
    <div className={`w-screen flex flex-col justify-center items-center px-5 py-10 bg-gradient-to-br from-indigo-500 to-purple-600 ${emailSummary?.summary || error ? 'h-full' : 'h-screen'}`}>
      <div className=" max-w-4xl mx-auto my-0">
        {/* Header */}
        <div className="sm:w-230 mb-10 text-center bg-white p-7 rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="max-sm:text-3xl text-5xl mb-4">
            📧
          </div>
          <h1 className="max-sm:text-xl mb-2.5 text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            DigiMail Dashboard
          </h1>
          <div className="flex items-center justify-center my-4">
            <Avatar className='scale-150'>
              <AvatarImage src = {session?.user?.image} />
              <AvatarFallback>N.A</AvatarFallback>
            </Avatar>
          </div>
          <p className="mb-5 text-gray-600 text-xl">
            Welcome back, {session.user.name}! 👋
          </p>
          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="px-5 py-2.5 bg-red-400 text-white border-none rounded-lg cursor-pointer hover:bg-red-500 text-md font-medium transition-all duration-300 ease-in shadow-md shadow-red-400/30"
          >
            Sign Out
          </button>
        </div>

        {/* Main Action Card */}
        <div className="sm:w-230 max-sm:text-xl text-center  bg-white rounded-3xl px-10 py-12.5 shadow-2xl animate-fade-in-up-delay-200">
          <div className="mb-7.5">
            <h2 className="max-sm:text-xl text-3xl font-bold text-gray-800 mb-2.5">
              Daily Email Intelligence
            </h2>
            <p className="max-sm:text-md text-gray-500 m-0 text-l">
              Get instant insights from today's emails powered by advanced AI
            </p>
          </div>

          <button
            onClick={summarizeTodaysEmails}
            disabled={isFetching}
            className={`${isFetching ? 'hidden' : null} max-sm:text-md px-10 py-5 font-bold text-lg text-white border-none rounded-lg min-w-[280px] transition-transform duration-300 ease-in ${isFetching
              ? 'cursor-not-allowed'
              : 'bg-gradient-to-br from-green-400 to-green-500 cursor-pointer shadow-lg shadow-green-400/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-400/50'
              }`}
          >
            Analyze Today's Emails
          </button>
          <div className={`${isFetching ? null : 'hidden'} flex justify-center items-center h-[68px]`}><DotLottieReact src="/0dqQkJGtm9.json" className="scale-50" loop autoplay />
          </div>
        </div>

        {/* AI Summary Results */}
        {emailSummary?.summary && (
          <div className="mt-7.5 bg-white rounded-2xl p-7.5 shadow-2xl animate-fade-in-up-delay-400">
            <div className="flex items-center mb-5">
              <span className="text-2xl mr-3">🤖</span>
              <h3 className="m-0 text-gray-800 text-xl font-semibold">
                Today's Email Summary
              </h3>
            </div>
            <div className="whitespace-pre-wrap leading-7 text-gray-600 text-base bg-gray-50 p-6 rounded-xl border border-gray-200">
              {emailSummary.summary}
            </div>
            <div className="flex gap-3">
              <button className="max-sm:text-sm bg-[#F40F02] text-white rounded-md mt-3 px-3 h-[40px] cursor-pointer hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2" onClick={downloadPdf}>
                Download as PDF
                <FontAwesomeIcon className="text-xl" icon={faFilePdf} />
              </button>
              <button className={`${copied ? 'bg-white text-black' : 'bg-black text-white'} rounded-md px-6 mt-3 h-[40px] cursor-pointer hover:-translate-y-0.5 transition-transform duration-200`} onClick={copy}>{copied ? <DotLottieReact src="/Success Check.json" autoplay /> : 'Copy Text'}</button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-7.5 bg-red-50 border border-red-200 rounded-2xl p-7.5 shadow-2xl">
            <div className="flex items-center mb-5">
              <span className="text-2xl mr-3">❌</span>
              <h3 className="m-0 text-red-800 text-xl font-semibold">
                Error
              </h3>
            </div>
            <div className="text-red-600 text-base">
              {error.message}
            </div>
          </div>
        )}

        {/* Email List */}
        {emailSummary?.emails && emailSummary.emails.length > 0 && emailSummary.summary && (
          <div className="mt-7.5 bg-white rounded-2xl p-7.5 shadow-2xl animate-fade-in-up-delay-600">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📨</span>
              <h3 className="m-0 text-gray-800 text-xl font-semibold">
                Today's Emails ({emailSummary.emails.length})
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto pr-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {emailSummary.emails.map((email, index) => (
                <div
                  key={email.id}
                  className="p-5 m-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:bg-white animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="font-semibold mb-2.5 text-gray-800 text-base">
                    {email.subject}
                  </div>
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <span className="mr-2">👤</span>
                    <strong>From:</strong>&nbsp;{email.from}
                  </div>
                  <div className="text-xs text-gray-400 mb-3 flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(email.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  {email.snippet && (
                    <div className="text-sm text-gray-600 italic bg-white p-3 rounded-lg border border-gray-200">
                      {email.snippet.substring(0, 150)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
