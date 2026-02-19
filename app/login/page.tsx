import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default async function LoginPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect("/");

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background gradient blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md">
                {/* Logo / Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-600/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 text-white"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Bookmark Manager
                    </h1>
                    <p className="mt-2 text-slate-400 text-sm">
                        Your private, real-time bookmark collection
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card p-8">
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Welcome back
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Sign in to access your bookmarks.
                    </p>

                    <GoogleSignInButton />

                    <p className="mt-6 text-center text-xs text-slate-500">
                        By signing in you agree to keep your bookmarks{" "}
                        <span className="text-brand-500">private and secure</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
