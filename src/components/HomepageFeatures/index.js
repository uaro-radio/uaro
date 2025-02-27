import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Мета діяльності',
    // Svg: require('@site/static/img/uaro_ua.svg').default,
    description: (
      <>
          Метою діяльності є забезпечення та захист спільних інтересів громадян України у сфері аматорського
          радіозв'язку та радіоспорту. Основними цілями організації є забезпечення творчої аматорської некомерційної
          діяльності своїх членів в галузі радіо, сприяння розвитку радіоспорту, наукової та технічної творчості.
      </>
    ),
  },
  {
    title: 'Приєднатися до спільноти',
    // Svg: require('@site/static/img/radio.svg').default,
    description: (
      <>
        <a href="https://t.me/Ukraine_Amateur_Radio_Operators" target='_blank'>Ukraine Amateur Radio Operators</a>
        <img src="/img/telegram.png" style={{ width: '75%' }}  alt=''/>
      </>
    ),
  },
  {
    title: 'Проходження',
    // Svg: require('@site/static/img/ukraine.svg').default,
    description: (
        <>
            {/*Новини, література, інструкції, статті*/}
            {/*<img src="/img/radio.jpg" style={{width: '100%'}} alt=''/>*/}
            {/*<i>Фото належить автору із спільноти.</i>*/}
            <img src="https://www.hamqsl.com/solarvhf.php" alt=''/>
        </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      {/*<div className="text--center">*/}
      {/*  <Svg className={styles.featureSvg} role="img" />*/}
      {/*</div>*/}
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
