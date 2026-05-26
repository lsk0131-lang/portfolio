import Career from "./components/Career";
import Education from "./components/Education";
import Guestbook from "./components/Guestbook";

export default function Page() {
  return (
    <>
      <section id="hero" className="hero container reveal">
        <p className="hero__greeting">안녕하세요, 저는</p>
        <h1 className="hero__name">
          <span>이슬기</span>
          <span className="hero__name-suffix">입니다.</span>
        </h1>
        <p className="hero__role">기업PR 리더 · Corporate PR Leader</p>
        <p className="hero__tagline">
          기업의 정보를 가장 명확하게 전달하는 일을 합니다.
        </p>
        <div className="hero__actions">
          <a href="#career" className="btn btn--primary">경력 보기</a>
          <a href="#contact" className="btn btn--ghost">연락하기</a>
        </div>
      </section>

      <section id="about" className="section container reveal">
        <h2 className="section__title">About</h2>
        <div className="about">
          <p>
            안녕하세요. 저는 카카오에서 카카오톡을 비롯한 서비스, 정책/투자 등 기업
            이슈에 대한 언론PR을 담당하고 있습니다.
          </p>
        </div>
      </section>

      <section id="skills" className="section section--soft reveal">
        <div className="container">
          <h2 className="section__title">Skills</h2>
          <ul className="skills" aria-label="업무 역량">
            <li className="skill-tag">언론홍보</li>
            <li className="skill-tag">위기관리</li>
            <li className="skill-tag">보도자료</li>
            <li className="skill-tag">온라인홍보</li>
          </ul>
        </div>
      </section>

      <section id="career" className="section container reveal">
        <h2 className="section__title">Career</h2>
        <Career />
      </section>

      <section id="education" className="section section--soft reveal">
        <div className="container">
          <h2 className="section__title">Education</h2>
          <Education />
        </div>
      </section>

      <section id="guestbook" className="section container reveal">
        <h2 className="section__title">Guestbook</h2>
        <Guestbook />
      </section>

      <section id="contact" className="section section--soft reveal">
        <div className="container">
          <h2 className="section__title">Contact</h2>
          <p className="contact__lead">
            함께 만들고 싶은 것이 있다면 언제든 편하게 연락주세요.
          </p>
          <ul className="contact-list">
            <li>
              <a href="mailto:lsk0131@gmail.com">
                <span className="contact-list__label">Email</span>
                <span className="contact-list__value">lsk0131@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
