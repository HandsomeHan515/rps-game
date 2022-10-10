import { RoomType } from '../types';
import axios from 'axios';
export const BASE_URL = 'https://rps-backend-dev.herokuapp.com';
// export const BASE_URL = 'http://localhost:9001';

export function getRoomList() {
	return axios.get(BASE_URL + '/room').then(res => res.data);
}

export function addRoom(params: RoomType) {
	return axios.post(BASE_URL + '/room', params).then(res => res.data);
}
