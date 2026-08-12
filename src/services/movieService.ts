import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (searchQuery: string, page: number): Promise<MoviesResponse> => {
  const response = await apiClient.get<MoviesResponse>('/search/movie', {
    params: {
      query: searchQuery,
      page,
    },
  });
  return response.data;
};