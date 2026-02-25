// app/api/capsules/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using your secure environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming FormData
    const formData = await request.formData();
    
    const message = formData.get('message') as string;
    const targetEmail = formData.get('targetEmail') as string;
    const deliveryDate = formData.get('deliveryDate') as string;
    const files = formData.getAll('images') as File[]; 

    const uploadedImageUrls: string[] = [];

    // 2. Loop through the files and upload them to the Supabase bucket
    for (const file of files) {
      // Convert the file to a format Supabase can read
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      
      // Create a unique filename so images don't overwrite each other
      const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      // Upload to our 'capsules' bucket
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('capsules')
        .upload(uniqueFileName, fileBuffer, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload image");
      }

      // 3. Get the public URL for the newly uploaded image
      const { data: publicUrlData } = supabase
        .storage
        .from('capsules')
        .getPublicUrl(uniqueFileName);

      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    // 4. Save the text data AND the image URLs into your database table
    const { data: dbData, error: dbError } = await supabase
      .from('capsules')
      .insert([{ 
        message: message, 
        target_email: targetEmail, 
        delivery_date: deliveryDate,
        images: uploadedImageUrls // Assuming you have an 'images' column set to JSONB or text array
      }])
      .select();

    if (dbError) throw dbError;

    // 5. Tell the frontend everything worked!
    return NextResponse.json({ success: true, capsule: dbData }, { status: 200 });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: error.message || 'Failed to seal capsule' }, { status: 500 });
  }
}