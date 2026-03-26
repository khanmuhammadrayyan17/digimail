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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Menu, Copy, Download, Send, Bot, User, LogOut, Inbox, AlertCircle, Mail } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setcopy] = useState(false);
  const [smartReplies, setSmartReplies] = useState({});
  const [isReplying, setIsReplying] = useState(null);
  const [replyStatus, setReplyStatus] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);

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

  
  const fetchAndSummarizeEmails = async () => {
    const today = new Date().toISOString().split('T')[0];
    const emailsData = emails.messages || [];

    if (emailsData.length === 0) {
      throw new Error(`No emails found for today (${today}). Your inbox might be empty or all emails are from previous days.`);
    }

    
    const emailsForAnalysis = emailsData.map(email => ({
      subject: email.subject,
      from: email.from,
      content: email.snippet || email.content || 'No content available',
      date: email.date
    }));

    
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

  
  const fetchSmartReplies = async (email) => {
    setIsReplying(email.id);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `From: ${email.from}\nSubject: ${email.subject}\n\n${email.snippet}`,
          requestType: 'smart-reply'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get smart replies.');
      }

      const data = await response.json();
      setSmartReplies(prev => ({ ...prev, [email.id]: data.replies }));
    } catch (error) {
      console.error("Smart Reply Error:", error);
      // Optionally, set an error state to show in the UI
    } finally {
      setIsReplying(null);
    }
  };

  const handleSendReply = async (email, replyBody) => {
    setReplyStatus({ ...replyStatus, [email.id]: 'sending' });
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.from,
          subject: `Re: ${email.subject}`,
          body: replyBody,
          threadId: email.threadId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send reply.');
      }

      setReplyStatus({ ...replyStatus, [email.id]: 'sent' });
      setTimeout(() => {
        // Hide the smart replies for this email after sending
        setSmartReplies(prev => {
          const newReplies = { ...prev };
          delete newReplies[email.id];
          return newReplies;
        });
        setReplyStatus({ ...replyStatus, [email.id]: null });
      }, 2000);

    } catch (error) {
      console.error("Send Reply Error:", error);
      setReplyStatus({ ...replyStatus, [email.id]: 'error' });
    }
  };

  
  const { data: emailSummary, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['email-summary'], 
    queryFn: fetchAndSummarizeEmails,
    enabled: false 
  });

  
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

    
    doc.setFontSize(16);
    doc.text('Email Summary', pageWidth / 2, margins.top, { align: 'center' });

    
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



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen w-screen flex justify-center items-center bg-gray-50">
        <DotLottieReact src="/Loading Dots Blue.json" loop autoplay />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Brand and Nav */}
            <div className="flex items-center space-x-4">
              <span className="font-bold text-2xl text-indigo-600">
                DigiMail
              </span>
            </div>

            {/* Right side: User menu */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">Welcome, {session.user.name}</span>
              <Avatar>
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: '/signin' })}>
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Email List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Inbox className="mr-2 h-5 w-5" />
                  Today's Inbox
                </CardTitle>
                <CardDescription>
                  {emails?.messages?.length || 0} new messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[45vh] lg:h-[60vh] pr-4">
                  {email_loading && <p>Loading emails...</p>}
                  {email_error && <p className="text-red-500">{email_error.message}</p>}
                  {emails?.messages && emails.messages.map((email) => (
                    <Sheet key={email.id} onOpenChange={(isOpen) => !isOpen && setSelectedEmail(null)}>
                      <SheetTrigger asChild>
                        <div
                          className="mb-2"
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <p className="font-semibold text-sm truncate">{email.from}</p>
                            <p className="text-xs text-gray-600 truncate">{email.subject}</p>
                          </div>
                          <Separator />
                        </div>
                      </SheetTrigger>
                    </Sheet>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary and Actions */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Daily Email Intelligence</CardTitle>
                <CardDescription>Get instant insights from today's emails powered by advanced AI.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={summarizeTodaysEmails} disabled={isFetching || !emails?.messages?.length}>
                  {isFetching ? (
                    <>
                      <DotLottieReact src="/Loading Dots Blue.json" className="w-12 h-12" loop autoplay />
                      Analyzing...
                    </>
                  ) : "Analyze Today's Emails"}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Card className="mb-8 bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-red-700">
                  {error.message}
                </CardContent>
              </Card>
            )}

            {emailSummary?.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    Today's Summary
                  </CardTitle>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={copy}>
                      <Copy className="mr-2 h-4 w-4" /> {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadPdf}>
                      <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {emailSummary.summary}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {selectedEmail && (
        <Sheet open={!!selectedEmail} onOpenChange={(isOpen) => !isOpen && setSelectedEmail(null)}>
          <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 h-[100dvh] sm:h-full z-50">
            <SheetHeader className="p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
              <SheetTitle className="truncate text-base sm:text-lg pr-8">{selectedEmail.subject}</SheetTitle>
              <SheetDescription className="text-xs sm:text-sm truncate">
                From: {selectedEmail.from}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 pb-24 sm:pb-8">
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-8 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                {selectedEmail.snippet}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm sm:text-md">Actions</h4>
                <Button
                  onClick={() => fetchSmartReplies(selectedEmail)}
                  disabled={isReplying === selectedEmail.id}
                  className="w-full h-12"
                >
                  {isReplying === selectedEmail.id ? (
                    <>
                      <DotLottieReact src="/Loading Dots Blue.json" className="w-12 h-12" loop autoplay />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-5 w-5" /> Generate Smart Replies
                    </>
                  )}
                </Button>

                {smartReplies[selectedEmail.id] && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h5 className="font-semibold text-sm text-gray-800">Suggestions:</h5>
                    {smartReplies[selectedEmail.id].map((reply, index) => (
                      <Card key={index} className="bg-white border-blue-100 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-700 mb-3">{reply}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                            onClick={() => handleSendReply(selectedEmail, reply)}
                            disabled={replyStatus[selectedEmail.id] === 'sending' || replyStatus[selectedEmail.id] === 'sent'}
                          >
                            {replyStatus[selectedEmail.id] === 'sending' ? (
                              <>
                                <Send className="mr-2 h-4 w-4 animate-pulse" /> Sending...
                              </>
                            ) : replyStatus[selectedEmail.id] === 'sent' ? (
                              <>
                                <Send className="mr-2 h-4 w-4" /> Sent!
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" /> Send this reply
                              </>
                            )}
                          </Button>
                          {replyStatus[selectedEmail.id] === 'error' && <p className="text-xs text-red-500 mt-2 text-center">Failed to send.</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} DigiMail. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
