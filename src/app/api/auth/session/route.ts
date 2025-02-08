import { adminAuth } from '@/lib/firebase/firebase-admin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Session POST request received');
  
  try {
    const body = await request.json();
    console.log('Request body:', { ...body, idToken: body.idToken ? '[REDACTED]' : undefined });
    
    const { idToken } = body;
    
    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    try {
      // Verify the ID token
      console.log('Verifying ID token...');
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('Token verified successfully for user:', decodedToken.uid);
      
      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      console.log('Creating session cookie...');
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
      
      // Set cookie
      console.log('Setting session cookie...');
      const cookieStore = cookies();
      
      // Get the current environment
      const isDevelopment = process.env.NODE_ENV === 'development';
      console.log('Environment:', isDevelopment ? 'development' : 'production');

      cookieStore.set('session', sessionCookie, {
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: !isDevelopment, // Only require secure in production
        path: '/',
        sameSite: isDevelopment ? 'lax' : 'strict',
        // Allow any domain in development
        domain: isDevelopment ? undefined : process.env.NEXT_PUBLIC_DOMAIN,
      });
      
      console.log('Session cookie set successfully');
      return NextResponse.json({ status: 'success' });
    } catch (verifyError: any) {
      console.error('Error in token verification:', verifyError.message);
      console.error('Error stack:', verifyError.stack);
      return NextResponse.json(
        { error: 'Invalid token', details: verifyError.message },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Error in session POST:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  console.log('Session DELETE request received');
  
  try {
    const cookieStore = cookies();
    cookieStore.delete('session', {
      path: '/',
      // Allow any domain in development
      domain: process.env.NODE_ENV === 'development' ? undefined : process.env.NEXT_PUBLIC_DOMAIN,
    });
    console.log('Session cookie deleted successfully');
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Error in session DELETE:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 