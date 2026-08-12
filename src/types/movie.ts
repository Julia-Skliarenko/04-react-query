export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

// Добавляем этот интерфейс ниже
export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}