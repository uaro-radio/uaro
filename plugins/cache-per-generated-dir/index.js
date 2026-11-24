/**
 * Додає до назви (у Rspack — до версії) кешу збірки теку зі згенерованим кодом.
 *
 * tools/build.js збирає мови паралельно, і кожна пише згенерований код
 * (маршрути, переклади) у свою теку: `.docusaurus-uk`, `.docusaurus-en`.
 * Docusaurus підставляє її через псевдонім `@generated`, а webpack не скидає
 * постійний кеш, коли змінюється псевдонім (webpack/webpack#13627), і версія
 * кешу Docusaurus цей псевдонім теж не враховує. На cyberdev.space без цього
 * збірка брала маршрути з кешу, заповненого з іншої теки, і в українську
 * версію потрапляли англійські сторінки.
 *
 * Тому тека — у назві кешу: у кожної свій кеш, і з кешем звичайної збірки
 * (`.docusaurus`) він не змішується.
 */
const GENERATED_DIR = process.env.DOCUSAURUS_GENERATED_FILES_DIR_NAME ?? '.docusaurus';

module.exports = function cachePerGeneratedDirPlugin() {
    return {
        name: 'cache-per-generated-dir',
        configureWebpack(config) {
            // Rspack (Docusaurus Faster): назви кешу немає, лише версія.
            const rspackCache = config.experiments && config.experiments.cache;
            if (rspackCache && typeof rspackCache === 'object' && rspackCache.version) {
                return {experiments: {cache: {version: `${rspackCache.version}-${GENERATED_DIR}`}}};
            }
            if (!config.cache || typeof config.cache !== 'object' || !config.cache.name) {
                return {};
            }
            return {cache: {name: `${config.cache.name}-${GENERATED_DIR}`}};
        },
    };
};
