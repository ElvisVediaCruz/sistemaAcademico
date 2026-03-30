import axiosClient from './axiosClient';

export const login = (username, password) =>
  axiosClient.post('/', { username, password });
