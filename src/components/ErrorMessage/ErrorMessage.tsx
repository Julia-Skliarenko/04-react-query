import type { FC } from 'react';
import css from './ErrorMessage.module.css';

export const ErrorMessage: FC = () => {
  return <p className={css.text}>There was an error, please try again...</p>;
};