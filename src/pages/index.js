import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
                <div className="float-child-left">
                    <img src="/img/logo.png" alt="" style={{width: '40%'}}/>
                </div>

                <div className="float-child-right">
                    <Heading as="h1" className="hero__title">
                        {siteConfig.title}
                    </Heading>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div>
                        <b>
                            Громадська організація "Оператори аматорських радіостанцій України".
                        </b>
                    </div>
                </div>
        </div>
    </header>
  );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Вас вітає ${siteConfig.title}`}
            description="Оператори аматорських радіостанцій України">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
