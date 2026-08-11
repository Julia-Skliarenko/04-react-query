import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/moviesApi';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

const ReactPaginate = (ReactPaginateModule as unknown as { default: typeof ReactPaginateModule }).default || ReactPaginateModule;

export default function App() {
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

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearchSubmit} />

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

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {data?.results && <MovieGrid movies={data.results} />}
      </div>
    </div>
  );
}