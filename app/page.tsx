'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function EchiLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. Setup State for our form inputs
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State for our inline success/error messages
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  // Helper to get tomorrow's date for the date input 'min' attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // 2. The Submit Handler
  const handleSealCapsule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, text: '' }); // Clear any previous messages

    try {
      // Create a FormData object to hold text AND files
      const formData = new FormData();
      formData.append('message', message);
      formData.append('targetEmail', email);
      formData.append('deliveryDate', date);

      // Append files if the user selected any
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }

      // Send the data to our Next.js API route
      const response = await fetch('/api/capsule', {
        method: 'POST',
        body: formData, // No JSON.stringify needed for FormData!
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message (will render on the main page now)
        setStatus({ type: 'success', text: `Capsule sealed securely! We will deliver it on ${date}.` });
        
        // Clear the form
        setMessage('');
        setEmail('');
        setDate('');
        setImages(null);
        
        // Close modal immediately so user sees the success message on the main page
        setIsModalOpen(false);

        // Wait 3 seconds, then hide the success message
        setTimeout(() => {
          setStatus({ type: null, text: '' }); // reset status for next time
        }, 3000);

      } else {
        // Show error message from server
        setStatus({ type: 'error', text: result.error || "Failed to seal capsule." });
      }
    } catch (error:any) {
      console.error("Submission failed:", error);
      // Show catch block error message
      setStatus({ type: 'error', text: "An unexpected error occurred while sealing your capsule." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to cleanly close modal and reset errors
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatus({ type: null, text: '' });
  };

  return (
    <div className="min-h-screen bg-[#6042EE] font-sans text-white relative">
      
      {/* --- SUCCESS BANNER (Moved to main page) --- */}
      {status.type === 'success' && status.text && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4 animate-fade-in-down">
          <div className="p-4 rounded-lg text-sm font-medium border bg-green-50 text-green-700 border-green-200 shadow-xl text-center">
            {status.text}
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFD600]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF4D4D]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#00D1FF]" />
          </div>
          <div className="text-2xl font-bold tracking-tight">Echi</div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-white text-[#6042EE] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          Send an email
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            A time capsule <br /> for your digital memories.
          </h1>
          <p className="text-lg md:text-xl font-normal text-purple-200 opacity-90 max-w-md leading-relaxed">
            Write an email, attach your favorite images, and choose a date in the future. We'll deliver it exactly when you're ready to open it.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-white text-[#6042EE] font-bold rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start your capsule
            </button>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8 rotate-3 transform transition-transform hover:rotate-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex -space-x-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFD600]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF4D4D]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#00D1FF]" />
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-tight">Echi</span>
            </div>
            
            <div className="relative w-full aspect-video bg-gray-50 rounded-lg mb-6 overflow-hidden border border-gray-100">
              <Image 
                src="/heroin.jpg" 
                alt="Echi Time Capsule Illustration"
                fill 
                className="object-cover" 
                priority 
              />
            </div>

            <h3 className="text-[#6042EE] font-bold text-2xl tracking-tight mb-2">Echi capsule</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your message is safely stored and waiting for the right moment.
            </p>
            <div className="w-full h-10 bg-[#9A73FF] rounded-lg opacity-20"></div>
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div 
            onClick={handleCloseModal} 
            className="absolute inset-0 bg-[#6042EE]/80 backdrop-blur-sm" 
          />
          
          <div className="relative bg-white w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col custom-scrollbar">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-2 mb-10">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-[#FFD600]" />
                  <div className="w-4 h-4 rounded-full bg-[#FF4D4D]" />
                  <div className="w-4 h-4 rounded-full bg-[#00D1FF]" />
                </div>
                <span className="font-bold text-gray-800 text-sm tracking-tight">Echi</span>
              </div>

              <div className="mb-6">
                <h2 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight mb-3">
                  Write to your <br /> future self.
                </h2>
                <p className="text-gray-500 text-sm font-normal">
                  Draft your email and add images. We will keep it safe until the delivery date.
                </p>
              </div>

              {/* ERROR Banner (Kept inside modal) */}
              {status.type === 'error' && status.text && (
                <div className="p-4 mb-6 rounded-lg text-sm font-medium border bg-red-50 text-red-700 border-red-200">
                  {status.text}
                </div>
              )}

              {/* 3. Connect the form to our handler */}
              <form onSubmit={handleSealCapsule}>
                <div className="space-y-4 mb-8">
                  <textarea 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#9A73FF] focus:ring-1 focus:ring-[#9A73FF] min-h-[160px] resize-y"
                  />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Target email address"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#9A73FF] focus:ring-1 focus:ring-[#9A73FF]"
                  />
                  <input 
                    required
                    type="date" 
                    min={getTomorrowDate()} // Restricts selection to tomorrow onwards
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#9A73FF] focus:ring-1 focus:ring-[#9A73FF]"
                  />

                  {/* File Upload Section */}
                  <div>
                    <label className="flex flex-col items-center justify-center w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-[#9A73FF] transition-colors">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        <span className="text-sm text-gray-500 font-medium">
                          {images && images.length > 0 
                            ? `${images.length} file(s) selected` 
                            : 'Click to attach images'}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setImages(e.target.files)}
                      />
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || status.type === 'success'}
                  className="w-full py-3.5 bg-[#9A73FF] text-white font-bold rounded-lg hover:bg-[#885BFF] transition-colors mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sealing Capsule...' : 'Seal and Schedule'}
                </button>
              </form>

              <p className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
                If you did not sign up for this account you can ignore this email and the account will be deleted. <br/><br/>
                © {new Date().getFullYear()} Echi. All rights reserved. You received this email because you signed up for an app that helps you create your emails.
              </p>

              <button 
                onClick={handleCloseModal}
                className="w-full mt-6 text-[#9A73FF] text-sm font-medium hover:underline"
              >
                Close form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}