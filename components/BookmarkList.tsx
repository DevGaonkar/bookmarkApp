"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteBookmark } from "@/app/actions";

type Bookmark = {
    id: string;
    url: string;
    title: string;
    created_at: string;
    user_id: string;
};

export default function BookmarkList({
    initialBookmarks,
    userId,
}: {
    initialBookmarks: Bookmark[];
    userId: string;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setBookmarks((prev) => {
                        // Avoid duplicates (optimistic insert already added it)
                        if (prev.find((b) => b.id === (payload.new as Bookmark).id))
                            return prev;
                        return [payload.new as Bookmark, ...prev];
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setBookmarks((prev) =>
                        prev.filter((b) => b.id !== (payload.old as Bookmark).id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // Keep in sync when server re-renders pass new initialBookmarks (navigation)
    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    const handleDelete = (id: string) => {
        setDeletingId(id);
        startTransition(async () => {
            await deleteBookmark(id);
            setDeletingId(null);
        });
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7 text-slate-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                    </svg>
                </div>
                <p className="text-slate-500 text-sm">No bookmarks yet.</p>
                <p className="text-slate-600 text-xs mt-1">Add your first one above!</p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {bookmarks.map((bookmark) => (
                <li
                    key={bookmark.id}
                    className="glass-card p-4 flex items-start gap-4 group transition-all duration-200 hover:border-slate-600/70"
                >
                    {/* Favicon */}
                    <div className="flex-shrink-0 mt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-sm"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-100 truncate leading-tight">
                            {bookmark.title}
                        </p>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-500 hover:text-brand-400 text-sm truncate block mt-0.5 transition-colors"
                        >
                            {bookmark.url}
                        </a>
                        <p className="text-slate-600 text-xs mt-1">
                            {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        disabled={isPending && deletingId === bookmark.id}
                        aria-label="Delete bookmark"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all duration-200 p-1 rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                    >
                        {isPending && deletingId === bookmark.id ? (
                            <svg
                                className="animate-spin w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );
}
