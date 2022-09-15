import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { SocketActionType, SocketResultType } from '../types';

const url = 'ws://localhost:9001';
const socket = io(url, { transports: ['websocket']});

export default function Room () {
  const { roomId: room, userId: user } = useParams();
  const navigate = useNavigate();

  const [isFull, setIsFull] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [playerOne, setPlayOne] = useState<string>('');
  const [playerTwo, setPlayerTwo] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const [rpsMap] = useState<SocketActionType>({
    'rock': '石头',
    'scissors': '剪刀',
    'paper': '布'
  });

  // https://socket.io/how-to/use-with-react-hooks
  // the 2nd argument of the useEffect() method must be [], or else the hook will be triggered every time a new message arrives
  useEffect(() => {
    socket.on('connect', () => {
      console.log('client connect');
    });

    socket.on('disconnect', () => {
      console.log('client disconnect');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      // leave room
      socket.emit('leave', room);
    };
  }, []);

  // join room
  useEffect(() => {
    console.log('join room');
    socket.emit('join', room);
  }, []);

  // room is full, exit
  useEffect(() => {
    socket.on('room full', () => {
      setIsFull(true);
      setTimeout(() => { navigate(-1);  }, 1000);
    });

    return () => {
      socket.off('room full');
    };
  }, []);

  //start game
  useEffect(() => {
    socket.on('start play', () => {
      console.log('Start Game');
      setIsPlay(true);
    });

    return () => {
      socket.off('start play');
    };
  }, []);

  // cancel game
  useEffect(() => {
    socket.on('cancel play', room => {
      console.log('Cancel Game', room);
      setIsPlay(false);
      setPlayOne('');
      setPlayerTwo('');
      setResult('');
    });

    return () => {
      socket.off('cancel play');
    };
  }, []);

  // complete game
  useEffect(() => {
    socket.on('complete play', (data: SocketResultType) => {
      const { room, users } = data;
      console.log('complete play', room, users);
      // calculate game result
      calculateGameResult(users);
    });

    return () => {
      socket.off('complete play');
    };
  }, []);

  function handleClick (type: string) {
    // select one
    socket.emit('select', { type, room, user });
    // screen display
    setPlayOne(type);
  }

  function calculateGameResult (users: SocketActionType)  {
    // get other player
    const other =  Object.keys(users).find(u => u !== user);
    console.log('other', other);

    if (other) {
      setPlayerTwo(users[other]);
    }

    let result = '';
    if (user && other) {
      if (users[user] === users[other]) {
        result = '平局';
      } else {
        // set of wins
        const wins =[['paper', 'rock'], ['rock', 'scissors'], ['scissors', 'paper']];
        for (let i = 0; i < wins.length; i++) {
          const [a, b] = wins[i];
          if (users[user] === a && users[other] === b) {
            result = 'I Win';
            break;
          } else {
            result = 'You Win';
          }
        }
      }
    }

    setResult(result);
    setIsPlay(false);
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
