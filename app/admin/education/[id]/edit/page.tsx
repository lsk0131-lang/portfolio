import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import EntityForm from "@/app/admin/EntityForm";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("education")
    .select("id, school, degree, started_on, ended_on")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <EntityForm
      entity="education"
      mode="edit"
      defaults={{
        id: data.id,
        field1: data.school,
        field2: data.degree,
        started_on: data.started_on,
        ended_on: data.ended_on,
      }}
    />
  );
}
