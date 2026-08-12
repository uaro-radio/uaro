import React from 'react';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Передня панель трансивера. Уся анімація — CSS у styles.module.css,
// щоб її можна було вимкнути через prefers-reduced-motion.

// Детермінований шум: SSR і клієнт мусять дати однакову розмітку,
// тому Math.random() тут використовувати не можна.
function noise(i, seed = 1) {
    const x = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
    return x - Math.floor(x);
}

// Профіль сигналів на панорамі. Піки стоять на своїх частотах —
// саме тому у водоспаді вони дають вертикальні смуги.
const PEAKS = [
    {at: 0.16, amp: 0.3, w: 0.013},
    {at: 0.5, amp: 0.82, w: 0.009}, // сигнал, на який налаштований VFO
    {at: 0.63, amp: 0.44, w: 0.011},
    {at: 0.82, amp: 0.23, w: 0.015},
];

function signalAt(t) {
    return PEAKS.reduce(
        (sum, p) => sum + p.amp * Math.exp(-((t - p.at) ** 2) / (2 * p.w ** 2)),
        0,
    );
}

// ── Геометрія дисплея ───────────────────────────────────────
const SPEC_X = 60;
const SPEC_W = 330;
const SPEC_BOTTOM = 196;
const SPEC_HEIGHT = 44;

const BAR_COUNT = 73;
const BAR_STEP = SPEC_W / BAR_COUNT;

const WF_TOP = 198;
const WF_HEIGHT = 20;
// 8 рядків по 2.5 — блок точно дорівнює висоті вікна, тож прокрутка
// зациклюється без видимого повтору.
const WF_ROWS = 8;
const WF_ROW_H = 2.5;
// Унікальних градієнтів менше, ніж рядків: різницю між рядками добираємо
// яскравістю. Так текстура лишається живою, а розмітка — легкою.
const WF_GRADIENTS = 4;

// ── S-метр ──────────────────────────────────────────────────
// Сегментна шкала, як у справжніх барграф-індикаторах.
const METER_X = 60;
const METER_W = 290;
const METER_Y = 143;
const METER_H = 9;
const METER_STEP = 7.4;
const METER_SEG_W = 5.4;
const METER_S9_X = 206; // праворуч від S9 сегменти червоні
const METER_SEGMENTS = Array.from(
    {length: Math.floor(METER_W / METER_STEP)},
    (_, i) => METER_X + i * METER_STEP,
);

// Сегменти семисегментного індикатора: які з них горять для кожної цифри.
const SEGMENTS = {
    0: 'abcdef',
    1: 'bc',
    2: 'abdeg',
    3: 'abcdg',
    4: 'bcfg',
    5: 'acdfg',
    6: 'acdefg',
    7: 'abc',
    8: 'abcdefg',
    9: 'abcdfg',
};

// Геометрія одного сегмента в системі координат цифри (ширина 14, висота 26).
const SEGMENT_PATHS = {
    a: 'M3 0.5 L11 0.5 L9.5 2.5 L4.5 2.5 Z',
    b: 'M11.6 1.2 L11 10.4 L9.2 11.8 L9.8 2.6 Z',
    c: 'M10.7 14.2 L10.1 23.4 L8 24.8 L8.6 15.6 Z',
    d: 'M2.6 24.5 L7.5 24.5 L9 26.5 L1 26.5 Z',
    e: 'M2.9 14.2 L2.3 23.4 L0.4 24.8 L1 15.6 Z',
    f: 'M3.8 1.2 L3.2 10.4 L1.4 11.8 L2 2.6 Z',
    g: 'M3.6 12.3 L9.1 12.3 L10.4 13.5 L8.7 14.7 L3.2 14.7 L2 13.5 Z',
};

function Digit({value, x, className}) {
    const lit = SEGMENTS[value] ?? '';
    return (
        <g transform={`translate(${x} 0)`} className={className}>
            {Object.entries(SEGMENT_PATHS).map(([key, d]) => (
                <path
                    key={key}
                    d={d}
                    className={lit.includes(key) ? styles.segOn : styles.segOff}
                />
            ))}
        </g>
    );
}

// 14.07x МГц — ділянка 20 м, де працює FT8. Остання цифра «крутиться»
// разом із ручкою налаштування.
const FREQ_FIXED = [1, 4, 0, 7];
const FREQ_LAST = [4, 6, 5];

// ── Панорама ────────────────────────────────────────────────
function SpectrumBars() {
    return (
        <>
            {Array.from({length: BAR_COUNT}, (_, i) => {
                const t = (i + 0.5) / BAR_COUNT;
                // Шумова доріжка + сигнали
                const floor = 0.1 + noise(i) * 0.1;
                const level = Math.min(1, floor + signalAt(t));
                const height = Math.max(1.5, level * SPEC_HEIGHT);
                const round = (v) => Math.round(v * 100) / 100;

                return (
                    <rect
                        key={i}
                        x={round(SPEC_X + i * BAR_STEP)}
                        y={round(SPEC_BOTTOM - height)}
                        width={round(BAR_STEP + 0.35)}
                        height={round(height)}
                        className={styles.specBar}
                        style={{
                            // Кожна смужка живе у своєму ритмі — виходить
                            // «дихаючий» шумовий фон, а не рівна гребінка.
                            animationDelay: `${round(-noise(i, 3) * 2.4)}s`,
                            animationDuration: `${round(0.7 + noise(i, 7) * 0.9)}s`,
                        }}
                    />
                );
            })}
        </>
    );
}

// ── Антена ──────────────────────────────────────────────────
// Yagi орієнтована горизонтально, бумом праворуч: щогла ліворуч (за
// рефлектором), директори коротшають до фронту, звідки праворуч ідуть хвилі.
const MAST_X = 800; // задній край бума, тут стоїть щогла
const BOOM_Y = 150; // висота горизонтального бума
const BOOM_FRONT = 884; // передній директор
const FEED_X = 822; // активний вібратор — точка живлення

// Дуги радіохвиль: сектор ±40° над і під віссю, розкритий праворуч від фронту.
function waveArcs(r) {
    const dx = 0.766 * r;
    const dy = 0.643 * r;
    return [
        `M${BOOM_FRONT + dx} ${BOOM_Y - dy}A${r} ${r} 0 0 1 ${BOOM_FRONT + dx} ${BOOM_Y + dy}`,
    ];
}

// Елементи Yagi вздовж горизонтального бума: рефлектор (найдовший, ззаду),
// активний вібратор, далі директори, що коротшають до фронту (праворуч).
const YAGI_ELEMENTS = [
    {x: MAST_X, half: 48}, // рефлектор
    {x: FEED_X, half: 43}, // активний вібратор
    {x: 844, half: 39}, // директори →
    {x: 860, half: 35},
    {x: 872, half: 31},
    {x: BOOM_FRONT, half: 28}, // фронт
];

function Antenna() {
    return (
        <g>
            {/* Відтяжки щогли */}
            <path
                d={`M${MAST_X} 300 748 418M${MAST_X} 300 852 418`}
                className={styles.antGuy}
            />
            {/* Щогла */}
            <path d={`M${MAST_X} ${BOOM_Y} V420`} className={styles.antMast} />

            {/* Бум (стріла), напрямлений праворуч */}
            <path d={`M${MAST_X} ${BOOM_Y} H${BOOM_FRONT}`} className={styles.antBoom} />

            {/* Елементи решітки */}
            {YAGI_ELEMENTS.map(({x, half}) => (
                <path
                    key={x}
                    d={`M${x} ${BOOM_Y - half} V${BOOM_Y + half}`}
                    className={styles.antElement}
                />
            ))}

            {/* Точка живлення активного вібратора */}
            <rect
                x={FEED_X - 4}
                y={BOOM_Y - 4}
                width="8"
                height="8"
                rx="2"
                className={styles.antInsulator}
            />

            {/* Радіохвилі — праворуч від фронтального директора */}
            {[20, 30, 40].map((r, i) => (
                <g
                    key={r}
                    className={styles.wave}
                    style={{animationDelay: `${-i * 1.4}s`}}>
                    {waveArcs(r).map((d) => (
                        <path key={d} d={d} />
                    ))}
                </g>
            ))}
        </g>
    );
}

// Коаксіал: виходить з-за корпусу трансивера, провисає і піднімається
// до точки живлення антени біля основи щогли.
function Coax() {
    const d = `M700 330C758 360 796 356 812 322C830 284 802 214 ${MAST_X} ${BOOM_Y + 2}`;
    return (
        <g>
            <path d={d} className={styles.coaxJacket} />
            <path d={d} className={styles.coaxSheen} />
            <rect
                x={MAST_X - 7}
                y={BOOM_Y + 1}
                width="14"
                height="9"
                rx="2"
                className={styles.antInsulator}
            />
        </g>
    );
}

// Кореспондент, що поволі проявляється і знову згасає. Стоїть на тій самій
// частоті, що й слабкий пік у водоспаді, — виглядає як посилення сигналу.
function GhostSignal() {
    const center = 0.16;
    return (
        <g className={styles.specGhost}>
            {Array.from({length: BAR_COUNT}, (_, i) => {
                const t = (i + 0.5) / BAR_COUNT;
                const amp = 0.52 * Math.exp(-((t - center) ** 2) / (2 * 0.011 ** 2));
                if (amp < 0.03) {
                    return null;
                }
                const height = amp * SPEC_HEIGHT;
                return (
                    <rect
                        key={i}
                        x={SPEC_X + i * BAR_STEP}
                        y={SPEC_BOTTOM - height}
                        width={BAR_STEP + 0.35}
                        height={height}
                    />
                );
            })}
        </g>
    );
}

// ── Водоспад ────────────────────────────────────────────────
function waterfallColor(v) {
    if (v < 0.2) return '#1b0d02';
    if (v < 0.34) return '#3d2004';
    if (v < 0.5) return '#7a3f0b';
    if (v < 0.66) return '#c26a17';
    if (v < 0.82) return '#f2992f';
    return '#ffd24b';
}

// Стопи ставимо нерівномірно: густо навколо піків, де формуються вертикальні
// смуги, і рідко на рівному шумовому фоні. Так деталь зберігається, а стопів
// потрібно втричі менше, ніж при рівномірному кроці.
const WF_STOP_POSITIONS = (() => {
    const positions = [0, 0.33, 0.72, 1];
    PEAKS.forEach(({at, w}) => {
        positions.push(at - w * 1.9, at, at + w * 1.9);
    });
    return positions
        .filter((p) => p >= 0 && p <= 1)
        .sort((a, b) => a - b);
})();

function WaterfallGradients() {
    return (
        <>
            {Array.from({length: WF_GRADIENTS}, (_, row) => (
                <linearGradient
                    key={row}
                    id={`wfRow${row}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0">
                    {WF_STOP_POSITIONS.map((t, s) => {
                        const level = Math.min(
                            1,
                            0.08 +
                                noise(row * 31 + s, 5) * 0.17 +
                                signalAt(t) * (0.78 + noise(row, 11) * 0.28),
                        );
                        return (
                            <stop
                                key={s}
                                offset={`${Math.round(t * 1000) / 10}%`}
                                stopColor={waterfallColor(level)}
                            />
                        );
                    })}
                </linearGradient>
            ))}
        </>
    );
}

function Waterfall() {
    // Два однакові набори рядків: коли група зсувається рівно на висоту
    // одного набору, картинка повторюється без стрибка.
    const rows = WF_ROWS * 2;
    return (
        <g className={styles.waterfall}>
            {Array.from({length: rows}, (_, i) => {
                const row = i % WF_ROWS;
                return (
                    <rect
                        key={i}
                        x={SPEC_X}
                        y={WF_TOP - WF_ROWS * WF_ROW_H + i * WF_ROW_H}
                        width={SPEC_W}
                        height={WF_ROW_H + 0.2}
                        fill={`url(#wfRow${row % WF_GRADIENTS})`}
                        // Яскравість розводить сусідні рядки, що ділять градієнт
                        opacity={Math.round((0.72 + noise(row, 17) * 0.28) * 100) / 100}
                    />
                );
            })}
        </g>
    );
}

export default function Transceiver() {
    const logo = useBaseUrl('/img/new_logo.png');
    return (
        <svg
            className={styles.rig}
            viewBox="0 90 1080 350"
            role="img"
            aria-label={translate({
                id: 'transceiver.ariaLabel',
                message:
                    "Радіоаматорський шек: трансивер із частотою близько 14.07 МГц, S-метром, панорамним приймачем і водоспадом, з'єднаний коаксіалом із напрямленою антеною Yagi, що випромінює радіохвилі",
                description: 'Опис SVG-ілюстрації трансивера на головній сторінці',
            })}
            xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="rigCase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--rig-case-top)" />
                    <stop offset="55%" stopColor="var(--rig-case-mid)" />
                    <stop offset="100%" stopColor="var(--rig-case-bottom)" />
                </linearGradient>

                <linearGradient id="rigScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--rig-screen-top)" />
                    <stop offset="100%" stopColor="var(--rig-screen-bottom)" />
                </linearGradient>

                <linearGradient id="rigKnob" x1="0.2" y1="0" x2="0.8" y2="1">
                    <stop offset="0%" stopColor="var(--rig-knob-light)" />
                    <stop offset="100%" stopColor="var(--rig-knob-dark)" />
                </linearGradient>

                {/* Відблиск на ручці — імітація точкового світла зверху зліва */}
                <radialGradient id="rigKnobGloss" cx="0.34" cy="0.26" r="0.62">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                    <stop offset="55%" stopColor="#fff" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>

                {/* Відблиск на склі дисплея */}
                <linearGradient id="rigGlass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.13" />
                    <stop offset="42%" stopColor="#fff" stopOpacity="0.03" />
                    <stop offset="43%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>

                {/* Смуга світла, що зрідка проходить по склу */}
                <linearGradient id="rigSweep" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>

                <clipPath id="rigScreenClip">
                    <rect x="44" y="38" width="362" height="184" rx="8" />
                </clipPath>

                <WaterfallGradients />

                {/* Світіння дисплея та індикаторів */}
                <filter id="rigGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Тонкі рядки розгортки поверх дисплея */}
                <pattern
                    id="rigScanlines"
                    width="4"
                    height="3"
                    patternUnits="userSpaceOnUse">
                    <rect width="4" height="1" fill="#000" opacity="0.22" />
                </pattern>

                <clipPath id="rigSpectrumClip">
                    <rect
                        x={SPEC_X}
                        y={SPEC_BOTTOM - SPEC_HEIGHT}
                        width={SPEC_W}
                        height={SPEC_HEIGHT}
                    />
                </clipPath>

                <clipPath id="rigWaterfallClip">
                    <rect
                        x={SPEC_X}
                        y={WF_TOP}
                        width={SPEC_W}
                        height={WF_HEIGHT}
                    />
                </clipPath>

                {/* Рівень S-метра: прямокутник масштабується, відкриваючи сегменти */}
                <clipPath id="rigMeterClip">
                    <rect
                        x={METER_X}
                        y={METER_Y - 2}
                        width={METER_W}
                        height={METER_H + 4}
                        className={styles.meterClip}
                    />
                </clipPath>
            </defs>

            {/* Антена і кабель — під корпусом, щоб кабель «виходив» з-за нього.
                Зсунуті праворуч разом із розширеним на логотип корпусом. */}
            <g transform="translate(140 0)">
                <Antenna />
                <Coax />
            </g>

            {/* Трансивер стоїть на столі, антена — на щоглі поруч */}
            <g transform="translate(0 140)">
            {/* ── Корпус ─────────────────────────────────────────── */}
            <rect
                x="14"
                y="14"
                width="872"
                height="272"
                rx="16"
                fill="url(#rigCase)"
                stroke="var(--rig-edge)"
                strokeWidth="2"
            />
            {/* Фаска: світла грань зверху, темна знизу */}
            <path
                d="M30 16h840a14 14 0 0 1 14 14"
                fill="none"
                stroke="var(--rig-bevel)"
                strokeWidth="1.5"
            />

            {/* Гвинти по кутах */}
            {[
                [32, 32],
                [868, 32],
                [32, 268],
                [868, 268],
            ].map(([cx, cy]) => (
                <g key={`${cx}-${cy}`}>
                    <circle cx={cx} cy={cy} r="5" fill="var(--rig-knob-ring)" />
                    <circle cx={cx} cy={cy} r="3.6" fill="var(--rig-knob-dark)" />
                    <path
                        d={`M${cx - 2.4} ${cy - 1.2}L${cx + 2.4} ${cy + 1.2}`}
                        stroke="var(--rig-knob-ring)"
                        strokeWidth="1.4"
                    />
                </g>
            ))}

            {/* Ручки для перенесення. Малюються двома штрихами: основа плюс
                світла грань зверху — інакше на темному тлі їх не видно. */}
            {[
                {
                    d: 'M14 70H6a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h8',
                    boss: 16,
                },
                {
                    d: 'M886 70h8a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4h-8',
                    boss: 884,
                },
            ].map(({d, boss}) => (
                <g key={boss}>
                    <path d={d} className={styles.handleBase} />
                    <path d={d} className={styles.handleEdge} />
                    <circle cx={boss} cy="70" r="3.5" className={styles.handleBoss} />
                    <circle cx={boss} cy="118" r="3.5" className={styles.handleBoss} />
                </g>
            ))}

            {/* Логотип організації на всю висоту екрана, ліворуч від дисплея.
                Сидить у власній заглибині й не зсувається разом із панеллю. */}
            <rect
                x="44"
                y="34"
                width="124"
                height="192"
                rx="9"
                fill="var(--rig-screen-bezel)"
            />
            <image
                href={logo}
                x="48"
                y="38"
                width="116"
                height="184"
                preserveAspectRatio="xMidYMid meet"
            />

            {/* Решта панелі зсунута праворуч, щоб звільнити місце під логотип */}
            <g transform="translate(140 0)">
            {/* ── Головний дисплей ───────────────────────────────── */}
            <rect
                x="42"
                y="36"
                width="366"
                height="188"
                rx="9"
                fill="var(--rig-screen-bezel)"
            />
            <rect
                x="44"
                y="38"
                width="362"
                height="184"
                rx="8"
                fill="url(#rigScreen)"
            />

            {/* Частота */}
            <g transform="translate(64 58)" filter="url(#rigGlow)">
                <g transform="scale(2.05)">
                    {FREQ_FIXED.slice(0, 2).map((d, i) => (
                        <Digit key={`m${i}`} value={d} x={i * 17} />
                    ))}
                    <circle cx="36.5" cy="25" r="1.7" className={styles.segOn} />
                    {FREQ_FIXED.slice(2).map((d, i) => (
                        <Digit key={`k${i}`} value={d} x={41 + i * 17} />
                    ))}
                    {/* Остання цифра змінюється разом із обертанням ручки */}
                    <g transform="translate(75 0)">
                        {FREQ_LAST.map((d, i) => (
                            <Digit
                                key={`last${d}-${i}`}
                                value={d}
                                x={0}
                                className={styles[`lastDigit${i}`]}
                            />
                        ))}
                    </g>
                </g>
                <text x="196" y="52" className={styles.unit}>
                    MHz
                </text>
            </g>

            {/* Режим і статус */}
            <text x="64" y="128" className={styles.tag}>
                USB
            </text>
            <text x="112" y="128" className={styles.tagFt8}>
                FT8
            </text>
            <text x="160" y="128" className={styles.tag}>
                20m
            </text>
            <text x="342" y="128" className={styles.tagDim}>
                VFO A
            </text>

            {/* S-метр: шкала */}
            <g transform="translate(64 140)">
                <text x="0" y="0" className={styles.scaleLabel}>
                    S
                </text>
                {[1, 3, 5, 7, 9].map((s, i) => (
                    <text
                        key={s}
                        x={22 + i * 30}
                        y="0"
                        className={styles.scaleLabel}>
                        {s}
                    </text>
                ))}
                <text x="176" y="0" className={styles.scaleLabelHot}>
                    +20
                </text>
                <text x="218" y="0" className={styles.scaleLabelHot}>
                    +40
                </text>
            </g>

            {/* S-метр: сегментна шкала та пікова мітка */}
            {METER_SEGMENTS.map((x) => (
                <rect
                    key={`seg-off-${x}`}
                    x={x}
                    y={METER_Y}
                    width={METER_SEG_W}
                    height={METER_H}
                    rx="1"
                    className={styles.meterSegOff}
                />
            ))}
            <g clipPath="url(#rigMeterClip)" filter="url(#rigGlow)">
                {METER_SEGMENTS.map((x) => (
                    <rect
                        key={`seg-on-${x}`}
                        x={x}
                        y={METER_Y}
                        width={METER_SEG_W}
                        height={METER_H}
                        rx="1"
                        className={
                            x < METER_S9_X
                                ? styles.meterSegLow
                                : styles.meterSegHigh
                        }
                    />
                ))}
            </g>
            <rect
                x={METER_X}
                y={METER_Y - 2}
                width="2.5"
                height={METER_H + 4}
                className={styles.meterPeak}
            />

            {/* Панорама */}
            <rect
                x={SPEC_X}
                y={SPEC_BOTTOM - SPEC_HEIGHT}
                width={SPEC_W}
                height={SPEC_HEIGHT}
                fill="var(--rig-spectrum-bg)"
            />
            <g clipPath="url(#rigSpectrumClip)">
                {[1, 2, 3, 4, 5].map((i) => (
                    <line
                        key={`grid-${i}`}
                        x1={SPEC_X + (i * SPEC_W) / 6}
                        y1={SPEC_BOTTOM - SPEC_HEIGHT}
                        x2={SPEC_X + (i * SPEC_W) / 6}
                        y2={SPEC_BOTTOM}
                        stroke="var(--rig-grid)"
                        strokeWidth="1"
                    />
                ))}
                <SpectrumBars />
                <GhostSignal />
            </g>

            {/* Водоспад */}
            <g clipPath="url(#rigWaterfallClip)">
                <Waterfall />
            </g>

            {/* Смуга приймання — накриває і панораму, і водоспад */}
            <rect
                x={SPEC_X + SPEC_W / 2 - 4}
                y={SPEC_BOTTOM - SPEC_HEIGHT}
                width="8"
                height={SPEC_HEIGHT + WF_HEIGHT + 2}
                className={styles.passband}
            />

            {/* Скло: рядки розгортки та відблиск */}
            <rect
                x="44"
                y="38"
                width="362"
                height="184"
                rx="8"
                fill="url(#rigScanlines)"
                pointerEvents="none"
            />
            <path
                d="M44 46a8 8 0 0 1 8-8h150L74 222H52a8 8 0 0 1-8-8Z"
                fill="url(#rigGlass)"
                pointerEvents="none"
            />
            {/* Скіс задано атрибутом, бо CSS-трансформ анімації його б перезаписав */}
            <g clipPath="url(#rigScreenClip)" pointerEvents="none">
                <g transform="skewX(-16)">
                    <rect
                        className={styles.glassSweep}
                        x="0"
                        y="10"
                        width="86"
                        height="250"
                        fill="url(#rigSweep)"
                    />
                </g>
            </g>
            <rect
                x="44"
                y="38"
                width="362"
                height="184"
                rx="8"
                fill="none"
                stroke="var(--rig-screen-rim)"
                strokeWidth="1.5"
                pointerEvents="none"
            />

            {/* ── Марка на панелі ────────────────────────────────── */}
            {/* Назва організації як марка виробника: емблема + гравіювання */}
            <g transform="translate(430 20)">
                <g className={styles.brandMark}>
                    <circle cx="9" cy="10" r="2.6" />
                    <path d="M3.6 4.6a7.6 7.6 0 0 0 0 10.8" />
                    <path d="M14.4 4.6a7.6 7.6 0 0 1 0 10.8" />
                </g>
                <text x="28" y="16" className={styles.brandShadow}>
                    UARO
                </text>
                <text x="28" y="15" className={styles.brand}>
                    UARO
                </text>
                <text x="96" y="15" className={styles.brandModel}>
                    HF TRANSCEIVER
                </text>
            </g>

            {/* ── Динамік ────────────────────────────────────────── */}
            <g transform="translate(430 44)">
                {Array.from({length: 9}, (_, i) => (
                    <rect
                        key={`grille-${i}`}
                        x="0"
                        y={i * 10}
                        width="86"
                        height="5"
                        rx="2.5"
                        fill="var(--rig-grille)"
                    />
                ))}
            </g>

            {/* ── Індикатори ─────────────────────────────────────── */}
            <g transform="translate(432 150)">
                <circle cx="8" cy="8" r="7.5" fill="var(--rig-knob-ring)" />
                <circle cx="8" cy="8" r="6" className={styles.ledTx} filter="url(#rigGlow)" />
                <text x="22" y="12" className={styles.ledLabel}>
                    TX
                </text>
                <circle cx="8" cy="34" r="7.5" fill="var(--rig-knob-ring)" />
                <circle cx="8" cy="34" r="6" className={styles.ledRx} filter="url(#rigGlow)" />
                <text x="22" y="38" className={styles.ledLabel}>
                    RX
                </text>
            </g>

            {/* ── Ручка налаштування (VFO) ───────────────────────── */}
            <g transform="translate(620 130)">
                <circle r="84" fill="var(--rig-knob-ring)" />
                <circle r="72" fill="url(#rigKnob)" stroke="var(--rig-edge)" strokeWidth="2" />
                {/* Насічки повертаються разом із «підстроюванням» */}
                <g className={styles.knobSpin}>
                    {Array.from({length: 36}, (_, i) => (
                        <rect
                            key={`notch-${i}`}
                            x="-1.6"
                            y="-72"
                            width="3.2"
                            height="12"
                            rx="1.6"
                            fill="var(--rig-knob-notch)"
                            transform={`rotate(${i * 10})`}
                        />
                    ))}
                </g>
                <circle r="46" fill="var(--rig-knob-dark)" />
                <circle r="44" fill="url(#rigKnob)" />
                <circle
                    className={styles.knobDimple}
                    cx="0"
                    cy="-26"
                    r="9"
                    fill="var(--rig-knob-ring)"
                />
                {/* Відблиск лежить поверх і не обертається */}
                <circle r="72" fill="url(#rigKnobGloss)" pointerEvents="none" />
            </g>

            {/* ── Малі ручки ─────────────────────────────────────── */}
            {[
                {x: 452, y: 232, label: 'AF', angle: -38},
                {x: 516, y: 232, label: 'RF', angle: 14},
                {x: 580, y: 232, label: 'MIC', angle: -12},
            ].map(({x, y, label, angle}) => (
                <g key={label} transform={`translate(${x} ${y})`}>
                    <circle r="23" fill="var(--rig-knob-ring)" />
                    <circle r="21" fill="url(#rigKnob)" />
                    <line
                        x1="0"
                        y1="-4"
                        x2="0"
                        y2="-15"
                        stroke="var(--rig-knob-notch)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        transform={`rotate(${angle})`}
                    />
                    <circle r="21" fill="url(#rigKnobGloss)" />
                    <text y="38" textAnchor="middle" className={styles.knobLabel}>
                        {label}
                    </text>
                </g>
            ))}

            {/* ── Кнопки діапазонів ──────────────────────────────── */}
            <g transform="translate(44 234)">
                {['160', '80', '40', '20', '15', '10'].map((band, i) => (
                    <g key={band} transform={`translate(${i * 60} 0)`}>
                        <rect
                            width="52"
                            height="26"
                            rx="5"
                            className={band === '20' ? styles.bandActive : styles.band}
                        />
                        <text x="26" y="18" textAnchor="middle" className={styles.bandLabel}>
                            {band}
                        </text>
                    </g>
                ))}
            </g>
            </g>
            </g>

            {/* Розшифровка як частина панелі: лежить над корпусом рига з
                невеликим відступом і не піднімається вище антени */}
            <text
                x="450"
                y="142"
                textAnchor="middle"
                className={styles.rigTagline}>
                UKRAINIAN AMATEUR RADIO OPERATORS
            </text>
        </svg>
    );
}
