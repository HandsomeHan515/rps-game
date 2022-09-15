import React from 'react';

export default function NotFound () {
  return (
    <div className='not-found-container'>
      <div className='not-found-box'>
        <div className='not-found-box-number'>4</div>
        <div className='not-found-box-circle' />
        <div className='not-found-box-number'>4</div>
      </div>
      <div className='not-found-warning'>当前页面不存在...</div>
    </div>
  );
}
