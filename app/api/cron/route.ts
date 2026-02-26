import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
  try {
    // Prevent random people from triggering your emails!
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    
    // Look for capsules where delivery_date is today (or passed) AND is_delivered is false
    const today = new Date().toISOString().split('T')[0]; 
    
    const { data: capsules, error } = await supabase
      .from('capsules')
      .select('id, target_email')
      .lte('delivery_date', today) 
      .eq('is_delivered', false);

    if (error) throw error;

    if (!capsules || capsules.length === 0) {
      return NextResponse.json({ message: 'No capsules to deliver today.' });
    }

    // LOOP AND SEND EMAILS
    for (const capsule of capsules) {
      // The URL they will click to view their capsule
      const capsuleUrl = `https://your-domain.com/capsule/${capsule.id}`;

      await resend.emails.send({
        from: 'Echi Time Capsules <onboarding@resend.dev>', 
        to: capsule.target_email,
        subject: "Your Echi Time Capsule is ready to open!",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #f9fafb;">
            <h1 style="color: #6042EE;">It is time.</h1>
            <p style="color: #374151; font-size: 16px;">A message from the past is waiting for you.</p>
            <a href="${capsuleUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #6042EE; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Unlock Your Capsule
            </a>
          </div>
        `
      });

      // MARK AS DELIVERED
      await supabase
        .from('capsules')
        .update({ is_delivered: true })
        .eq('id', capsule.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully delivered ${capsules.length} capsules.` 
    });

  } catch (error: any) {
    console.error('CRON Error:', error);
    return NextResponse.json({ error: 'Failed to run CRON job' }, { status: 500 });
  }
}