import { RoomType } from '../types';
export const BASE_URL = 'https://rps-backend-dev.herokuapp.com';

export function getRoomList<T>(): Promise<T> {
	return new Promise((resolve, reject) => {
		fetch(BASE_URL + '/room')
			.then(response => {
				resolve(response.json());
			})
			.catch(err => {
				reject(err);
			});
	});
}

export function addRoom<T>(params: RoomType): Promise<T> {
	return new Promise((resolve, reject) => {
		fetch(BASE_URL + '/room', {
			method: 'post',
			body: JSON.stringify(params),
		})
			.then(response => {
				resolve(response.json());
			})
			.catch(err => {
				reject(err);
			});
	});
}
