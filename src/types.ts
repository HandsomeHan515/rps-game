export interface RoomType {
	id?: number;
	name: string;
}

export interface AddRoomResType {
	success: boolean;
}

export interface SocketActionType {
	[key: string]: string;
}

export interface SocketResultType {
	userId: string;
	gameType: string;
}
