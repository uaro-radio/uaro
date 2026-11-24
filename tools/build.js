/**
 * Збирає сайт для продакшну (`npm run build:prod`, його запускає GitHub
 * Actions): кожну мову окремим процесом, усі одночасно. Локальний
 * `npm run build` лишається звичайним `docusaurus build`.
 *
 * `docusaurus build` без `--locale` збирає мови по черзі в одному процесі, а
 * на раннері GitHub Actions чотири ядра.
 *
 * Спільного в одночасних збірок бути не може:
 *   - теку зі згенерованим кодом (`.docusaurus/`) кожна пише свою
 *     (`DOCUSAURUS_GENERATED_FILES_DIR_NAME`): зі спільною одна мова
 *     перезаписувала б маршрути й переклади посеред збирання іншої;
 *   - теку збірки теж свою, бо збірка основної мови очищає свою теку цілком.
 * Кеш збірки мови й так не ділять: мова є в його назві (у Rspack — у версії).
 *
 * Наприкінці все складається в `build/`: основна мова в корінь, решта — у
 * `build/<мова>/`, як і за звичайної збірки. Список мов — з
 * docusaurus.config.js, тож нова локаль потрапить у збірку сама.
 */
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
// Конфіг — ES-модуль. Docusaurus читає його своїм завантажувачем, ним же
// читаємо й тут, щоб Node не скаржився на модуль без "type".
const {loadFreshModule} = require('@docusaurus/utils');

const root = path.resolve(__dirname, '..');
const cli = require.resolve('@docusaurus/core/bin/docusaurus.mjs');
const OUT = path.join(root, 'build');
const PARTS = path.join(root, '.build-locales');
const children = [];

function buildLocale(locale) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            process.execPath,
            [cli, 'build', '--locale', locale, '--out-dir', path.join(PARTS, locale)],
            {
                stdio: 'inherit',
                cwd: root,
                env: {...process.env, DOCUSAURUS_GENERATED_FILES_DIR_NAME: `.docusaurus-${locale}`},
            },
        );
        children.push(child);
        child.on('exit', (code, signal) => {
            if (code === 0) resolve();
            else reject(new Error(`локаль ${locale}: ${signal ? `перервано сигналом ${signal}` : `код ${code}`}`));
        });
    });
}

async function main() {
    const config = await loadFreshModule(path.join(root, 'docusaurus.config.js'));
    const {i18n} = config.default ?? config;

    fs.rmSync(PARTS, {recursive: true, force: true});
    await Promise.all(i18n.locales.map(buildLocale));

    // Збірка не основної мови з явним baseUrl кладе її в <теку>/<мова>/.
    fs.rmSync(OUT, {recursive: true, force: true});
    fs.renameSync(path.join(PARTS, i18n.defaultLocale), OUT);
    for (const locale of i18n.locales.filter((l) => l !== i18n.defaultLocale)) {
        fs.renameSync(path.join(PARTS, locale, locale), path.join(OUT, locale));
    }
    fs.rmSync(PARTS, {recursive: true, force: true});
}

main().catch((error) => {
    // Одна мова впала — решту зупиняємо, а не лишаємо працювати сиротами.
    children.forEach((child) => child.exitCode === null && child.kill());
    console.error(`[build] ${error.message}`);
    process.exit(1);
});
