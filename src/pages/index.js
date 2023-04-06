import Image from "next/image";

import SEO from "@/components/Seo";
import styles from "@/styles/Home.module.css";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <SEO description="3js" title="3js" siteTitle="3js" />
      <main className={styles.main}>3js</main>
    </>
  );
}
