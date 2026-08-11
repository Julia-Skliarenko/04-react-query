import axios from 'axios';
import type { MoviesResponse } from '../types/movie';

const API_KEY = '955dad1e7382dc291ad52a01b8e57e8f';

export const fetchMovies = async (searchQuery: string, page: number): Promise<MoviesResponse | null> => {
  if (!searchQuery) return null;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`;
  const response = await axios.get<MoviesResponse>(url);
  return response.data;
};