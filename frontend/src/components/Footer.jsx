import { Link } from "react-router-dom";
import LightLogo from "../assets/imgs/Sergio_logo_white.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <div className="relative">
      {/* Wave */}
      <svg
        className="absolute bottom-full left-0 w-full h-16 sm:h-24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#59cb00"
          fillOpacity="1"
          d="M0,192L40,176C80,160,160,128,240,144C320,160,400,224,480,208C560,192,640,96,720,96C800,96,880,192,960,234.7C1040,277,1120,267,1200,234.7C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </svg>

      <footer className="relative font-roboto-regular text-white">
        <div className="bg-primary">
          {/* Centered container on md+ with some gap */}
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-12 flex flex-col md:flex-row md:justify-center md:items-start md:gap-16 gap-8">
            {/* Logo */}
            <div className="flex justify-center md:justify-start mb-6 md:mb-0">
              <img
                src={LightLogo}
                alt="Sergio Logo"
                className="h-32 sm:h-40 md:h-52"
              />
            </div>

            {/* Content grid: 2 columns on mobile, 4 on md+ */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Links */}
              <div>
                <h4 className="font-itim mb-3 animated-underline pb-1 relative">
                  {t("footer.links.links")}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/">{t("footer.links.home")}</Link>
                  </li>
                  <li>
                    <Link to="/about">{t("footer.links.about")}</Link>
                  </li>
                  <li>
                    <Link to="/products">{t("footer.links.products")}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{t("footer.links.contact")}</Link>
                  </li>
                  <li>
                    <Link to="/certificate">
                      {t("footer.links.certificate")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery">{t("footer.links.gallery")}</Link>
                  </li>
                  <li>
                    <Link to="/careers">{t("footer.links.careers")}</Link>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="font-itim mb-3 animated-underline pb-1 relative">
                  {t("footer.contactUs")}
                </h4>
                <p className="text-sm">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@sergio-ind.com" className="underline">
                    info@sergio-ind.com
                  </a>
                </p>
                <p className="text-sm mt-1">
                  <strong>Tel:</strong> +962 7 9120 1150
                </p>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-itim mb-3 animated-underline pb-1 relative">
                  {t("footer.support.support")}
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/faq">{t("footer.support.faq")}</Link>
                  </li>
                  <li>
                    <Link to="/privacy">
                      {t("footer.support.privacyPolicy")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h4 className="font-itim mb-3 animated-underline pb-1 relative">
                  {t("footer.followUs")}
                </h4>
                <div className="flex gap-2 items-center">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sergio.industries/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition text-white"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 mt-1"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.41-71-6.49-94.3-6.49s-73.32-1.92-94.3,6.49a54,54,0,0,0-30.41,30.41c-8.41,21-6.49,71-6.49,94.3s-1.92,73.32,6.49,94.3a54,54,0,0,0,30.41,30.41c21,8.41,71,6.49,94.3,6.49s73.32,1.92,94.3-6.49a54,54,0,0,0,30.41-30.41c8.41-21,6.49-71,6.49-94.3S357.12,182.66,348.71,161.66ZM224,338a82,82,0,1,1,82-82A82,82,0,0,1,224,338Zm85.33-148.8a19.2,19.2,0,1,1,19.2-19.2A19.19,19.19,0,0,1,309.33,189.2ZM398.8,80A94.69,94.69,0,0,0,368,49.2C346.6,38.07,316.6,32,224,32S101.4,38.07,80,49.2A94.69,94.69,0,0,0,49.2,80C38.07,101.4,32,131.4,32,224s6.07,122.6,17.2,144a94.69,94.69,0,0,0,30.8,30.8c21.4,11.13,51.4,17.2,144,17.2s122.6-6.07,144-17.2a94.69,94.69,0,0,0,30.8-30.8c11.13-21.4,17.2-51.4,17.2-144S409.93,101.4,398.8,80Z"
                      />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/sergio.ind/"
                    target="_blank"
                    aria-label="Facebook"
                    className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#"
                    target="_blank"
                    aria-label="LinkedIn"
                    className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-primary border-t border-white text-center py-3 text-xs sm:text-sm">
          Sergio-ind 2019 © All Rights Reserved | Project by :{" "}
          <a
            href="https://mafateehgroup.com"
            className="underline font-semibold"
          >
            Mafateeh Group
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
