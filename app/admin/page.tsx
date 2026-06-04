import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1 className="section__title">관리</h1>
      <p className="contact__lead">
        경력·학력 항목을 추가하거나 수정·삭제할 수 있습니다. 공개 사이트 (
        <Link href="/">메인</Link>) 에서 각 항목의 수정·삭제 버튼으로도 진입할 수 있습니다.
      </p>
      <div className="admin-dashboard__grid">
        <article className="admin-dashboard__card">
          <h2>Career</h2>
          <p>경력 항목 추가</p>
          <Link href="/admin/career/new" className="btn btn--primary">
            + 경력 추가
          </Link>
        </article>
        <article className="admin-dashboard__card">
          <h2>Education</h2>
          <p>학력 항목 추가</p>
          <Link href="/admin/education/new" className="btn btn--primary">
            + 학력 추가
          </Link>
        </article>
      </div>
    </div>
  );
}
