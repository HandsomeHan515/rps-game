import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { SocketActionType, SocketResultType } from '../types';

const url = 'ws://localhost:9001';

export default function GameRoom () {
  const { roomId: room, userId: user } = useParams();
  const navigate = useNavigate();

  const [isFull, setIsFull] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [playerOne, setPlayOne] = useState<string>('');
  const [playerTwo, setPlayerTwo] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const [rpsMap] = useState<SocketActionType>( {
    'rock': '石头',
    'scissors': '剪刀',
    'paper': '布'
  });

  const socket = io(url, { transports: ['websocket']});

  // https://socket.io/how-to/use-with-react-hooks
  useEffect(() => {
    socket.on('connect', () => {
      console.log('client connect');
    });

    socket.on('disconnect', () => {
      console.log('client disconnect');
    });

    // 进入到某个游戏房间内
    socket.emit('join', { room, user });

    // 开始游戏
    socket.on('start play', () => {
      console.log('人满了，可以开始游戏');
      setIsPlay(true);
    });

    // 某一方退出游戏
    socket.on('cancel play', () => {
      console.log('人不够，不能玩游戏');
      setIsPlay(false);
    });

    // room is full, exit
    socket.on('room full', () => {
      setIsFull(true);
      setTimeout(() => { navigate(-1);  }, 1000);
    });

    // 完成对弈了
    socket.on('complete play', (data: SocketResultType) => {
      const {  room, users } = data;
      console.log('action result', room, users);
      // 设置另一个人的选择结果  计算双方比赛结果

      console.log('complete play');

      claculateResult(users);
    });


    return () => {
      console.log('clean up');

      socket.off('connect');
      socket.off('disconnect');

      socket.off('join');
      socket.off('start play');
      socket.off('cancel play');
      socket.off('complete play');
      socket.off('room full');

      socket.emit('leave', { room, user });
    };
  }, []); // the 2nd argument of the useEffect() method must be [], or else the hook will be triggered every time a new message arrives

  function handleClick (type: string) {
    console.log('click button');


    // 向服务端发送自己选择的类型，服务端接到后向另一个人发送我选择了
    socket.emit('select', { type, room, user });

    // 设置自己选择的结果
    setPlayOne(type);
  }

  function claculateResult (users: SocketActionType)  {

    // 设置另一个人的结果
    const other =  Object.keys(users).find(u => u !== user);
    console.log('other', other);

    if (other) {
      setPlayerTwo(users[other]);
    }

    let result = '';
    // 取胜集合
    if (user && other) {
      if (users[user] === users[other]) {
        result = '平局';
      } else {
        const wins =[['paper', 'rock'], ['rock', 'scissors'], ['scissors', 'paper']];
        for (let i = 0; i < wins.length; i++) {
          const [a, b] = wins[i];
          if (users[user] === a && users[other] === b) {
            result = '我赢了';
            break;
          } else {
            result = '你赢了';
          }
        }
      }

    }

    setResult(result);
    setIsPlay(false);
    // 这一局结束
    socket.emit('next play');
  }

  function renderFull () {
    return <div>房间{room}人满了，请稍后进入。</div>;
  }

  return (
    <div className='room-container'>
      {
        isFull ? renderFull() :
          (
            <div>
              <div className='room-toast'>
                { isPlay ? '点击按钮开始游戏' : ''}
              </div>
              <div className='room-player'>
                <div>
                  <div>我{user}</div>
                  <div>
                    {rpsMap[playerOne]}
                  </div>
                </div>
                {
                  isPlay ? <button>开始游戏</button> : null
                }
                <div>
                  <div>你</div>
                  <div>
                    {rpsMap[playerTwo]}
                  </div>
                </div>
              </div>
              <div className='room'>
                <div className='room-display'>
                  { result }
                </div>
                <div className='room-btn'>
                  <button disabled={!isPlay} onClick={() => handleClick('rock')}>石头</button>
                  <button disabled={!isPlay} onClick={() => handleClick('scissors')}>剪刀</button>
                  <button disabled={!isPlay} onClick={() => handleClick('paper')}>布</button>
                </div>
              </div>
            </div>
          )
      }
    </div>
  );
}
