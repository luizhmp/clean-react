import React, { useContext } from 'react';
import Styles from './form-status-styles.scss';
import { Spinner } from '@/presentation/components/spinner';
import { FormContext } from '@/presentation/contexts/form';

export function FormStatus(): JSX.Element {
  const { isLoading, errorMessage } = useContext(FormContext);

  function renderSpinner() {
    if (!isLoading) {
      return null;
    }

    return <Spinner className={Styles.spinner} />;
  }

  function renderError() {
    const hasError = errorMessage.length > 0;

    if (!hasError) {
      return null;
    }

    return <span className={Styles.error}>{errorMessage}</span>;
  }

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {renderSpinner()}
      {renderError()}
    </div>
  );
}
