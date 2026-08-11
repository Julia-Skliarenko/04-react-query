import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './SearchBar.module.css'; // або твої стилі

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a search query!');
      return;
    }
    onSubmit(input);
  };

  return (
    <header className={css.header}>
      <span className={css.logo}>Powered by TMDB</span>
      <form className={css.form} onSubmit={handleSubmit}>
        <input 
          className={css.input} 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Search movies..."
        />
        <button className={css.button} type="submit">Search</button>
      </form>
    </header>
  );
}