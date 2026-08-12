import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import RecentPosts from '@site/src/components/RecentPosts';
import Transceiver from '@site/src/components/Transceiver';

import styles from './index.module.css';

// Шапка розкладена у дві колонки: зліва напис, справа трансивер. Нижче 996px
// колонки стають рядками, і трансивер іде під текстом.
function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <header className={styles.hero}>
            <div className={clsx('container', styles.heroInner)}>
                <div className={styles.heroText}>
                    <Heading as="h1" className={styles.heroTitle}>
                        {siteConfig.title}
                    </Heading>

                    <p className={styles.heroLead}>
                        <Translate id="home.hero.lead">
                            Громадська організація «Оператори аматорських радіостанцій
                            України». Об'єднуємо радіоаматорів, розвиваємо радіоспорт і
                            технічну творчість, готуємо посібники та довідкові матеріали.
                        </Translate>
                    </p>

                    <div className={styles.actions}>
                        <Link
                            className="button button--primary button--lg"
                            to="/membership">
                            <Translate id="home.hero.join">Вступити до ЮАРО</Translate>
                        </Link>
                        <Link
                            className={clsx(
                                'button button--lg',
                                styles.secondaryButton,
                            )}
                            to="/docs/tutorial-for-beginners">
                            <Translate id="home.hero.handbook">Довідник</Translate>
                        </Link>
                    </div>
                </div>

                <div className={styles.heroRig}>
                    <Transceiver />
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <Layout
            title={translate(
                {
                    id: 'home.meta.title',
                    message: 'Вас вітає {name}',
                    description: 'Заголовок вкладки головної сторінки',
                },
                {name: siteConfig.title},
            )}
            description={translate({
                id: 'home.meta.description',
                message: 'Оператори аматорських радіостанцій України',
            })}>
            <HomepageHeader />

            <main>
                <section className={clsx('container', styles.section)}>
                    <HomepageFeatures />
                </section>

                {/* Новини на підфарбованій смузі — щоб розділ читався окремо */}
                <section className={styles.newsBand}>
                    <div className={clsx('container', styles.section)}>
                        <RecentPosts />
                    </div>
                </section>
            </main>
        </Layout>
    );
}
