import { supabase } from "./supabase";

export const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

export const signOut = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};