import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type CareerRow = {
  id: string;
  company: string;
  role: string;
  started_on: string;
  ended_on: string | null;
};

function formatPeriod(startedOn: string, endedOn: string | null) {
  const start = formatYearMonth(startedOn);
  if (!endedOn) return `${start} — 현재`;
  return `${start} — ${formatYearMonth(endedOn)}`;
}

function formatYearMonth(iso: string) {
  // iso = 'YYYY-MM-DD'
  const [y, m] = iso.split("-");
  return `${y}.${m}`;
}

export default async function Career() {
  let rows: CareerRow[] = [];
  let error: unknown = null;
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const result = await supabase
      .from("career")
      .select("id, company, role, started_on, ended_on")
      .order("started_on", { ascending: false });
    rows = (result.data ?? []) as CareerRow[];
    error = result.error;
  } catch (e) {
    error = e;
  }

  if (error || rows.length === 0) {
    return (
      <p className="guestbook__empty">
        {error ? "경력 정보를 불러오지 못했습니다." : "등록된 경력이 없습니다."}
      </p>
    );
  }

  return (
    <ol className="career">
      {rows.map((row) => (
        <li key={row.id} className="career__item">
          <div className="career__period">
            {formatPeriod(row.started_on, row.ended_on)}
          </div>
          <div className="career__body">
            <h3 className="career__company">{row.company}</h3>
            <p className="career__role">{row.role}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
