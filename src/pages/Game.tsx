import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addRoom, getRoomList } from '../api';
import { RoomType, GetRoomListResType, AddRoomResType } from '../types';

const userId = new Date().getTime();

export default function Game () {
  const [list, setList] = useState<RoomType[]>([]);

  useEffect(() => {
    getRoomList<GetRoomListResType>().then(res => {
      if (res.success) {
        setList(res.data);
      }
    });
  }, []);

  function handleAdd () {
    const text = prompt('请输入房间名称！！！');
    if (!text) return;

    addRoom<AddRoomResType>({ text }).then(res => {
      if (res.success) {
        setList([
          ...list,
          {
            id: res.data[0],
            text,
          }
        ]);
      }
    });
  }

  return (
    <div className='game-container'>
      <div className='game-operation'>
        <button onClick={handleAdd}>新建房间</button>
      </div>
      <ul>
        {
          list.map((item) => {
            return (
              <li key={item.id} >
                <Link to={`/room/${item.id}/user/${userId}`}>
                  <div className='game' >
                    {item.text}
                  </div>
                </Link>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}
