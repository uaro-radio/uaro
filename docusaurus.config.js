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
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
  },

  plugins: [
    'plugin-image-zoom'
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
          src: 'img/uaro.jpg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Корисні матеріали',
          },
          {to: '/docs/tutorial-for-beginners', label: 'Довідник початківця', position: 'left'},
          {to: '/blog', label: 'Новини', position: 'left'},
          {to: '/about', label: 'Про нас', position: 'left'},
          {to: '/charter', label: 'Статут організації', position: 'left'},
          {to: '/partners', label: 'Партнерські програми', position: 'left'},
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
        links: [
          {
            title: 'Інше',
            items: [
              {
                label: 'Корисні матеріали',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Спільнота',
            items: [
            //   {
            //     label: 'Stack Overflow',
            //     href: 'https://github.com/uaro-radio',
            //   },
            //   {
            //     label: 'Discord',
            //     href: 'https://github.com/uaro-radio',
            //   },
              {
                label: 'Telegram',
                href: 'https://t.me/Ukraine_Amateur_Radio_Operators',
              },
            ],
          },
          {
            title: 'Цікаве',
            items: [
              {
                label: 'Новини',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/uaro-radio',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Ukrainian Amateur Radio Operators.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
