import Router from "../router/Router"
import { useEffect, useState } from "react";
import Footer from "./Footer";
import "../../css/main.css";

function Main() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    // 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 스크롤 위치에 따라 Footer 표시 여부 결정
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

    setShowFooter(scrollPercentage >= 90);
  }, [scrollPosition]);

	return (
		<main className="main-container">
      <div className="py-4">
        <div className="container">
          <Router></Router>
        </div>
      </div>

      {/* Footer 표시 여부에 따라 동적으로 렌더링 */}
      {showFooter && <Footer />}
    </main>
	);
}

export default Main;