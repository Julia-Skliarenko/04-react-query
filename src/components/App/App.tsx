import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/moviesApi';
import css from './App.module.css';

const ReactPaginate = (ReactPaginateModule as unknown as { default: typeof ReactPaginateModule }).default || ReactPaginateModule;

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: Boolean(searchQuery),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (data && data.results.length === 0 && searchQuery) {
      toast.error('No movies found for your request.');
    }
  }, [data, searchQuery]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    if (newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query!');
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-center" />
      <header className={css.header}>
        <span className={css.logo}>Powered by TMDB</span>
        <form className={css.form} onSubmit={handleSearchSubmit}>
          <input 
            className={css.input} 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search movies..."
          />
          <button className={css.button} type="submit">Search</button>
        </form>
      </header>

      <div className={css.container}>
        {searchQuery && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
            breakLabel="..."
          />
        )}

        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred</p>}

        <ul className={css.list}>
          {data?.results.map((movie) => (
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
      </div>
    </div>
  );
}