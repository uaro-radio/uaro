import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import styles from './styles.module.css';

// Дату форматуємо за поточною локаллю. Явний UTC потрібен, щоб SSR і клієнт
// дали однаковий рядок незалежно від часового поясу збірки.
function useDateFormatter() {
    const {
        i18n: {currentLocale},
    } = useDocusaurusContext();

    return React.useMemo(
        () =>
            new Intl.DateTimeFormat(currentLocale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
            }),
        [currentLocale],
    );
}

export default function RecentPosts() {
    const {posts} = usePluginData('recent-posts');
    const dateFormat = useDateFormatter();

    if (!posts?.length) {
        return null;
    }

    const formatDate = (isoDate) => {
        const [year, month, day] = isoDate.split('-').map(Number);
        return dateFormat.format(new Date(Date.UTC(year, month - 1, day)));
    };

    return (
        <section className={styles.section} aria-labelledby="recent-posts-title">
            <div className={styles.header}>
                <h2 id="recent-posts-title" className={styles.title}>
                    <Translate id="home.news.title">Останні новини</Translate>
                </h2>
                <Link to="/blog" className={styles.more}>
                    <Translate id="home.news.all">Усі новини</Translate>
                    <span aria-hidden="true"> →</span>
                </Link>
            </div>

            <ul className={styles.grid}>
                {posts.map((post) => (
                    <li key={post.permalink} className={styles.card}>
                        <Link to={post.permalink} className={styles.link}>
                            <time className={styles.date} dateTime={post.date}>
                                {formatDate(post.date)}
                            </time>
                            <span className={styles.postTitle}>{post.title}</span>
                            <span className={styles.excerpt}>{post.excerpt}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
