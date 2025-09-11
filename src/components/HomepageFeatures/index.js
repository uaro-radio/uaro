import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Image from '@site/src/components/Image';
import our_tutorial_1 from '@site/src/pages/img/our_tutorial_1.jpg';
import calcs from '@site/src/pages/img/yagi_dark.png';
import statut from '@site/src/pages/img/statut.png';

const FeatureList = [
    {
        title: 'Мета діяльності',
        Svg: require('@site/static/img/ukraine_map.svg').default,
        description: (
            <>
                <a href="/charter">
                    <Image src={statut} alt="1" width="250" height="350" align="center"/>
                </a>
                <br/>
                Метою діяльності є забезпечення та захист спільних інтересів громадян України у сфері аматорського
                радіозв'язку та радіоспорту. Основними цілями організації є забезпечення творчої аматорської
                некомерційної
                діяльності своїх членів в галузі радіо, сприяння розвитку радіоспорту, наукової та технічної творчості.
            </>
        ),
    },
    {
        title: 'Наші посібники',
        Svg: require('@site/static/img/book.svg').default,
        description: (
            <>
                <a href="/our_tutorials">
                    <Image src={our_tutorial_1} alt="1" width="250" height="350" align="center"/>
                </a>
                <br/>
                Цей посібник ми зробили для своїх — для тих, хто вміє тримати зв’язок, навіть коли навколо глухо.
                Проста УКХ антена, яку можна зібрати з підручних матеріалів, — це не теорія, а робоче рішення,
                що не раз виручало в реальних умовах.
                <br/>
                <a href="/our_tutorials">Перейти до посібників</a>
            </>
        ),
    },
    {
        title: 'Калькулятори',
        Svg: require('@site/static/img/broadcasting-antenna.svg').default,
        description: (
            <>
                <a href="/docs/calculators">
                    <Image src={calcs} alt="1" width="350" height="350" align="center"/>
                </a>
                <br/>
                Наші калькулятори — ідеальний помічник як для початківців, так і для досвідчених радіоаматорів.
                Простий інтерфейс, зрозумілі пояснення та можливість адаптації результатів під ваші потреби допоможуть
                вам швидко досягти точності у проектуванні.
                <br/>
                <a href="/docs/calculators">Перейти до калькуляторів</a>
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
