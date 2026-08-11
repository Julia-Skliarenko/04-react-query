export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}