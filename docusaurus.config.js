// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'UARO',
  tagline: 'Ukrainian Amateur Radio Operators',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://uaro.org.ua',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'UARO', // Usually your GitHub org/user name.
  projectName: 'uaro', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en'],
    localeConfigs: {
      uk: {
        label: '🇺🇦 Українська',
        htmlLang: 'uk-UA',
      },
      en: {
        label: '🇬🇧 English',
        htmlLang: 'en-US',
      },
    },
  },

  plugins: [
    'plugin-image-zoom',
    // Останні новини для головної сторінки: плагін блогу глобальних даних
    // не віддає, тому збираємо їх самі на етапі збірки.
    ['./plugins/recent-posts', {count: 4}],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/uaro-social-card-black-transparent.jpg',
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          background: 'rgba(0,0,0,0.71)',
          scrollOffset: 0,
        },
      },
      navbar: {
        title: 'UARO',
        logo: {
          alt: 'UARO',
          src: 'img/new_logo.png',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Корисні матеріали',
          // },
          // Дев'ять пунктів поспіль переносились на другий рядок уже на
          // 1440px, а перемикач мов забрав іще місця — тому споріднені
          // розділи згорнуто у два випадні меню.
          {to: '/docs/tutorial-for-beginners', label: 'Довідник', position: 'left'},
          {
            type: 'dropdown',
            label: 'Матеріали',
            position: 'left',
            items: [
              {to: '/docs/calculators', label: 'Калькулятори'},
              {to: '/docs/authors_materials', label: 'Авторські матеріали'},
              {to: '/our_tutorials', label: 'Посібники'},
            ],
          },
          {
            type: 'dropdown',
            label: 'Організація',
            position: 'left',
            items: [
              {to: '/about', label: 'Про нас'},
              {to: '/charter', label: 'Документи'},
              {to: '/membership', label: 'Вступ до ЮАРО'},
              {to: '/awards', label: 'Відзнаки'},
              {to: '/contacts', label: 'Контакти'},
            ],
          },
          {to: '/blog', label: 'Новини', position: 'left'},
          {
            href: 'https://github.com/uaro-radio',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        // Компактний футер: колонки посилань дублювали навбар і головну,
        // тож лишаємо лише стрічку копірайту з кредитом розробника.
        copyright: `Copyright © ${new Date().getFullYear()} ГО "ЮАРО" | Розробка сайту: <a href="https://cyberdev.space" target="_blank" rel="noopener noreferrer">UR3PKI | CyberDevSpace</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
