import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabaseClientServer';
import { getLocalStorage } from './utils/helpers';

export async function middleware(request: NextRequest) {
  const supabase = createClient();

  // Kullanıcının oturum bilgilerini kontrol et
// //   const { data: { user }, error } = await supabase.auth.getUser();
const user = getLocalStorage('user');

  // Eğer kullanıcı yoksa, oturum açma sayfasına yönlendir
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url)); // Login sayfasına yönlendirme
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

