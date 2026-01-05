import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const { email, name } = await request.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email and name are required' },
                { status: 400 }
            );
        }

        const subject = "Welcome to Tareqs Drip Family! 🎉";

        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px;">
                <div style="background: white; border-radius: 12px; padding: 40px; text-align: center;">
                    <h1 style="color: #667eea; font-size: 28px; margin-bottom: 10px;">Welcome to the Drip! 💧</h1>
                    <p style="color: #666; font-size: 18px; margin-bottom: 30px;">Hey ${name}! 👋</p>
                    
                    <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        We're thrilled to have you join the <strong>Tareqs Drip</strong> family! 
                        You've just unlocked access to the most stylish fashion collection in town.
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 30px 0;">
                        <p style="color: white; font-size: 14px; margin: 0;">🎁 As a welcome gift, use code</p>
                        <p style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 10px 0;">WELCOME10</p>
                        <p style="color: white; font-size: 14px; margin: 0;">for 10% off your first order!</p>
                    </div>
                    
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tareqsdrip.vercel.app'}/shop" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; margin-top: 20px;">
                        Start Shopping →
                    </a>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 40px;">
                        Stay stylish,<br/>
                        <strong>The Tareqs Drip Team</strong>
                    </p>
                </div>
            </div>
        `;

        await sendMail({
            to: email,
            subject,
            html
        });

        return NextResponse.json({ success: true, message: 'Welcome email sent!' });
    } catch (error) {
        console.error('Welcome email error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send welcome email' },
            { status: 500 }
        );
    }
}
