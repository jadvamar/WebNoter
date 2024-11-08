import React from "react";
import "./Home.css";
import Header from "../../Components/header/header";
import Footer from "../../Components/Footer/footer";
import MainContent from "../../Components/MainSection/MainContent";

function HomePage() {
  return (
    <div className="homepage">
      {/* Header */}
      <div className="header">
        <Header />
      </div>
      {/* Main Content */}
      <MainContent />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
