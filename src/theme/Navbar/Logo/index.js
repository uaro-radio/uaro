import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import UaroLogo from '@site/src/components/UaroLogo';

// У меню замість напису «UARO» — компактний логотип: емблема й слово з
// вежею замість «A». Повний варіант з розшифровкою — у шапці головної.
export default function NavbarLogo() {
  return (
    <Link to={useBaseUrl('/')} className="navbar__brand" style={{fontSize: 13}} aria-label="UARO">
      <UaroLogo />
    </Link>
  );
}
