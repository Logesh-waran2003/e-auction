import { NextResponse } from 'next/server';
import { useAuthStore } from '@/store/authStore';

export async function POST() {
  // Clear the session (e.g., delete cookies or tokens)
  // For example, if using cookies:
  // const response = NextResponse.json({ success: true });
  // response.cookies.delete('session-token');

  // Clear the user in the auth store
  useAuthStore.getState().logout();

  return NextResponse.json({ success: true });
}
