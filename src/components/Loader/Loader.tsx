import type { FC } from 'react';
import css from './Loader.module.css';

export const Loader: FC = () => {
  return <p className={css.text}>Loading movies, please wait...</p>;
};