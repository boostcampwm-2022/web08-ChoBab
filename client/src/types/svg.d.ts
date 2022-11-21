declare module '*.svg' {
  import React from 'react';

  // vite-plugin-svgr (svg to ReactComopnent)
  // import { ReactComponent as Logo } from './Logo.svg';
  // <Logo />
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  // import logoPath from './Logo.svg';
  // <img src={logoPath} />
  const src: string;
  export default src;
}
