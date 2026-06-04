import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import EntityForm from "@/app/admin/EntityForm";

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("career")
    .select("id, company, role, started_on, ended_on")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <EntityForm
      entity="career"
      mode="edit"
      defaults={{
        id: data.id,
        field1: data.company,
        field2: data.role,
        started_on: data.started_on,
        ended_on: data.ended_on,
      }}
    />
  );
}
