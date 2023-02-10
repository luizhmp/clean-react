import React from 'react';
import Styles from './input-styles.scss';
import { InputPropsInterface } from './types';

export function Input(otherInputProps: InputPropsInterface): JSX.Element {
  return (
    <div className={Styles.inputWrap}>
      <input {...otherInputProps} />
      <span className={Styles.status}>🔴</span>
    </div>
  );
}
