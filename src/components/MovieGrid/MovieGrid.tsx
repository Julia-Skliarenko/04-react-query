import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className={css.list}>
      {movies.map((movie) => (
        <li className={css.item} key={movie.id}>
          <div className={css.imageWrapper}>
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className={css.image}
              />
            ) : (
              <div className={css.noImage}>No Image</div>
            )}
          </div>
          <p className={css.movieTitle}>{movie.title}</p>
        </li>
      ))}
    </ul>
  );
}