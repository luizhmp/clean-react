import React, { useContext } from 'react';
import Styles from './form-status-styles.scss';
import { Spinner } from '@/presentation/components/spinner';
import { FormContext } from '@/presentation/contexts/form';

export function FormStatus(): JSX.Element {
  const {
    state: { isLoading, mainError },
  } = useContext(FormContext);

  function renderSpinner() {
    if (!isLoading) {
      return null;
    }

    return <Spinner className={Styles.spinner} />;
  }

  function renderError() {
    const hasError = mainError.length > 0;

    if (!hasError) {
      return null;
    }

    return (
      <span data-testid="main-error" className={Styles.error}>
        {mainError}
      </span>
    );
  }

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {renderSpinner()}
      {renderError()}
    </div>
  );
}
