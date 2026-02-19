"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addBookmark(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const url = formData.get("url") as string;
    const title = formData.get("title") as string;

    if (!url || !title) return { error: "URL and title are required." };

    // Basic URL validation
    try {
        new URL(url);
    } catch {
        return { error: "Please enter a valid URL (include https://)." };
    }

    const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        url: url.trim(),
        title: title.trim(),
    });

    if (error) return { error: error.message };

    revalidatePath("/");
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // extra safety — RLS already enforces this

    if (error) return { error: error.message };

    revalidatePath("/");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
