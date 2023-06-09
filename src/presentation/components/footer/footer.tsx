import React, { memo } from 'react';
import Styles from './footer-styles.scss';

function MemoizedFooter(): JSX.Element {
  return <footer className={Styles.footer} />;
}

export const Footer = memo(MemoizedFooter);
