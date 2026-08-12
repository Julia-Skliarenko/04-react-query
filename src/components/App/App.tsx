import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../SearchBar/SearchBar';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { MovieModal } from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

// --- Компонент Пагинации (свой, надежный) ---
interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  };

  const buttonStyle = {
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'white',
    margin: '0 2px',
    minWidth: '36px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const activeStyle = { ...buttonStyle, backgroundColor: '#0066cc', color: 'white', borderColor: '#0066cc' };
  const disabledStyle = { ...buttonStyle, opacity: 0.5, cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', margin: '10px 0' }}>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        style={current === 1 ? disabledStyle : buttonStyle}
      >
        ←
      </button>

      {getPageNumbers().map((p, index) => (
        typeof p === 'number' ? (
          <button
            key={index}
            onClick={() => onChange(p)}
            style={current === p ? activeStyle : buttonStyle}
          >
            {p}
          </button>
        ) : (
          <span key={index} style={{ margin: '0 4px' }}>{p}</span>
        )
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        style={current === total ? disabledStyle : buttonStyle}
      >
        →
      </button>
    </div>
  );
}
// --- Конец компонента ---


export function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
  });

  const movies = data?.results || [];

  useEffect(() => {
    if (searchQuery && data && movies.length === 0 && !isLoading) {
      toast.error('No movies found for your request.');
    }
  }, [data, movies.length, searchQuery, isLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Прокрутка вверх при смене страницы, как на TMDB
  };

  return (
    <div>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {/* --- ПАГИНАЦИЯ ТЕПЕРЬ ЗДЕСЬ (ВВЕРХУ) --- */}
      {data && data.total_pages > 1 && (
        <Pagination
          current={page}
          total={data.total_pages}
          onChange={handlePageChange}
        />
      )}

      <main style={{ padding: '20px 0' }}>
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}

        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;