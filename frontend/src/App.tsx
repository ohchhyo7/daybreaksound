import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import clubPhoto from "./assets/club-photo.jpg";
import dbRulePhoto from "./assets/db-rule.jpg";

type SectionId = "intro" | "news" | "schedule" | "gallery";
type PageView = "home" | "rule" | "apply" | "login";

const INSTAGRAM_URL = "https://www.instagram.com/daybreak_sound/";

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "intro", label: "소개" },
  { id: "news", label: "소식" },
  { id: "schedule", label: "일정" },
  { id: "gallery", label: "사진" },
];

const CLUB_RULES = [
  {
    num: "01",
    title: "동아리 방 깨끗이 쓰기",
    sub: "쓰레기 무단투기 적발 시 단톡방에 공개처형!",
    important: false,
  },
  {
    num: "02",
    title: "단톡방 투표 참여 및 공지확인 잘 하기",
    sub: "투표 미참여시 회장과 1ㄷ1 맞짱. (야차룰)",
    important: true,
  },
  {
    num: "03",
    title: "선 / 후배 간 허물없이 지내기~",
    sub: "그렇지 않은 모습 적발 시 회식때 공개처형!",
    important: false,
  },
  {
    num: "04",
    title: "시험기간에는 동방에서 악기연주 금지.",
    sub: "발각시 1·8극장에서 혼자 공연시킴",
    important: false,
  },
  {
    num: "05",
    title: "악기연주가 끝나면 항상 제자리에 정리하기",
    sub: "악기손상 위험이 있기 때문, 돈 많으면 방치 쌉가능",
    important: false,
  },
  {
    num: "06",
    title: "동아리 모임 늦거나 결석할 경우 꼭! 알려주기",
    sub: "무단 결석 및 지각시 회식 때 늦은 시간 1초당 1잔",
    important: false,
  },
  {
    num: "07",
    title: "회식 참석 강요 절~대 없음",
    sub: "근데 사람 많을수록 재밌더라~",
    important: false,
  },
];

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// 스크롤 시 입체적으로 떠오르는 섹션 래퍼
function RevealSection({
  id,
  children,
}: {
  id: SectionId;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.14 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        scrollMarginTop: "96px",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1) rotateX(0deg)"
          : "translateY(48px) scale(0.96) rotateX(4deg)",
        transition:
          "opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </section>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px 16px",
  fontSize: "14px",
  color: "#1E1B2E",
  backgroundColor: "#FAF9FD",
  border: "1px solid #DED8EE",
  borderRadius: "14px",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  color: "#2B2347",
  marginBottom: "8px",
};

export default function App() {
  const [page, setPage] = useState<PageView>("home");
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 신입 지원 폼 상태
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    major: "",
    studentId: "",
    motivation: "",
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // 회원 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (page !== "home") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      const scrollPosition = scrollTop + window.innerHeight * 0.35;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: relX * 26, y: relY * 26 });
  };

  const goHome = () => {
    setPage("home");
    setApplySubmitted(false);
    setLoginMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openRule = () => {
    setPage("rule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openApply = () => {
    setApplySubmitted(false);
    setPage("apply");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLogin = () => {
    setLoginMessage("");
    setPage("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: SectionId) => {
    if (page !== "home") {
      setPage("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleApplySubmit = (e: FormEvent) => {
    e.preventDefault();
    setApplySubmitted(true);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginMessage("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setLoginMessage(
      `${loginForm.username}님, 로그인 요청이 접수되었습니다. (백엔드 API 연동 예정)`
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F6F4FA",
        color: "#1E1B2E",
        fontFamily: "'Noto Sans KR', sans-serif",
        textAlign: "left",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* 애니메이션 키프레임 정의 */}
      <style>{`
        @keyframes heroRise {
          0% {
            opacity: 0;
            transform: translateY(44px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gearLaunchLeft {
          0% {
            opacity: 0;
            transform: translateY(140px) rotate(-28deg) scale(0.7);
          }
          65% {
            opacity: 1;
            transform: translateY(-14px) rotate(-8deg) scale(1.04);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(-12deg) scale(1);
          }
        }

        @keyframes gearLaunchRight {
          0% {
            opacity: 0;
            transform: translateY(160px) rotate(26deg) scale(0.7);
          }
          65% {
            opacity: 1;
            transform: translateY(-16px) rotate(8deg) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(12deg) scale(1);
          }
        }

        @keyframes floatGuitar {
          0%, 100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-18px) rotate(-6deg);
          }
        }

        @keyframes floatMic {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-22px) rotate(18deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.14);
            opacity: 0.85;
          }
        }

        @keyframes soundWave {
          0%, 100% {
            transform: scaleY(0.45);
          }
          50% {
            transform: scaleY(1.25);
          }
        }

        .magic-card {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
        }
        .magic-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 22px 44px rgba(75, 63, 114, 0.14);
        }

        .magic-btn {
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, background-color 0.25s ease;
        }
        .magic-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 24px rgba(91, 75, 138, 0.26);
        }
      `}</style>

      {/* 상단 스크롤 진행 바 */}
      {page === "home" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "4px",
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #9D8DF1 0%, #5B4B8A 100%)",
            zIndex: 60,
            transition: "width 0.1s linear",
          }}
        />
      )}

      {/* 상단 바 */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          backgroundColor: "rgba(246, 244, 250, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E6E1F2",
        }}
      >
        <button
          type="button"
          onClick={goHome}
          style={{
            fontWeight: 900,
            fontSize: "21px",
            color: "#2B2347",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          새벽소리.
        </button>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={openRule}
            className="magic-btn"
            style={{
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 700,
              color: page === "rule" ? "#FFFFFF" : "#5B4B8A",
              backgroundColor: page === "rule" ? "#5B4B8A" : "#EAE4F7",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            새벽소리 RULE
          </button>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="magic-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#5B4B8A",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DFD7F2",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            <InstagramIcon size={15} />
            <span>Instagram</span>
          </a>

          <button
            type="button"
            onClick={openLogin}
            className="magic-btn"
            style={{
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: page === "login" ? 700 : 500,
              color: page === "login" ? "#2B2347" : "#4A4266",
              background: page === "login" ? "#EAE4F7" : "transparent",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            회원 로그인
          </button>

          <button
            type="button"
            onClick={openApply}
            className="magic-btn"
            style={{
              padding: "9px 18px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: page === "apply" ? "#3E3263" : "#5B4B8A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            신입 지원
          </button>
        </div>
      </header>

      {/* ===================== 0. 새벽소리 RULE 화면 ===================== */}
      {page === "rule" && (
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "56px 36px 110px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#6D5B9E",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            ← 홈으로 돌아가기
          </button>

          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              backgroundColor: "#EAE4F7",
              color: "#5B4B8A",
              borderRadius: "999px",
              marginBottom: "14px",
            }}
          >
            2026 DAYBREAK SOUND RULE
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: 900,
              lineHeight: 1.2,
              color: "#1E1B2E",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            &lt;2026년 새벽소리 RULE&gt;
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#5E5678",
              margin: "0 0 40px",
            }}
          >
            즐겁고 건강한 동방 생활을 위해 새벽소리 부원 모두가 함께 지키는 약속입니다.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: "28px",
              alignItems: "start",
            }}
          >
            {/* 왼쪽: 7가지 규칙 카드 리스트 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {CLUB_RULES.map((rule, idx) => (
                <div
                  key={rule.num}
                  className="magic-card"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "22px",
                    padding: "22px 26px",
                    border: rule.important
                      ? "2px solid #7C69B5"
                      : "1px solid #E6E1F2",
                    boxShadow: rule.important
                      ? "0 12px 28px rgba(91, 75, 138, 0.14)"
                      : "0 6px 18px rgba(75, 63, 114, 0.04)",
                    animation: `heroRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                      idx * 0.06
                    }s both`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "999px",
                        backgroundColor: "#5B4B8A",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {rule.num}
                    </span>

                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#221C38",
                        margin: 0,
                      }}
                    >
                      {rule.title}
                    </h2>

                    {rule.important && (
                      <span
                        style={{
                          padding: "3px 10px",
                          fontSize: "11px",
                          fontWeight: 800,
                          borderRadius: "999px",
                          backgroundColor: "#FFE8EC",
                          color: "#D6336C",
                          marginLeft: "auto",
                          flexShrink: 0,
                        }}
                      >
                        ★ 중요!!!
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      paddingLeft: "38px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#6D5B9E",
                      lineHeight: 1.5,
                    }}
                  >
                    - {rule.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* 오른쪽: 동방 화이트보드 원본 사진 */}
            <div
              style={{
                position: "sticky",
                top: "92px",
                backgroundColor: "#FFFFFF",
                borderRadius: "26px",
                padding: "20px",
                border: "1px solid #E6E1F2",
                boxShadow: "0 16px 36px rgba(75, 63, 114, 0.1)",
              }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #EFEBF7",
                  marginBottom: "14px",
                }}
              >
                <img
                  src={dbRulePhoto}
                  alt="2026년 새벽소리 RULE 화이트보드 사진"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 6px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#2B2347",
                    }}
                  >
                    동아리방 화이트보드 직찍
                  </div>
                  <div style={{ fontSize: "12px", color: "#8A81A6" }}>
                    2026년 새벽소리 공식 수칙
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "5px 10px",
                    borderRadius: "999px",
                    backgroundColor: "#F2EEFA",
                    color: "#5B4B8A",
                  }}
                >
                  필독
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 1. 신입 지원 화면 ===================== */}
      {page === "apply" && (
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            padding: "56px 32px 100px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#6D5B9E",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            ← 홈으로 돌아가기
          </button>

          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#6D5B9E",
              marginBottom: "12px",
            }}
          >
            JOIN THE NEXT CHAPTER
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: 900,
              lineHeight: 1.2,
              color: "#1E1B2E",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            당신의 관심사를
            <br />
            함께 펼쳐봐요.
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#5E5678",
              margin: "0 0 36px",
            }}
          >
            잘하는 것보다 좋아하는 마음을 기다립니다. 아래 내용을 편하게 작성해 주세요.
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "28px",
              padding: "40px",
              border: "1px solid #E6E1F2",
              boxShadow: "0 12px 32px rgba(75, 63, 114, 0.06)",
            }}
          >
            {applySubmitted ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    backgroundColor: "#EAE4F7",
                    color: "#5B4B8A",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  APPLICATION RECEIVED
                </div>
                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#221C38",
                    marginBottom: "10px",
                  }}
                >
                  {applyForm.name || "지원자"}님, 지원서가 접수되었습니다!
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#686082",
                    marginBottom: "28px",
                  }}
                >
                  입력하신 연락처({applyForm.phone || "미입력"})로 면접 및 오리엔테이션 안내를 드리겠습니다.
                </p>
                <button
                  type="button"
                  onClick={goHome}
                  className="magic-btn"
                  style={{
                    padding: "13px 26px",
                    fontSize: "14px",
                    fontWeight: 700,
                    backgroundColor: "#5B4B8A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                  }}
                >
                  메인 화면으로 돌아가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>이름</label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={applyForm.name}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, name: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>이메일</label>
                    <input
                      type="email"
                      required
                      placeholder="hello@example.com"
                      value={applyForm.email}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, email: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>연락처</label>
                    <input
                      type="tel"
                      required
                      placeholder="010-0000-0000"
                      value={applyForm.phone}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, phone: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>학과</label>
                    <input
                      type="text"
                      required
                      placeholder="인공지능공학전공"
                      value={applyForm.major}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, major: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ maxWidth: "350px", marginBottom: "20px" }}>
                  <label style={labelStyle}>학번</label>
                  <input
                    type="text"
                    required
                    placeholder="20270000"
                    value={applyForm.studentId}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, studentId: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>지원 동기</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="새벽소리와 함께하고 싶은 이유를 들려주세요."
                    value={applyForm.motivation}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, motivation: e.target.value })
                    }
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    className="magic-btn"
                    style={{
                      padding: "14px 28px",
                      fontSize: "15px",
                      fontWeight: 700,
                      backgroundColor: "#5B4B8A",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "999px",
                      cursor: "pointer",
                    }}
                  >
                    지원서 제출하기 →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================== 2. 회원 로그인 화면 ===================== */}
      {page === "login" && (
        <div
          style={{
            maxWidth: "460px",
            margin: "0 auto",
            padding: "72px 24px 120px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#6D5B9E",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            ← 홈으로 돌아가기
          </button>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "28px",
              padding: "40px 36px",
              border: "1px solid #E6E1F2",
              boxShadow: "0 12px 32px rgba(75, 63, 114, 0.08)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#6D5B9E",
                marginBottom: "8px",
              }}
            >
              MEMBER LOGIN
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "#221C38",
                margin: "0 0 8px",
              }}
            >
              새벽소리 회원 로그인
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#686082",
                margin: "0 0 28px",
              }}
            >
              공지사항, 회비, 일정 관리는 부원 로그인 후 이용할 수 있습니다.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>아이디</label>
                <input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              {loginMessage && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#F2EEFA",
                    color: "#4B3F72",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "18px",
                  }}
                >
                  {loginMessage}
                </div>
              )}

              <button
                type="submit"
                className="magic-btn"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  backgroundColor: "#5B4B8A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                로그인
              </button>
            </form>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid #EFEBF7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
                color: "#756D91",
              }}
            >
              <span>아직 새벽소리 회원이 아니신가요?</span>
              <button
                type="button"
                onClick={openApply}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#5B4B8A",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                신입 지원하기 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 3. 메인 홈 화면 ===================== */}
      {page === "home" && (
        <>
          {/* 오른쪽 고정 스크롤 내비게이션 */}
          <aside
            aria-label="섹션 이동"
            style={{
              position: "fixed",
              right: "28px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              padding: "18px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid #E4DFF0",
              boxShadow: "0 8px 24px rgba(75, 63, 114, 0.08)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "10px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 2px",
                    fontSize: isActive ? "15px" : "13px",
                    fontWeight: isActive ? 800 : 400,
                    color: isActive ? "#4B3F72" : "#968EB0",
                    transition: "all 0.25s ease",
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      width: isActive ? "10px" : "6px",
                      height: isActive ? "10px" : "6px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "#5B4B8A" : "#D3CCE6",
                      transition: "all 0.25s ease",
                    }}
                  />
                </button>
              );
            })}
          </aside>

          {/* 첫 화면 히어로 섹션 (기타·마이크 부상 + 3D 패럴랙스) */}
          <div
            id="top"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: "72px 96px 56px 48px",
              position: "relative",
            }}
          >
            {/* 은은한 라벤더 무대 조명 오라 */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "110px",
                width: "340px",
                height: "340px",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, rgba(167,148,242,0.34) 0%, rgba(246,244,250,0) 70%)",
                pointerEvents: "none",
                animation: "pulseGlow 5s ease-in-out infinite",
              }}
            />

            {/* 오른쪽 상단: 아래에서 솟아오르는 기타 */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "44px",
                right: "120px",
                zIndex: 10,
                pointerEvents: "none",
                transform: `translate(${mouseOffset.x * -1.1}px, ${
                  mouseOffset.y * -1.1
                }px)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <div
                style={{
                  animation:
                    "gearLaunchRight 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both, floatGuitar 4.4s ease-in-out 1.25s infinite",
                  background: "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #DFD7F2",
                  borderRadius: "28px",
                  padding: "18px 22px",
                  boxShadow: "0 18px 36px rgba(75, 63, 114, 0.14)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                  <path
                    d="M49 9L55 15M44 14L50 20M36 22L48 10L54 16L42 28"
                    stroke="#5B4B8A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 24C23 23 18 26 16 31C14 35 10 37 8 42C6 48 11 56 19 57C26 58 31 53 33 49C36 45 41 44 43 39C45 34 42 29 37 27L28 24Z"
                    fill="#B9A9E8"
                    stroke="#4B3F72"
                    strokeWidth="3"
                  />
                  <circle cx="24" cy="41" r="4.5" fill="#4B3F72" />
                  <path
                    d="M16 48L21 53"
                    stroke="#4B3F72"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#6D5B9E",
                      letterSpacing: "0.06em",
                    }}
                  >
                    LIVE SOUND
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#221C38",
                    }}
                  >
                    BAND & SESSION
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 중단: 아래에서 솟아오르는 무대 마이크 + 이퀄라이저 */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "178px",
                right: "225px",
                zIndex: 12,
                pointerEvents: "none",
                transform: `translate(${mouseOffset.x * 1.2}px, ${
                  mouseOffset.y * 1.2
                }px)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <div
                style={{
                  animation:
                    "gearLaunchLeft 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.32s both, floatMic 4.8s ease-in-out 1.45s infinite",
                  background: "linear-gradient(135deg, #5B4B8A 0%, #7C69B5 100%)",
                  color: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "16px 20px",
                  boxShadow: "0 18px 36px rgba(91, 75, 138, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg width="42" height="42" viewBox="0 0 64 64" fill="none">
                  <rect
                    x="24"
                    y="10"
                    width="16"
                    height="26"
                    rx="8"
                    fill="#EAE4FA"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M17 28C17 36.2843 23.7157 43 32 43C40.2843 43 47 36.2843 47 28"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 43V54M23 54H41"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      marginBottom: "6px",
                    }}
                  >
                    VOCAL ON STAGE
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "4px",
                      height: "14px",
                    }}
                  >
                    {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
                      <span
                        key={i}
                        style={{
                          width: "4px",
                          height: "12px",
                          borderRadius: "999px",
                          backgroundColor: "#EAE4FA",
                          animation: `soundWave 0.9s ease-in-out ${delay}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                backgroundColor: "#EAE4F7",
                color: "#5B4B8A",
                borderRadius: "999px",
                animation: "heroRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
              }}
            >
              2027 NEW MEMBER RECRUITING
            </span>

            <h1
              style={{
                fontSize: "52px",
                lineHeight: 1.2,
                fontWeight: 900,
                margin: "20px 0 20px",
                letterSpacing: "-0.02em",
                color: "#221C38",
                position: "relative",
                zIndex: 5,
                animation: "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both",
              }}
            >
              새벽소리에 오신걸 환영합니다.
            </h1>

            <p
              style={{
                fontSize: "19px",
                color: "#5E5678",
                marginBottom: "32px",
                animation: "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.26s both",
              }}
            >
              좋아하는 마음이 활동이 되는 곳
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "48px",
                animation: "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both",
              }}
            >
              <button
                type="button"
                onClick={openApply}
                className="magic-btn"
                style={{
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  backgroundColor: "#5B4B8A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                우리와 함께하기 →
              </button>
              <button
                type="button"
                onClick={openRule}
                className="magic-btn"
                style={{
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  color: "#4B3F72",
                  border: "1px solid #D8D0EB",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                동아리 RULE 보기
              </button>
            </div>

            <div
              style={{
                width: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid #E4DFF0",
                boxShadow: "0 16px 38px rgba(75, 63, 114, 0.12)",
                animation: "heroRise 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
                transform: `perspective(1000px) rotateY(${
                  mouseOffset.x * 0.12
                }deg) rotateX(${mouseOffset.y * -0.12}deg)`,
                transition: "transform 0.25s ease-out",
              }}
            >
              <img
                src={clubPhoto}
                alt="새벽소리 대표 사진"
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* 본문 스크롤 섹션들 */}
          <main
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: "24px 96px 80px 48px",
              display: "flex",
              flexDirection: "column",
              gap: "72px",
            }}
          >
            {/* 1. 소개 섹션 */}
            <RevealSection id="intro">
              <div
                className="magic-card"
                style={{
                  background: "linear-gradient(135deg, #4B3F72 0%, #6D5B9E 100%)",
                  color: "#FFFFFF",
                  borderRadius: "28px",
                  padding: "56px 48px",
                  boxShadow: "0 16px 36px rgba(75, 63, 114, 0.18)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#DCD4F5",
                    marginBottom: "14px",
                  }}
                >
                  ABOUT US
                </p>
                <h2
                  style={{
                    fontSize: "38px",
                    fontWeight: 800,
                    lineHeight: 1.3,
                    marginBottom: "16px",
                    color: "#FFFFFF",
                  }}
                >
                  대찬혁이 지배한다.
                  <br />
                  말대꾸 말대꾸 말대꾸!!
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#EAE4FA",
                    marginBottom: "40px",
                    lineHeight: 1.6,
                  }}
                >
                  IT융합대학의 매력덩어리들이 모인 동아리 입니다
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    paddingTop: "28px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "32px", fontWeight: 900 }}>12+</div>
                    <div style={{ fontSize: "13px", color: "#DCD4F5", marginTop: "4px" }}>
                      이번 학기 프로젝트
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "32px", fontWeight: 900 }}>45</div>
                    <div style={{ fontSize: "13px", color: "#DCD4F5", marginTop: "4px" }}>
                      함께하는 멤버
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "32px", fontWeight: 900 }}>매주 목요일</div>
                    <div style={{ fontSize: "13px", color: "#DCD4F5", marginTop: "4px" }}>
                      동아리 정기모임
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* 2. 소식 섹션 */}
            <RevealSection id="news">
              <div
                className="magic-card"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "28px",
                  padding: "48px",
                  border: "1px solid #E6E1F2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "32px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#6D5B9E",
                      }}
                    >
                      NOTICE
                    </span>
                    <h2
                      style={{
                        fontSize: "32px",
                        fontWeight: 800,
                        marginTop: "6px",
                        color: "#221C38",
                      }}
                    >
                      요즘 새벽소리에서는
                    </h2>
                  </div>
                  <span style={{ fontSize: "13px", color: "#8A81A6" }}>
                    모든 공지는 회원 공간에서 확인
                  </span>
                </div>

                {[
                  {
                    num: "01",
                    title: "2027 신입 회원 모집",
                    desc: "새벽소리와 함께할 신입 회원을 기다립니다.",
                    date: "3월 10일 ( )",
                  },
                  {
                    num: "02",
                    title: "18번째 정기공연 찬란",
                    desc: "새벽소리 19번째 정기공연 찬란을 보헤미안 극장에서 잘 마쳤습니다",
                    date: "11월 7일 (토)",
                  },
                  {
                    num: "03",
                    title: "새벽소리 겨울 야유회",
                    desc: "새벽소리에서 가는 2026 마지막 야유회 즐길준비 되셨나요~??",
                    date: "12월 28~29일 (월,화)",
                  },
                ].map((item, idx) => (
                  <div
                    key={item.num}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "22px 0",
                      borderTop: "1px solid #EFEBF7",
                      borderBottom: idx === 2 ? "1px solid #EFEBF7" : "none",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "flex-start",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "#6D5B9E",
                          paddingTop: "3px",
                          flexShrink: 0,
                        }}
                      >
                        {item.num}
                      </span>
                      <div style={{ width: "100%", textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#221C38",
                            marginBottom: "6px",
                            textAlign: "left",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#686082",
                            lineHeight: 1.5,
                            textAlign: "left",
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#8A81A6",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* 3. 일정 섹션 */}
            <RevealSection id="schedule">
              <div
                style={{
                  backgroundColor: "#EFEBF8",
                  borderRadius: "28px",
                  padding: "48px",
                  border: "1px solid #E0D8F0",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#6D5B9E",
                  }}
                >
                  SCHEDULE
                </span>
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    margin: "6px 0 28px",
                    color: "#221C38",
                  }}
                >
                  주요일정
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "18px",
                  }}
                >
                  {[
                    {
                      date: "11월 7일",
                      title: "18번째 정기공연",
                      place: "보헤미안 극장",
                    },
                    {
                      date: "11월 20일",
                      title: "flexible과 함께한 공연",
                      place: "동명동 sound",
                    },
                    {
                      date: "12월 28~29일",
                      title: "겨울 야유회",
                      place: "순천?",
                    },
                  ].map((sched) => (
                    <div
                      key={sched.title}
                      className="magic-card"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "20px",
                        padding: "24px",
                        border: "1px solid #E4DFF0",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#5B4B8A",
                          backgroundColor: "#F2EEFA",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          marginBottom: "12px",
                        }}
                      >
                        {sched.date}
                      </span>
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "#221C38",
                          marginBottom: "8px",
                        }}
                      >
                        {sched.title}
                      </div>
                      <p style={{ fontSize: "13px", color: "#756D91", margin: 0 }}>
                        {sched.place}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* 4. 사진 섹션 + 인스타그램 링크 연결 */}
            <RevealSection id="gallery">
              <div
                className="magic-card"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "28px",
                  padding: "48px",
                  border: "1px solid #E6E1F2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "28px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#6D5B9E",
                      }}
                    >
                      OUR MOMENTS
                    </span>
                    <h2
                      style={{
                        fontSize: "32px",
                        fontWeight: 800,
                        marginTop: "6px",
                        color: "#221C38",
                      }}
                    >
                      우리가 함께한 순간
                    </h2>
                  </div>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#5B4B8A",
                      textDecoration: "none",
                    }}
                  >
                    <InstagramIcon size={15} />
                    <span>@daybreak_sound에서 더 보기 ↗</span>
                  </a>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div style={{ borderRadius: "20px", overflow: "hidden" }}>
                    <img
                      src={clubPhoto}
                      alt="함께한 순간 1"
                      style={{
                        width: "100%",
                        height: "340px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      borderRadius: "20px",
                      background:
                        "linear-gradient(160deg, #DCD4F5 0%, #B8A9E3 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "28px",
                      color: "#2B2347",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        alignSelf: "flex-start",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      <InstagramIcon size={15} />
                      <span>@daybreak_sound</span>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        2026 ARCHIVE
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 800,
                          lineHeight: 1.4,
                          marginBottom: "12px",
                        }}
                      >
                        연습실의 밤부터
                        <br />
                        무대 위의 순간까지
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#4B3F72",
                        }}
                      >
                        공식 인스타그램 바로가기 →
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </RevealSection>
          </main>

          {/* 하단 푸터 */}
          <footer
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: "28px 96px 56px 48px",
              borderTop: "1px solid #E4DFF0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              color: "#756D91",
            }}
          >
            <div>
              <strong style={{ color: "#2B2347" }}>새벽소리.</strong> — IT융합대학 동아리
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#5B4B8A",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <InstagramIcon size={15} />
              <span>instagram.com/daybreak_sound</span>
            </a>
          </footer>
        </>
      )}
    </div>
  );
}
