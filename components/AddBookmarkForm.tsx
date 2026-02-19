"use client";

import { useRef, useState, useTransition } from "react";
import { addBookmark } from "@/app/actions";

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await addBookmark(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                formRef.current?.reset();
            }
        });
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-card p-6 mb-8"
        >
            <h2 className="text-base font-semibold text-slate-200 mb-4">
                Add a Bookmark
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    name="title"
                    type="text"
                    placeholder="Title (e.g. Next.js Docs)"
                    required
                    className="input-field sm:w-48 flex-shrink-0"
                    disabled={isPending}
                />
                <input
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    required
                    className="input-field flex-1"
                    disabled={isPending}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    {isPending ? (
                        <>
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
                            Saving…
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                            </svg>
                            Add
                        </>
                    )}
                </button>
            </div>

            {error && (
                <p className="mt-3 text-red-400 text-sm flex items-center gap-1.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 flex-shrink-0"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </form>
    );
}
