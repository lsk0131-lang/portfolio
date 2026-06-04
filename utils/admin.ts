import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type AdminStatus = {
  isAdmin: boolean;
  email: string | null;
};

export async function getAdminStatus(): Promise<AdminStatus> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return { isAdmin: false, email: null };

    const { data } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();
    return { isAdmin: !!data, email: user.email };
  } catch {
    return { isAdmin: false, email: null };
  }
}
