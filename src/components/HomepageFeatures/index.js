import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

import qr from '@site/src/pages/img/qr.png';
import statut from '@site/src/pages/img/statut.png';
import {
    YagiIcon,
    JpoleIcon,
    GroundPlaneIcon,
    KharchenkoIcon,
    FlowerPotIcon,
    CoaxIcon,
} from './CalcIcons';

// Іконка спільноти — проста «мовна бульбашка». Колір бере з currentColor,
// тож підсвічується за темою так само, як іконки калькуляторів.
function CommunityIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}>
            <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
        </svg>
    );
}

const TELEGRAM_URL = 'https://t.me/Ukraine_Amateur_Radio_Operators';

// Два цільові блоки організації. Уся картка — одне посилання (розтягнуте
// на весь блок), тож клік у будь-якому місці, включно з підписом, спрацьовує.
const FeatureList = [
    {
        id: 'purpose',
        to: '/charter',
        cover: statut,
        Svg: require('@site/static/img/ukraine_map.svg').default,
        title: <Translate id="home.feature.purpose.title">Мета діяльності</Translate>,
        description: (
            <Translate id="home.feature.purpose.text">
                Метою діяльності є забезпечення та захист спільних інтересів громадян
                України у сфері аматорського радіозв'язку та радіоспорту. Основними
                цілями організації є забезпечення творчої аматорської некомерційної
                діяльності своїх членів в галузі радіо, сприяння розвитку радіоспорту,
                наукової та технічної творчості.
            </Translate>
        ),
        cta: <Translate id="home.feature.purpose.cta">Переглянути документи</Translate>,
    },
    {
        id: 'community',
        to: TELEGRAM_URL,
        cover: qr,
        coverContain: true,
        Svg: CommunityIcon,
        title: <Translate id="home.feature.community.title">Наше ком'юніті</Translate>,
        description: (
            <Translate id="home.feature.community.text">
                Наш чат у Telegram — найактивніша точка зв'язку ЮАРО. Питання новачка,
                обмін досвідом, анонси та щоденне життя в ефірі. Скануйте QR-код або
                тисніть, щоб приєднатися.
            </Translate>
        ),
        cta: <Translate id="home.feature.community.cta">Приєднатися в Telegram</Translate>,
    },
];

// Шість наявних калькуляторів у сітці 2×3.
const CALCULATORS = [
    {to: '/docs/calculators/yagi', Icon: YagiIcon, label: 'Yagi (DL6WU)'},
    {to: '/docs/calculators/jpole', Icon: JpoleIcon, label: 'J-pole'},
    {
        to: '/docs/calculators/ground_plane',
        Icon: GroundPlaneIcon,
        label: 'Ground Plane',
    },
    {
        to: '/docs/calculators/kharchenko',
        Icon: KharchenkoIcon,
        label: (
            <Translate id="home.calc.kharchenko">Харченко (BiQuad)</Translate>
        ),
    },
    {to: '/docs/calculators/flower_pot', Icon: FlowerPotIcon, label: 'Flower Pot'},
    {
        to: '/docs/other_calculators/coax_loss_calculator',
        Icon: CoaxIcon,
        label: <Translate id="home.calc.coax">Втрати кабелю</Translate>,
    },
];

function Feature({to, cover, coverContain, Svg, title, description, cta}) {
    return (
        <article className={styles.card}>
            {/* Обкладинка декоративна — клік на неї перехоплює розтягнуте
                посилання заголовка нижче. */}
            <div
                className={clsx(styles.cover, coverContain && styles.coverContain)}
                aria-hidden="true">
                <img src={cover} alt="" loading="lazy" />
            </div>

            <div className={styles.body}>
                <div className={styles.heading}>
                    <Svg className={styles.icon} role="presentation" />
                    <h3 className={styles.title}>
                        <Link to={to} className={styles.titleLink}>
                            {title}
                        </Link>
                    </h3>
                </div>

                <p className={styles.text}>{description}</p>

                <span className={styles.cta} aria-hidden="true">
                    {cta} →
                </span>
            </div>
        </article>
    );
}

// Картка з сіткою калькуляторів: кожна плитка — окреме посилання.
function CalculatorsCard() {
    const BroadcastIcon = require('@site/static/img/broadcasting-antenna.svg').default;
    return (
        <article className={clsx(styles.card, styles.calcCard)}>
            <div className={styles.heading}>
                <BroadcastIcon className={styles.icon} role="presentation" />
                <h3 className={styles.title}>
                    <Translate id="home.feature.calculators.title">
                        Калькулятори
                    </Translate>
                </h3>
            </div>

            <ul className={styles.calcGrid}>
                {CALCULATORS.map(({to, Icon, label}) => (
                    <li key={to} className={styles.calcTile}>
                        <Link to={to} className={styles.calcLink}>
                            <span className={styles.calcThumb}>
                                <Icon />
                            </span>
                            <span className={styles.calcLabel}>{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link to="/docs/calculators" className={styles.cta}>
                <Translate id="home.calc.all">Усі калькулятори</Translate> →
            </Link>
        </article>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className={styles.grid}>
                {FeatureList.map((props) => (
                    <Feature key={props.id} {...props} />
                ))}
                <CalculatorsCard />
            </div>
        </section>
    );
}
