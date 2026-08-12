import React from 'react';
import styles from './styles.module.css';

/**
 * Іконки калькуляторів в одній системі (портовано з cyberdev.space):
 *   viewBox 120×96, круглі закінчення, акцентний колір (--ifm-color-primary,
 *   у нас помаранчевий) — на тому, що власне розраховується (вібратор, рамки,
 *   центральна жила), нейтральний сірий — на конструкції. Кольори беруться з
 *   CSS-змінних теми, тож підлаштовуються під світлу/темну гаму автоматично.
 */

const VIEW_BOX = '0 0 120 96';

function Icon({children}) {
    return (
        <svg
            className={styles.calcIcon}
            viewBox={VIEW_BOX}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            {children}
        </svg>
    );
}

// Точка живлення — спільний елемент майже всіх схем.
function Feed({x, y}) {
    return <circle cx={x} cy={y} r="3" className={styles.iconFeed} />;
}

// Ground Plane: вертикальний випромінювач і чотири похилі противаги.
export function GroundPlaneIcon() {
    return (
        <Icon>
            <path d="M60 12V58" className={styles.iconActive} />
            <path
                d="M60 58 18 82M60 58 40 86M60 58 80 86M60 58 102 82"
                className={styles.iconStruct}
            />
            <Feed x={60} y={58} />
        </Icon>
    );
}

// J-pole: чвертьхвильовий шлейф, узгоджений із півхвильовим вібратором.
export function JpoleIcon() {
    return (
        <Icon>
            <path d="M70 8V74" className={styles.iconActive} />
            <path d="M46 38V74M46 74h24" className={styles.iconStruct} />
            {/* Фідер під'єднано до обох провідників і йде вниз */}
            <path d="M46 62 58 88M70 62 58 88" className={styles.iconLead} />
            <Feed x={46} y={62} />
            <Feed x={70} y={62} />
        </Icon>
    );
}

// Yagi: рефлектор, активний вібратор і директори на бумі.
export function YagiIcon() {
    const directors = [
        {x: 62, half: 22},
        {x: 78, half: 20},
        {x: 92, half: 18},
        {x: 104, half: 16},
    ];

    return (
        <Icon>
            <path d="M16 48h92" className={styles.iconBoom} />
            <path d="M22 14v68" className={styles.iconStruct} />
            <path d="M42 18v60" className={styles.iconActive} />
            {directors.map(({x, half}) => (
                <path
                    key={x}
                    d={`M${x} ${48 - half}v${half * 2}`}
                    className={styles.iconStruct}
                />
            ))}
            <Feed x={42} y={48} />
        </Icon>
    );
}

// Харченко: дві ромбічні рамки з проміжком живлення, попереду рефлектора.
export function KharchenkoIcon() {
    return (
        <Icon>
            <rect
                x="12"
                y="16"
                width="96"
                height="64"
                rx="4"
                className={styles.iconReflector}
            />
            <path d="M56 48 38 30 20 48 38 66Z" className={styles.iconActive} />
            <path d="M64 48 82 30 100 48 82 66Z" className={styles.iconActive} />
            <path d="M56 48h-2M64 48h2" className={styles.iconLead} />
        </Icon>
    );
}

// Flower Pot: верхнє плече, нижнє плече і запірний дросель із коаксіалу.
export function FlowerPotIcon() {
    return (
        <Icon>
            <path d="M60 8V44" className={styles.iconActive} />
            <path d="M60 44v18" className={styles.iconStruct} />
            {/* Дросель — виток кабелю */}
            <path
                d="M60 62c-9 0-9 7 0 7s9 7 0 7-9 7 0 7"
                className={styles.iconCoil}
            />
            <path d="M60 83v6" className={styles.iconLead} />
            <Feed x={60} y={44} />
        </Icon>
    );
}

// Втрати коаксіалу: зріз кабелю з жилою й екраном, роз'єм і затухаючий сигнал.
export function CoaxIcon() {
    return (
        <Icon>
            {/* Сигнал, що згасає вздовж кабелю */}
            <path
                d="M22 26q6-14 12 0t12 0q6-11 12 0t12 0q6-8 12 0t12 0"
                className={styles.iconWave}
            />
            {/* Кабель */}
            <path d="M26 62h64" className={styles.iconCable} />
            {/* Зріз: екран, діелектрик, центральна жила */}
            <circle cx="26" cy="62" r="14" className={styles.iconStruct} />
            <circle cx="26" cy="62" r="8" className={styles.iconStruct} />
            <circle cx="26" cy="62" r="3" className={styles.iconFeed} />
            {/* Роз'єм */}
            <rect
                x="90"
                y="52"
                width="18"
                height="20"
                rx="3"
                className={styles.iconStruct}
            />
            <path d="M96 52v20M102 52v20" className={styles.iconStruct} />
        </Icon>
    );
}
