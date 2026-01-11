import { createClient } from "@supabase/supabase-js";
import { UserData } from "./UserData";

// Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Register a user with email and password
 */
export async function registerWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Get the current session
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (session: any) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data?.subscription?.unsubscribe;
}

/**
 * Create a new UserData record in the UserData table
 */
export async function createUserData(userId: string, email: string) {
  const userData = new UserData(email, 0, 0, 0, 0);
  const { data, error } = await supabase
    .from("UserData")
    .insert([{ user: userId, email: email, wins: 0, losses: 0, pushes: 0, wallet: 0 }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetch UserData for the current user
 */
export async function fetchUserData(userId: string) {
  const { data, error } = await supabase
    .from("UserData")
    .select("*")
    .eq("user", userId)
    .single();
  if (error && error.code !== "PGRST116") throw new Error(error.message); // PGRST116 = no rows found
  return data;
}

/**
 * Update UserData (wins, losses, pushes, wallet)
 */
export async function updateUserData(userId: string, updates: Partial<UserData>) {
  const { data, error } = await supabase
    .from("UserData")
    .update(updates)
    .eq("user", userId)
    .select();
  if (error) throw new Error(error.message);
  return data;
}
