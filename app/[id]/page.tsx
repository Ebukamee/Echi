import React from 'react';
import Image from 'next/image';

// In Next.js 13+, dynamic route parameters are passed as props
export default function CapsuleViewPage({ params }: { params: { id: string } }) {
  
  // MOCK DATA: In a real app, you would fetch this from your database using the params.id
  const capsuleData = {
    id: params.id,
    senderEmail: "you@example.com",
    createdDate: "Oct 24, 2023",
    deliveryDate: "Feb 25, 2026",
    message: "Dear Future Me,\n\nIf you are reading this, it means you've made it to 2026. I hope you finally took that trip to Japan, and I hope you are still coding and building amazing things.\n\nNever forget why you started. Keep pushing forward.\n\nBest,\nPast You.",
    images: [
      "/heroin.jpg",
      "/heroin.jpg",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop", // Mock photo 1
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"  // Mock photo 2
    ]
  };

  return (
    <div className="min-h-screen bg-[#6042EE] font-sans text-white py-12 px-4 flex items-center justify-center">
      
      {/* The "Opened Letter" Card */}
      <main className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col relative">

        <div className="p-8 md:p-12">
          
          {/* Header / Brand */}
          <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFD600]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF4D4D]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#00D1FF]" />
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-tight">Echi Time Capsule</span>
            </div>
            
            {/* Metadata Tags */}
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#9A73FF]/10 text-[#6042EE] font-bold text-xs rounded-full tracking-wide">
                Delivered
              </span>
              <p className="text-gray-400 text-xs mt-2 font-medium">Sealed: {capsuleData.createdDate}</p>
            </div>
          </div>

          {/* The Letter Content */}
          <article className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">
              A message from the past.
            </h1>
            {/* whitespace-pre-wrap ensures line breaks in the text are respected */}
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
              {capsuleData.message}
            </p>
          </article>

          {/* Attached Images Grid */}
          {capsuleData.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Attached Memories</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capsuleData.images.map((imgSrc, index) => (
                  <div 
                    key={index} 
                    // Make the first image span full width if there's an odd number of images
                    className={`relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${index === 0 && capsuleData.images.length % 2 !== 0 ? 'sm:col-span-2' : ''}`}
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

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This capsule (ID: <span className="font-mono">{capsuleData.id}</span>) was securely delivered by Echi. <br />
            Create your own time capsule today.
          </p>
        </div>
      </main>

    </div>
  );
}