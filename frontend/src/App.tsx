import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import clubPhoto from "./assets/db-cp.jpg";

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
      { threshold: 0.1 }
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
          : "translateY(36px) scale(0.97) rotateX(3deg)",
        transition:
          "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
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
  fontSize: "15px",
  color: "#1E241B",
  backgroundColor: "#F9FAF7",
  border: "1px solid #D5DDD0",
  borderRadius: "14px",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  color: "#2B3525",
  marginBottom: "8px",
};

export default function App() {
  const [page, setPage] = useState<PageView>("home");
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  // 화면 크기 변화 감지 (모바일/데스크톱 자동 전환)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (isMobile) return;
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
        backgroundColor: "#F4F5F0",
        color: "#1E241B",
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
            transform: translateY(36px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gearLaunchLeft {
          0% {
            opacity: 0;
            transform: translateY(120px) rotate(-24deg) scale(0.75);
          }
          65% {
            opacity: 1;
            transform: translateY(-10px) rotate(-8deg) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(-10deg) scale(1);
          }
        }

        @keyframes gearLaunchRight {
          0% {
            opacity: 0;
            transform: translateY(140px) rotate(24deg) scale(0.75);
          }
          65% {
            opacity: 1;
            transform: translateY(-12px) rotate(8deg) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(10deg) scale(1);
          }
        }

        @keyframes floatGuitar {
          0%, 100% {
            transform: translateY(0px) rotate(-10deg);
          }
          50% {
            transform: translateY(-14px) rotate(-5deg);
          }
        }

        @keyframes floatMic {
          0%, 100% {
            transform: translateY(0px) rotate(10deg);
          }
          50% {
            transform: translateY(-16px) rotate(15deg);
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
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 40px rgba(59, 71, 51, 0.13);
        }

        .magic-btn {
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, background-color 0.25s ease;
        }
        .magic-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 22px rgba(75, 88, 66, 0.24);
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
            background: "linear-gradient(90deg, #7E916F 0%, #4B5842 100%)",
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
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: isMobile ? "14px 18px" : "18px 48px",
          backgroundColor: "rgba(244, 245, 240, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #DCE2D6",
        }}
      >
        <button
          type="button"
          onClick={goHome}
          style={{
            fontWeight: 900,
            fontSize: isMobile ? "19px" : "21px",
            color: "#263020",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          새벽소리.
        </button>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? "6px" : "10px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={openRule}
            className="magic-btn"
            style={{
              padding: isMobile ? "7px 11px" : "8px 14px",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 700,
              color: page === "rule" ? "#FFFFFF" : "#4B5842",
              backgroundColor: page === "rule" ? "#4B5842" : "#E2E7DC",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            {isMobile ? "RULE" : "새벽소리 RULE"}
          </button>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="새벽소리 인스타그램"
            className="magic-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: isMobile ? "7px 10px" : "8px 14px",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 600,
              color: "#4B5842",
              backgroundColor: "#FFFFFF",
              border: "1px solid #D3DBD0",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            <InstagramIcon size={15} />
            {!isMobile && <span>Instagram</span>}
          </a>

          <button
            type="button"
            onClick={openLogin}
            className="magic-btn"
            style={{
              padding: isMobile ? "7px 10px" : "8px 14px",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: page === "login" ? 700 : 500,
              color: page === "login" ? "#263020" : "#46523E",
              background: page === "login" ? "#E2E7DC" : "transparent",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            {isMobile ? "로그인" : "회원 로그인"}
          </button>

          <button
            type="button"
            onClick={openApply}
            className="magic-btn"
            style={{
              padding: isMobile ? "7px 13px" : "9px 18px",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 600,
              backgroundColor: page === "apply" ? "#343F2E" : "#4B5842",
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
            maxWidth: "820px",
            margin: "0 auto",
            padding: isMobile ? "32px 20px 80px" : "56px 36px 110px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#55644B",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
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
              backgroundColor: "#E2E7DC",
              color: "#4B5842",
              borderRadius: "999px",
              marginBottom: "12px",
            }}
          >
            2026 DAYBREAK SOUND RULE
          </div>

          <h1
            style={{
              fontSize: isMobile ? "28px" : "44px",
              fontWeight: 900,
              lineHeight: 1.25,
              color: "#1E241B",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            &lt;2026년 새벽소리 RULE&gt;
          </h1>

          <p
            style={{
              fontSize: isMobile ? "14px" : "15px",
              color: "#586352",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            즐겁고 건강한 동방 생활을 위해 새벽소리 부원 모두가 함께 지키는 약속입니다.
          </p>

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
                  borderRadius: "20px",
                  padding: isMobile ? "18px 20px" : "24px 28px",
                  border: rule.important
                    ? "2px solid #5A6B4F"
                    : "1px solid #DCE2D6",
                  boxShadow: rule.important
                    ? "0 12px 28px rgba(75, 88, 66, 0.14)"
                    : "0 6px 18px rgba(59, 71, 51, 0.04)",
                  animation: `heroRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.06
                  }s both`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
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
                      backgroundColor: "#4B5842",
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
                      fontSize: isMobile ? "16px" : "19px",
                      fontWeight: 800,
                      color: "#1E241B",
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {rule.title}
                  </h2>

                  {rule.important && (
                    <span
                      style={{
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 800,
                        borderRadius: "999px",
                        backgroundColor: "#FDECEC",
                        color: "#C92A2A",
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
                    paddingLeft: "40px",
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: 600,
                    color: "#55644B",
                    lineHeight: 1.5,
                  }}
                >
                  - {rule.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== 1. 신입 지원 화면 ===================== */}
      {page === "apply" && (
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            padding: isMobile ? "32px 20px 80px" : "56px 32px 100px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#55644B",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
            }}
          >
            ← 홈으로 돌아가기
          </button>

          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#55644B",
              marginBottom: "10px",
            }}
          >
            JOIN THE NEXT CHAPTER
          </div>

          <h1
            style={{
              fontSize: isMobile ? "32px" : "44px",
              fontWeight: 900,
              lineHeight: 1.22,
              color: "#1E241B",
              margin: "0 0 14px",
              letterSpacing: "-0.02em",
            }}
          >
            당신의 관심사를
            <br />
            함께 펼쳐봐요.
          </h1>

          <p
            style={{
              fontSize: isMobile ? "14px" : "15px",
              color: "#586352",
              margin: "0 0 28px",
              lineHeight: 1.6,
            }}
          >
            잘하는 것보다 좋아하는 마음을 기다립니다. 아래 내용을 편하게 작성해 주세요.
          </p>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: isMobile ? "22px" : "28px",
              padding: isMobile ? "24px 20px" : "40px",
              border: "1px solid #DCE2D6",
              boxShadow: "0 12px 32px rgba(59, 71, 51, 0.06)",
            }}
          >
            {applySubmitted ? (
              <div style={{ textAlign: "center", padding: "24px 12px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    backgroundColor: "#E2E7DC",
                    color: "#4B5842",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  APPLICATION RECEIVED
                </div>
                <h2
                  style={{
                    fontSize: isMobile ? "22px" : "26px",
                    fontWeight: 800,
                    color: "#1E241B",
                    marginBottom: "10px",
                  }}
                >
                  {applyForm.name || "지원자"}님, 지원서가 접수되었습니다!
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#606B5A",
                    marginBottom: "28px",
                    lineHeight: 1.6,
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
                    backgroundColor: "#4B5842",
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
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "18px",
                    marginBottom: "18px",
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
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "18px",
                    marginBottom: "18px",
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

                <div
                  style={{
                    maxWidth: isMobile ? "100%" : "350px",
                    marginBottom: "18px",
                  }}
                >
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

                <div style={{ marginBottom: "24px" }}>
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
                      width: isMobile ? "100%" : "auto",
                      padding: "14px 28px",
                      fontSize: "15px",
                      fontWeight: 700,
                      backgroundColor: "#4B5842",
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
            padding: isMobile ? "36px 20px 90px" : "72px 24px 120px",
            animation: "heroRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <button
            type="button"
            onClick={goHome}
            style={{
              background: "transparent",
              border: "none",
              color: "#55644B",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
            }}
          >
            ← 홈으로 돌아가기
          </button>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: isMobile ? "22px" : "28px",
              padding: isMobile ? "28px 22px" : "40px 36px",
              border: "1px solid #DCE2D6",
              boxShadow: "0 12px 32px rgba(59, 71, 51, 0.08)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#55644B",
                marginBottom: "8px",
              }}
            >
              MEMBER LOGIN
            </div>
            <h1
              style={{
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: 900,
                color: "#1E241B",
                margin: "0 0 8px",
              }}
            >
              새벽소리 회원 로그인
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#606B5A",
                margin: "0 0 24px",
                lineHeight: 1.5,
              }}
            >
              공지사항, 회비, 일정 관리는 부원 로그인 후 이용할 수 있습니다.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "16px" }}>
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

              <div style={{ marginBottom: "22px" }}>
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
                    backgroundColor: "#EBF0E6",
                    color: "#3B4733",
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
                  backgroundColor: "#4B5842",
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
                marginTop: "22px",
                paddingTop: "18px",
                borderTop: "1px solid #E9EDE4",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
                color: "#6C7766",
              }}
            >
              <span>아직 회원이 아니신가요?</span>
              <button
                type="button"
                onClick={openApply}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4B5842",
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
          {/* 오른쪽 고정 스크롤 내비게이션 (데스크톱 전용) */}
          {!isMobile && (
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
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: "1px solid #DCE2D6",
                boxShadow: "0 8px 24px rgba(59, 71, 51, 0.08)",
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
                      color: isActive ? "#3B4733" : "#8A9683",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <span>{item.label}</span>
                    <span
                      style={{
                        width: isActive ? "10px" : "6px",
                        height: isActive ? "10px" : "6px",
                        borderRadius: "999px",
                        backgroundColor: isActive ? "#4B5842" : "#C6D0BE",
                        transition: "all 0.25s ease",
                      }}
                    />
                  </button>
                );
              })}
            </aside>
          )}

          {/* 첫 화면 히어로 섹션 */}
          <div
            id="top"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: isMobile ? "36px 20px 36px" : "72px 96px 56px 48px",
              position: "relative",
            }}
          >
            {/* 은은한 카키 무대 조명 오라 */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? "10px" : "20px",
                right: isMobile ? "-40px" : "110px",
                width: isMobile ? "220px" : "340px",
                height: isMobile ? "220px" : "340px",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, rgba(132,153,115,0.28) 0%, rgba(244,245,240,0) 70%)",
                pointerEvents: "none",
                animation: "pulseGlow 5s ease-in-out infinite",
              }}
            />

            {/* 데스크톱: 오른쪽 상단 떠다니는 기타 배지 */}
            {!isMobile && (
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
                    background: "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid #D3DBD0",
                    borderRadius: "28px",
                    padding: "18px 22px",
                    boxShadow: "0 18px 36px rgba(59, 71, 51, 0.14)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M49 9L55 15M44 14L50 20M36 22L48 10L54 16L42 28"
                      stroke="#4B5842"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 24C23 23 18 26 16 31C14 35 10 37 8 42C6 48 11 56 19 57C26 58 31 53 33 49C36 45 41 44 43 39C45 34 42 29 37 27L28 24Z"
                      fill="#B7C6AA"
                      stroke="#3B4733"
                      strokeWidth="3"
                    />
                    <circle cx="24" cy="41" r="4.5" fill="#3B4733" />
                    <path
                      d="M16 48L21 53"
                      stroke="#3B4733"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#55644B",
                        letterSpacing: "0.06em",
                      }}
                    >
                      LIVE SOUND
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#1E241B",
                      }}
                    >
                      BAND & SESSION
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 데스크톱: 오른쪽 중단 떠다니는 무대 마이크 배지 */}
            {!isMobile && (
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
                    background:
                      "linear-gradient(135deg, #4B5842 0%, #687B5B 100%)",
                    color: "#FFFFFF",
                    borderRadius: "24px",
                    padding: "16px 20px",
                    boxShadow: "0 18px 36px rgba(75, 88, 66, 0.25)",
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
                      fill="#E4EBDD"
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
                            backgroundColor: "#E4EBDD",
                            animation: `soundWave 0.9s ease-in-out ${delay}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                backgroundColor: "#E2E7DC",
                color: "#4B5842",
                borderRadius: "999px",
                animation:
                  "heroRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
              }}
            >
              2027 NEW MEMBER RECRUITING
            </span>

            <h1
              style={{
                fontSize: isMobile ? "34px" : "52px",
                lineHeight: 1.22,
                fontWeight: 900,
                margin: "18px 0 16px",
                letterSpacing: "-0.02em",
                color: "#1E241B",
                position: "relative",
                zIndex: 5,
                wordBreak: "keep-all",
                animation:
                  "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both",
              }}
            >
              새벽소리에 오신걸 환영합니다.
            </h1>

            <p
              style={{
                fontSize: isMobile ? "16px" : "19px",
                color: "#586352",
                marginBottom: "28px",
                animation:
                  "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.26s both",
              }}
            >
              좋아하는 마음이 활동이 되는 곳
            </p>

            {/* 모바일 전용: 밴드/보컬 콤팩트 배지 바 */}
            {isMobile && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "24px",
                  animation:
                    "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #D3DBD0",
                    borderRadius: "16px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>🎸</span>
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "#55644B",
                      }}
                    >
                      LIVE SOUND
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        color: "#1E241B",
                      }}
                    >
                      BAND & SESSION
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background:
                      "linear-gradient(135deg, #4B5842 0%, #687B5B 100%)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>🎤</span>
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "#E4EBDD",
                      }}
                    >
                      ON STAGE
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 800 }}>
                      VOCAL LIVE
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: isMobile ? "32px" : "48px",
                animation:
                  "heroRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both",
              }}
            >
              <button
                type="button"
                onClick={openApply}
                className="magic-btn"
                style={{
                  flex: isMobile ? "1 1 auto" : "none",
                  padding: isMobile ? "13px 20px" : "14px 24px",
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: 600,
                  backgroundColor: "#4B5842",
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
                  flex: isMobile ? "1 1 auto" : "none",
                  padding: isMobile ? "13px 20px" : "14px 24px",
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  color: "#3B4733",
                  border: "1px solid #CDD6C7",
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
                borderRadius: isMobile ? "20px" : "24px",
                overflow: "hidden",
                border: "1px solid #DCE2D6",
                boxShadow: "0 16px 38px rgba(59, 71, 51, 0.12)",
                animation:
                  "heroRise 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
                transform: isMobile
                  ? "none"
                  : `perspective(1000px) rotateY(${
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
                  height: isMobile ? "240px" : "420px",
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
              padding: isMobile ? "12px 20px 64px" : "24px 96px 80px 48px",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "36px" : "72px",
            }}
          >
            {/* 1. 소개 섹션 */}
            <RevealSection id="intro">
              <div
                className="magic-card"
                style={{
                  background: "linear-gradient(135deg, #3B4733 0%, #5A6B4F 100%)",
                  color: "#FFFFFF",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "32px 24px" : "56px 48px",
                  boxShadow: "0 16px 36px rgba(59, 71, 51, 0.18)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#D5DEC9",
                    marginBottom: "12px",
                  }}
                >
                  ABOUT US
                </p>
                <h2
                  style={{
                    fontSize: isMobile ? "26px" : "38px",
                    fontWeight: 800,
                    lineHeight: 1.32,
                    marginBottom: "14px",
                    color: "#FFFFFF",
                    wordBreak: "keep-all",
                  }}
                >
                  대찬혁이 지배한다.
                  <br />
                  말대꾸 말대꾸 말대꾸!!
                </h2>
                <p
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    color: "#E4EBDD",
                    marginBottom: "10px",
                    lineHeight: 1.6,
                  }}
                >
                  IT융합대학의 음악을 사랑하는 사람들이 모인 동아리 입니다
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#D5DEC9",
                    marginBottom: isMobile ? "26px" : "36px",
                    lineHeight: 1.5,
                  }}
                >
                  동방 위치 · IT융합대학 4층 4208호
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: isMobile ? "18px" : "24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    paddingTop: "24px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: isMobile ? "26px" : "32px",
                        fontWeight: 900,
                      }}
                    >
                      12+
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#D5DEC9",
                        marginTop: "4px",
                      }}
                    >
                      이번 학기 프로젝트
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: isMobile ? "26px" : "32px",
                        fontWeight: 900,
                      }}
                    >
                      45
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#D5DEC9",
                        marginTop: "4px",
                      }}
                    >
                      함께하는 멤버
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: isMobile ? "26px" : "32px",
                        fontWeight: 900,
                      }}
                    >
                      매주 목요일
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#D5DEC9",
                        marginTop: "4px",
                      }}
                    >
                      동아리 정기모임
                    </div>
                  </div>
                </div>

                {/* 동아리 문의 안내 (작은 글씨) */}
                <div
                  style={{
                    marginTop: "28px",
                    paddingTop: "18px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.14)",
                    fontSize: "12px",
                    color: "#D5DEC9",
                    lineHeight: 1.7,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: isMobile ? "6px 14px" : "6px 20px",
                      marginBottom: "4px",
                    }}
                  >
                    <span>
                      <strong style={{ color: "#FFFFFF" }}>문의</strong> · 회장
                      정찬혁 010-3328-7002
                    </span>
                    <span>부회장 오창효 010-7200-5074</span>
                    <span>총무 김나연 010-7610-5351</span>
                  </div>
                  <div style={{ fontSize: "11.5px", opacity: 0.9 }}>
                    궁금한 점이나 가입 문의는 언제든 편하게 연락 주세요!
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
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "28px 22px" : "48px",
                  border: "1px solid #DCE2D6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    gap: "6px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#55644B",
                      }}
                    >
                      NOTICE
                    </span>
                    <h2
                      style={{
                        fontSize: isMobile ? "24px" : "32px",
                        fontWeight: 800,
                        marginTop: "6px",
                        color: "#1E241B",
                      }}
                    >
                      요즘 새벽소리에서는
                    </h2>
                  </div>
                  <span style={{ fontSize: "12px", color: "#808C79" }}>
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
                    desc: "새벽소리 18번째 정기공연 찬란을 보헤미안 극장에서 잘 마쳤습니다",
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
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "flex-start" : "center",
                      padding: "20px 0",
                      borderTop: "1px solid #E9EDE4",
                      borderBottom: idx === 2 ? "1px solid #E9EDE4" : "none",
                      gap: isMobile ? "10px" : "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: isMobile ? "12px" : "20px",
                        alignItems: "flex-start",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "#55644B",
                          paddingTop: "2px",
                          flexShrink: 0,
                        }}
                      >
                        {item.num}
                      </span>
                      <div style={{ width: "100%", textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: isMobile ? "16px" : "18px",
                            fontWeight: 700,
                            color: "#1E241B",
                            marginBottom: "6px",
                            textAlign: "left",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "13px" : "14px",
                            color: "#606B5A",
                            lineHeight: 1.5,
                            textAlign: "left",
                            wordBreak: "keep-all",
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#808C79",
                        whiteSpace: "nowrap",
                        paddingLeft: isMobile ? "28px" : "0",
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
                  backgroundColor: "#E8ECE2",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "28px 22px" : "48px",
                  border: "1px solid #D3DBD0",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#55644B",
                  }}
                >
                  SCHEDULE
                </span>
                <h2
                  style={{
                    fontSize: isMobile ? "24px" : "32px",
                    fontWeight: 800,
                    margin: "6px 0 22px",
                    color: "#1E241B",
                  }}
                >
                  주요일정
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: "14px",
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
                        borderRadius: "18px",
                        padding: "20px",
                        border: "1px solid #DCE2D6",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#4B5842",
                          backgroundColor: "#EBF0E6",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          marginBottom: "10px",
                        }}
                      >
                        {sched.date}
                      </span>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1E241B",
                          marginBottom: "6px",
                        }}
                      >
                        {sched.title}
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6C7766",
                          margin: 0,
                        }}
                      >
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
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "28px 22px" : "48px",
                  border: "1px solid #DCE2D6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    gap: "10px",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#55644B",
                      }}
                    >
                      OUR MOMENTS
                    </span>
                    <h2
                      style={{
                        fontSize: isMobile ? "24px" : "32px",
                        fontWeight: 800,
                        marginTop: "6px",
                        color: "#1E241B",
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
                      color: "#4B5842",
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
                    gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div style={{ borderRadius: "18px", overflow: "hidden" }}>
                    <img
                      src={clubPhoto}
                      alt="함께한 순간 1"
                      style={{
                        width: "100%",
                        height: isMobile ? "220px" : "340px",
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
                      borderRadius: "18px",
                      background:
                        "linear-gradient(160deg, #D3DEC8 0%, #A9BA9B 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "20px",
                      padding: "24px",
                      color: "#1E241B",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        alignSelf: "flex-start",
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                        padding: "7px 12px",
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
                          fontSize: "12px",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        2026 ARCHIVE
                      </div>
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: 800,
                          lineHeight: 1.4,
                          marginBottom: "10px",
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
                          color: "#3B4733",
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
              padding: isMobile ? "24px 20px 44px" : "28px 96px 56px 48px",
              borderTop: "1px solid #DCE2D6",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: "12px",
              fontSize: "13px",
              color: "#6C7766",
            }}
          >
            <div>
              <strong style={{ color: "#263020" }}>새벽소리.</strong> — IT융합대학
              동아리
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#4B5842",
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
