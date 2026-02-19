import { signOut } from "@/app/actions";
import type { User } from "@supabase/supabase-js";

export default function Header({ user }: { user: User }) {
    const avatarUrl =
        user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
    const displayName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email ??
        "User";

    return (
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-600/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-white"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-100 text-sm">
                        Bookmark Manager
                    </span>
                </div>

                {/* User + Sign Out */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                width={28}
                                height={28}
                                className="rounded-full ring-2 ring-slate-700"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                                {displayName[0].toUpperCase()}
                            </div>
                        )}
                        <span className="text-slate-400 text-sm hidden sm:block truncate max-w-[140px]">
                            {displayName}
                        </span>
                    </div>

                    <form action={signOut}>
                        <button type="submit" className="btn-ghost">
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}
