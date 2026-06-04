"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getAdminStatus } from "@/utils/admin";

type Entity = "career" | "education";

function readEntityPayload(
  entity: Entity,
  formData: FormData
): Record<string, string | null> {
  const startedOn = String(formData.get("started_on") ?? "").trim();
  const endedOnRaw = String(formData.get("ended_on") ?? "").trim();
  const ended_on = endedOnRaw === "" ? null : endedOnRaw;

  if (entity === "career") {
    const company = String(formData.get("company") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    if (!company || !role || !startedOn) {
      throw new Error("회사·직책·입사일은 필수입니다.");
    }
    return { company, role, started_on: startedOn, ended_on };
  }

  const school = String(formData.get("school") ?? "").trim();
  const degree = String(formData.get("degree") ?? "").trim();
  if (!school || !degree || !startedOn) {
    throw new Error("학교·전공/학위·입학일은 필수입니다.");
  }
  return { school, degree, started_on: startedOn, ended_on };
}

async function ensureAdmin() {
  const { isAdmin } = await getAdminStatus();
  if (!isAdmin) {
    redirect("/login?error=not-admin");
  }
}

export async function createEntry(entity: Entity, formData: FormData) {
  await ensureAdmin();
  const payload = readEntityPayload(entity, formData);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from(entity).insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateEntry(
  entity: Entity,
  id: string,
  formData: FormData
) {
  await ensureAdmin();
  const payload = readEntityPayload(entity, formData);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from(entity).update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteEntry(entity: Entity, id: string) {
  await ensureAdmin();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from(entity).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
