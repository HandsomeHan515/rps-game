import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addRoom, getRoomList } from '../api';
import { RoomType, AddRoomResType } from '../types';

export default function Game() {
	const [list, setList] = useState<RoomType[]>([]);

	useEffect(() => {
		getRoomList<RoomType[]>().then(res => {
			setList(res);
		});
	}, []);

	// 添加房间后需要通知其他用户更新列表
	function handleAdd() {
		const text = prompt('请输入房间名称！！！');
		if (!text) return;

		addRoom<AddRoomResType>({ name: text }).then(res => {
			if (res.success) {
				getRoomList<RoomType[]>().then(res => {
					setList(res);
				});
			}
		});
	}

	return (
		<div className="game-container">
			<div className="game-operation">
				<button onClick={handleAdd}>新建房间</button>
			</div>
			<ul>
				{list.map(item => {
					return (
						<li key={item.id}>
							<Link to={`/room/${item.id}/user/${new Date().getTime()}`}>
								<div className="game">{item.name}</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
