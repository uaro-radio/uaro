import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import s from './styles.module.css';

// Логотип UARO, перенесений з блогу CyberDevSpace (src/components/Lockups/Uaro.js):
// емблема, риска акценту й слово, де літеру «A» замінює ґратчаста вежа з
// хвилями. Компактний варіант — для меню, повний (full) з розшифровкою
// абревіатури — для шапки головної. Розміри в em, тож увесь
// логотип масштабується одним font-size на корені (className).
export default function UaroLogo({full = false, className}) {
  return (
    <span className={clsx(s.brand, full && s.full, className)}>
      <img className={s.mark} src={useBaseUrl('/img/new_logo.png')} alt="" />
      <span className={s.text} aria-hidden="true">
        <span className={s.title}>
          <span className={s.word}>
            U
            <svg className={s.glyph} viewBox="0 0 44 100" overflow="visible" focusable="false">
              <g className={s.waves} fill="none" strokeLinecap="round">
                <path className={s.wave} d="M4 3a21 21 0 0 1 36 0" />
                <path className={clsx(s.wave, s.wave2)} d="M-8 -4a36 36 0 0 1 60 0" />
              </g>
              <g className={s.tower} fill="none" strokeLinejoin="round">
                <path d="M22 14v8M18.5 22 4 100M25.5 22 40 100M10.7 64h22.6" strokeWidth="6" />
                <path
                  d="M18.5 22h7M15.2 40h13.6M7 84h30M18.5 22l10.3 18H15.2l18.1 24M25.5 22l-10.3 18M28.8 40l-18.1 24M10.7 64l26.3 20M33.3 64l-26.3 20"
                  strokeWidth="2.6"
                />
              </g>
              <circle className={s.ball} cx="22" cy="10" r="5.5" />
            </svg>
            RO
          </span>
          {full && (
            <span className={s.lines}>
              <span>Ukrainian Amateur</span>
              <span className={s.accent}>Radio Operators</span>
            </span>
          )}
        </span>
      </span>
    </span>
  );
}
