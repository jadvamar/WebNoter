import footerCss from "./footer.module.css";

import Gstore from "../../images/image.png";
import Appstore from "../../images/image.png";
import indianFlag from "../../images/image.png";

import Facebook from "../../images/image.png";
import Twitter from "../../images/image.png";
import Instagram from "../../images/image.png";
import Linkedin from "../../images/image.png";
import Youtube from "../../images/image.png";

let Footer = () => {
  return (
    <div className={footerCss.footer}>
      <div className={footerCss.innerFooter}>
        <div className={footerCss.sec1}>
          <div className={footerCss.logoBox}>WebNoter</div>
          <div className={footerCss.filters}>
            <div className={footerCss.filterBox}>
              {" "}
              <span>
                <img
                  className={footerCss.icon}
                  src={indianFlag}
                  alt="india flag"
                />
              </span>
              <span>India</span>
              <span className={footerCss.arrow}>&#709;</span>
            </div>
            <div className={footerCss.filterBox}>
              <span>
                🌐<span></span> English
              </span>{" "}
              <span className={footerCss.arrow}>&#709;</span>
            </div>
          </div>
        </div>
        <div className={footerCss.sec2}>
          <div className={[footerCss.box1, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>ABOUT WebNoter</div>
            <a href="" className={footerCss.boxOpt}>
              Who We Are
            </a>
            <a href="" className={footerCss.boxOpt}>
              Blog
            </a>
            <a href="" className={footerCss.boxOpt}>
              Work With Us
            </a>
            <a href="" className={footerCss.boxOpt}>
              Investor Relations
            </a>
            <a href="" className={footerCss.boxOpt}>
              Report Fraud
            </a>
          </div>
          <div className={[footerCss.box2, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>WebNoter</div>
            <a href="" className={footerCss.boxOpt}>
              WebNoter
            </a>
            <a href="" className={footerCss.boxOpt}>
              Feeding India
            </a>
            <a href="" className={footerCss.boxOpt}>
              Hyperpure
            </a>
            <a href="" className={footerCss.boxOpt}>
              Tomaland
            </a>
          </div>
          <div className={[footerCss.box3, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>FOR YOU</div>
            <a href="" className={footerCss.boxOpt}>
              Partner With Us
            </a>

            <div className={footerCss.boxTtl}>FOR ENTERPRISES</div>
            <a href="" className={footerCss.boxOpt}>
              WebNoter For Work
            </a>
          </div>
          <div className={[footerCss.box4, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>LEARN MORE</div>
            <a href="" className={footerCss.boxOpt}>
              Privacy
            </a>
            <a href="" className={footerCss.boxOpt}>
              Security
            </a>
            <a href="" className={footerCss.boxOpt}>
              Terms
            </a>
            <a href="" className={footerCss.boxOpt}>
              Sitemap
            </a>
          </div>
          <div className={[footerCss.box5, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>SOCIAL LINKS</div>
            <div className={footerCss.socialImgs}>
              <a href="" className={footerCss.socialImgAnchore}>
                <img
                  className={footerCss.socialImg}
                  src={Facebook}
                  alt="linkedin"
                />
              </a>
              <a href="" className={footerCss.socialImgAnchore}>
                <img
                  className={footerCss.socialImg}
                  src={Linkedin}
                  alt="instagram"
                />
              </a>
              <a href="" className={footerCss.socialImgAnchore}>
                <img
                  className={footerCss.socialImg}
                  src={Instagram}
                  alt="facebook"
                />
              </a>
              <a href="" className={footerCss.socialImgAnchore}>
                <img
                  className={footerCss.socialImg}
                  src={Twitter}
                  alt="twitter"
                />
              </a>
              <a href="" className={footerCss.socialImgAnchore}>
                <img
                  className={footerCss.socialImg}
                  src={Youtube}
                  alt="youtube"
                />
              </a>
            </div>
            <a href="" className={footerCss.app}>
              <img
                className={footerCss.appImg}
                src={Gstore}
                alt="google play store"
              />
            </a>
            <a href="" className={footerCss.app}>
              <img
                className={footerCss.appImg}
                src={Appstore}
                alt="apple app store"
              />
            </a>
          </div>
        </div>
        <hr className={footerCss.breakLine} />
        <div className={footerCss.sec3}>
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies. All trademarks are
          properties of their respective owners. 2024 © WebNoter Ltd. All rights
          reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
