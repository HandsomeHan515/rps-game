import { RoomType } from '../types';

export function getRoomList<T> (): Promise<T> {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:9001/room/list').then(response => {
      resolve(response.json());
    }).catch(err => {
      reject(err);
    });
  });
}


export function addRoom<T> (params: RoomType): Promise<T> {
  console.log('params', params);

  return new Promise((resolve, reject) => {
    fetch('http://localhost:9001/room/addRoom', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(response => {
      resolve(response.json());
    }).catch(err => {
      reject(err);
    });
  });
}
