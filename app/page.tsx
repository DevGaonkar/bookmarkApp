import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default async function HomePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <>
            <Header user={user} />

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Ambient background blob */}
                <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[400px] bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Your Bookmarks</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {bookmarks?.length ?? 0} saved{" "}
                        {(bookmarks?.length ?? 0) === 1 ? "bookmark" : "bookmarks"} •
                        updates in real-time
                    </p>
                </div>

                <AddBookmarkForm />

                <BookmarkList
                    initialBookmarks={bookmarks ?? []}
                    userId={user.id}
                />
            </main>
        </>
    );
}
