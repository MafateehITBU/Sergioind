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
          {/* Footer content */}
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-12 flex flex-col md:flex-row md:flex-wrap gap-8 md:gap-16">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left -mt-5 w-full md:w-auto">
              <img
                src={LightLogo}
                alt="Sergio Logo"
                className="h-32 sm:h-40 md:h-52"
              />
            </div>

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
                  <Link to="/certificate">{t("footer.links.certificate")}</Link>
                </li>
                <li>
                  <Link to="/gallery">{t("footer.links.gallery")}</Link>
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
                  <Link to="/privacy">{t("footer.support.privacyPolicy")}</Link>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-itim mb-3 animated-underline pb-1 relative">
                {t("footer.followUs")}
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/sergio.industries/"
                  target="_blank"
                  aria-label="Instagram"
                  className="hover:opacity-80"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 0112.315 22c-1.064 0-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.08c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 0112.315 2zm-4.98 2a2.25 2.25 0 00-2.25 2.25v8.25c0 1.108.966 2.25 2.25 2.25h8.25c1.108 0 2.25-.966 2.25-2.25V6.25c0-1.108-.966-2.25-2.25-2.25H7.335z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M12 6.75a5.25 5.25 0 016.568.756l.776 2.25a.75.75 0 010 .498l-.776 2.25a5.25 5.25 0 11-9.568 0l-.776-2.25a.75.75 0 010-.498l.776-2.25A5.25 5.25 0 0112 6.75zM8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/sergio.ind/"
                  target="_blank"
                  aria-label="Facebook"
                  className="hover:opacity-80"
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
                <a
                  href="#"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="hover:opacity-80"
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
