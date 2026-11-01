import { NextResponse, type NextRequest } from "next/server";
import { sessionClient } from "@/lib/supabase/server";

// The email confirmation link lands here and is exchanged for a session.
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  if (code) {
    const supabase = await sessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/account/orders`);
  }
  return NextResponse.redirect(`${origin}/login`);
}
