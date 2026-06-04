import LoginForm from "./LoginForm";

export const metadata = { title: "로그인 · 이슬기" };

export default function LoginPage() {
  return (
    <section className="section container">
      <div className="auth-box">
        <h1 className="auth-box__title">관리자 로그인</h1>
        <p className="auth-box__lead">
          등록된 관리자 이메일로 매직 링크를 보내드립니다. 메일함의 링크를 클릭하면 로그인됩니다.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
