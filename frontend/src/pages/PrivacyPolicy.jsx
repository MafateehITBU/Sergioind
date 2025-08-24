import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

function PrivacyPolicyPage() {
  const { t } = useTranslation("privacyPolicy");
  const points1 = t("point1.points", { returnObjects: true });
  const points2 = t("point2.points", { returnObjects: true });
  const points3 = t("point3.points", { returnObjects: true });
  const points6 = t("point6.content", { returnObjects: true });
  const points7 = t("point7.content", { returnObjects: true });
  const points8 = t("point8.points", { returnObjects: true });

  return (
    <>
      <Header />
      <div className="py-30  max-w-7xl mx-auto px-6">
      <h1 className="text-h1">{t("title")}</h1>

      <h2 className="text-h2 mt-25">{t("point1.title")}</h2>
      <p className="mt-5">{t("point1.content")}</p>
      <ul className="list-disc list-inside mt-5">
        {points1.map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ))}
      </ul>
      <h2 className="text-h2 mt-25">{t("point2.title")}</h2>
      <p className="mt-5">{t("point2.content")}</p>
      <ul className="list-disc list-inside mt-5">
        {points2.map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ))} 
      </ul>
      <h2 className="text-h2 mt-25">{t("point3.title")}</h2>
      <p className="mt-5">{t("point3.content")}</p>
      <ul className="list-disc list-inside mt-5">
        {points3.map((point, index) => (
          <li key={index} className="mb-2">{point}</li> 
        ))}
      </ul>
      <h2 className="text-h2 mt-25">{t("point4.title")}</h2>
      <p className="mt-5">{t("point4.content")}</p>
      <h2 className="text-h2 mt-25">{t("point5.title")}</h2>
      <p className="mt-5">{t("point5.content")}</p>
      <h2 className="text-h2 mt-25">{t("point6.title")}</h2>
      <ul className="list-disc list-inside mt-5">
        {points6.map((point, index) => (    
          <li key={index} className="mb-2">{point}</li>
        ))}
      </ul>
      <h2 className="text-h2 mt-25">{t("point7.title")}</h2>
      <ul className="list-disc list-inside mt-5">
        {points7.map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ))}
      </ul>
      <h2 className="text-h2 mt-25">{t("point8.title")}</h2>
      <p className="mt-5">{t("point8.content")}</p>
      <ul className="list-disc list-inside mt-5">
        {points8.map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ))}
      </ul>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicyPage;
