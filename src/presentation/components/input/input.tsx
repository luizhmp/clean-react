import React, { useContext } from 'react';
import { FormContext } from '@/presentation/contexts';
import Styles from './input-styles.scss';
import { InputPropsInterface } from './types';

export function Input({
  name,
  ...otherInputProps
}: InputPropsInterface): JSX.Element {
  const { errorState } = useContext(FormContext);
  const error = errorState[name];

  function getStatus(): string {
    return '🔴';
  }

  function getTitle(): string {
    return error;
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...otherInputProps} autoComplete="off" />
      <span
        data-testid={`${name}-status`}
        title={getTitle()}
        className={Styles.status}
      >
        {getStatus()}
      </span>
    </div>
  );
}
