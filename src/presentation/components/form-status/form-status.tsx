import React from 'react';
import Styles from './form-status-styles.scss';
import { Spinner } from '@/presentation/components/spinner';

export function FormStatus(): JSX.Element {
  return (
    <div className={Styles.errorWrap}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Erro</span>
    </div>
  );
}
