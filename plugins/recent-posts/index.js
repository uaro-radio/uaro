const fs = require('fs/promises');
const path = require('path');
const {
    parseMarkdownFile,
    DEFAULT_PARSE_FRONT_MATTER,
} = require('@docusaurus/utils');

// Плагін блогу не віддає глобальних даних, тож останні новини для головної
// сторінки збираємо самі: читаємо blog/ на етапі збірки і кладемо коротку
// вижимку у global data.
//
// Збірка запускається окремо для кожної локалі, тому для неукраїнської версії
// беремо переклад із i18n/<locale>/docusaurus-plugin-content-blog/, а якщо
// конкретний пост ще не перекладено — лишаємо оригінал, як це робить і сам
// плагін блогу.

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Пост — або `YYYY-MM-DD-slug.md(x)`, або тека `YYYY-MM-DD-slug/index.md(x)`.
async function collectPostFiles(blogDir) {
    const entries = await fs.readdir(blogDir, {withFileTypes: true});
    const files = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            for (const indexName of ['index.md', 'index.mdx']) {
                const indexPath = path.join(blogDir, entry.name, indexName);
                if (await exists(indexPath)) {
                    files.push({
                        name: entry.name,
                        relativePath: path.join(entry.name, indexName),
                    });
                    break;
                }
            }
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            files.push({
                name: entry.name.replace(/\.mdx?$/, ''),
                relativePath: entry.name,
            });
        }
    }

    return files;
}

// Прибираємо markdown-розмітку, щоб отримати чистий рядок для анонсу.
function toPlainText(markdown) {
    return markdown
        .replace(/^import\s.+$/gm, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/[*_>#|-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function truncate(text, limit) {
    if (text.length <= limit) {
        return text;
    }
    const cut = text.slice(0, limit);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

module.exports = function recentPostsPlugin(context, options) {
    const {blogDir = 'blog', count = 4, excerptLength = 130} = options ?? {};

    return {
        name: 'recent-posts',

        async contentLoaded({actions}) {
            const sourceDir = path.resolve(context.siteDir, blogDir);
            const {currentLocale, defaultLocale, path: i18nPath} = context.i18n;
            // Тека з перекладами постів для поточної локалі; для типової — немає.
            const localizedDir =
                currentLocale === defaultLocale
                    ? null
                    : path.resolve(
                          context.siteDir,
                          i18nPath,
                          currentLocale,
                          'docusaurus-plugin-content-blog',
                      );

            const files = await collectPostFiles(sourceDir);

            const posts = [];
            for (const {name, relativePath} of files) {
                const match = DATE_PREFIX.exec(name);
                if (!match) {
                    continue;
                }
                const [, year, month, day, nameSlug] = match;

                // Переклад, якщо є; інакше оригінал.
                let filePath = path.join(sourceDir, relativePath);
                if (localizedDir) {
                    const translated = path.join(localizedDir, relativePath);
                    if (await exists(translated)) {
                        filePath = translated;
                    }
                }

                const fileContent = await fs.readFile(filePath, 'utf8');
                const {frontMatter, content} = await parseMarkdownFile({
                    filePath,
                    fileContent,
                    parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
                });

                if (frontMatter.draft || frontMatter.unlisted) {
                    continue;
                }

                // Slug задає лише оригінал: переклад живе за тією самою адресою.
                const slug = frontMatter.slug ?? nameSlug;
                // Опис беремо з frontMatter, інакше — з тексту до <!--truncate-->.
                const body = content.split(/<!--\s*truncate\s*-->/)[0];
                const excerpt =
                    frontMatter.description ??
                    truncate(toPlainText(body), excerptLength);

                posts.push({
                    title: frontMatter.title ?? nameSlug,
                    permalink: `/blog/${String(slug).replace(/^\/+/, '')}`,
                    date: `${year}-${month}-${day}`,
                    excerpt,
                });
            }

            posts.sort((a, b) => b.date.localeCompare(a.date));
            actions.setGlobalData({posts: posts.slice(0, count)});
        },
    };
};
