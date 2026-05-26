import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type EducationRow = {
  id: string;
  school: string;
  degree: string;
  started_on: string;
  ended_on: string | null;
};

function formatPeriod(startedOn: string, endedOn: string | null) {
  const start = formatYearMonth(startedOn);
  if (!endedOn) return `${start} — 재학중`;
  return `${start} — ${formatYearMonth(endedOn)}`;
}

function formatYearMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${y}.${m}`;
}

export default async function Education() {
  let rows: EducationRow[] = [];
  let error: unknown = null;
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const result = await supabase
      .from("education")
      .select("id, school, degree, started_on, ended_on")
      .order("started_on", { ascending: false });
    rows = (result.data ?? []) as EducationRow[];
    error = result.error;
  } catch (e) {
    error = e;
  }

  if (error || rows.length === 0) {
    return (
      <p className="guestbook__empty">
        {error ? "학력 정보를 불러오지 못했습니다." : "등록된 학력이 없습니다."}
      </p>
    );
  }

  return (
    <ol className="education">
      {rows.map((row) => (
        <li key={row.id} className="education__item">
          <div className="education__period">
            {formatPeriod(row.started_on, row.ended_on)}
          </div>
          <div className="education__body">
            <h3 className="education__school">{row.school}</h3>
            <p className="education__degree">{row.degree}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
