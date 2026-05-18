import { useTranslation } from "react-i18next";
import { AppWindow, Info, Link2, Scale, User } from "lucide-react";
import Version from "../../shared/ui/Version/Version";
import styles from "./AboutPage.module.scss";

const AboutPage = () => {
  const { t } = useTranslation();

  function openLinks(event: React.MouseEvent<HTMLAnchorElement>, url: string) {
    event.preventDefault();
    console.log(url)
    window.electronAPI.openLink(url);
  }

  return (
    <div className={styles.AboutPage}>
      <h1 className={styles.title}>{t("About")}</h1>
      <div className={styles.PageContent}>
        <div className={styles.appInfo}>
          <h2 className={styles.appName}>Screctro</h2>
          <p className={`${styles.infoRow} ${styles.centerRow}`}>
            <AppWindow size={16} />
            <span>
              {t("Version")} <Version />
            </span>
          </p>
        </div>
        <div className={styles.description}>
          <p className={styles.infoRow}>
            <Info size={16} />
            <span>
              {t(
                "This screenshot tool is built with Electron for quick and convenient screen capturing. Simple interface, minimal settings — maximum efficiency.",
              )}
            </span>
          </p>
        </div>
        <div className={styles.links}>
          <a
            href="https://github.com/stenjeet/screctro"
            onClick={(e) =>
              openLinks(e, "https://github.com/stenjeet/screctro")
            }
            className={styles.link}
          >
            <Link2 size={16} />
            <span>{t("Visit GitHub")}</span>
          </a>
          <a
            href="https://github.com/stenjeet/screctro/blob/main/LICENSE"
            onClick={(e) =>
              openLinks(
                e,
                "https://github.com/stenjeet/screctro/blob/main/LICENSE",
              )
            }
            className={styles.link}
          >
            <Scale size={16} />
            <span>{t("License")}</span>
          </a>
        </div>
        <div className={styles.author}>
          <p className={styles.infoRow}>
            <User size={16} />
            <span>{t("Developed by")} stenjeet</span>
          </p>
          <p className={styles.allRight}>{t("All rights reserved")} © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
