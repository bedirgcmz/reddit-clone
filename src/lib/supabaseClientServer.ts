import 'server-only';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../utils/database.types'; 

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
