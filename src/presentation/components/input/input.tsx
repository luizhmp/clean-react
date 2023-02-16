import React, { useContext } from 'react';
import { FormContext } from '@/presentation/contexts';
import Styles from './input-styles.scss';
import { InputPropsInterface } from './types';

export function Input({
  ...otherInputProps
}: InputPropsInterface): JSX.Element {
  const { state, setState } = useContext(FormContext);
  const error = state[`${otherInputProps.name}Error`];

  function handleChange(event: React.FocusEvent<HTMLInputElement>): void {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  function getStatus(): string {
    if (error) {
      return '🔴';
    }
    return '🟢';
  }

  function getTitle(): string {
    if (error) {
      return error;
    }
    return 'Tudo certo!';
  }

  return (
    <div className={Styles.inputWrap}>
      <input
        {...otherInputProps}
        data-testid={otherInputProps.name}
        autoComplete="off"
        onChange={handleChange}
      />
      <span
        data-testid={`${otherInputProps.name}-status`}
        title={getTitle()}
        className={Styles.status}
      >
        {getStatus()}
      </span>
    </div>
  );
}
