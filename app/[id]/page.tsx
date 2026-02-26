import React from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CapsuleViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const capsuleId = resolvedParams.id;

  // 1. Fetch the capsule
  const { data: capsule, error } = await supabase
    .from('capsules')
    .select('*')
    .eq('id', capsuleId)
    .single();

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-[#6042EE] flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Capsule Not Found</h1>
        <p className="text-purple-200">We couldn't find a time capsule with this ID.</p>
      </div>
    );
  }

  // 2. TIME LOCK LOGIC: Check if today is before the delivery date
  const today = new Date();
  const deliveryDate = new Date(capsule.delivery_date);
  
  // Format the date for the UI
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  // 3. THE GUARD: If it's too early, return the Locked UI!
  if (today < deliveryDate) {
    return (
      <div className="min-h-screen bg-[#6042EE] flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">It's not time yet.</h1>
        <p className="text-xl text-purple-200 mb-8 max-w-md">
          This time capsule is sealed tight. You can open it and read the message on:
        </p>
        <div className="px-8 py-4 bg-white text-[#6042EE] font-bold rounded-lg text-2xl shadow-lg">
          {formattedDeliveryDate}
        </div>
      </div>
    );
  }

  // --- IF WE PASS THE GUARD, RENDER THE ACTUAL CAPSULE BELOW ---
  
  const createdDate = new Date(capsule.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#6042EE] font-sans text-white py-12 px-4 flex items-center justify-center">
      <main className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="p-8 md:p-12">
          
          <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFD600]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF4D4D]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#00D1FF]" />
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-tight">Echi Time Capsule</span>
            </div>
            
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#9A73FF]/10 text-[#6042EE] font-bold text-xs rounded-full tracking-wide">
                Delivered
              </span>
              <p className="text-gray-400 text-xs mt-2 font-medium">Sealed: {createdDate}</p>
            </div>
          </div>

          <article className="mb-12">

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">

              A message from the past.

            </h1>

            {/* whitespace-pre-wrap ensures line breaks in the text are respected */}

            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">

                <span className='italic block mb-2'>Dear Future Me,</span>

              {capsule.message} ,

                <span className='italic block mt-4'>With love, Past You</span>

            </p>

          </article>

          {capsule.images && capsule.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Attached Memories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capsule.images.map((imgSrc: string, index: number) => (
                  <div 
                    key={index} 
                    className={`relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${index === 0 && capsule.images.length % 2 !== 0 ? 'sm:col-span-2' : ''}`}
                  >
                    <Image 
                      src={imgSrc}
                      alt={`Memory ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This capsule (ID: <span className="font-mono">{capsule.id}</span>) was securely delivered by Echi.
          </p>
        </div>
      </main>
    </div>
  );
}