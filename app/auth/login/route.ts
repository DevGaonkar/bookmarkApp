import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error || !data.url) {
        return NextResponse.redirect(
            new URL("/login?error=oauth_failed", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
        );
    }

    return NextResponse.redirect(data.url);
}
