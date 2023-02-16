import React from 'react';
import Styles from './spinner-styles.scss';
import { SpinnerPropsInterface } from './types';

export function Spinner({ className }: SpinnerPropsInterface): JSX.Element {
  return (
    <div
      data-testid="spinner"
      className={[Styles.spinner, className].join(' ')}
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
