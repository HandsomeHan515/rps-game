export interface RoomType {
  id?: string | number,
  text: string
}

export interface GetRoomListResType {
  success: boolean,
  data:  RoomType[]
}

export interface AddRoomResType {
  success: boolean,
  data: Array<number | string>
}


export interface SocketActionType {
  [key: string]: string
}

export interface SocketResultType {
  room: string,
  users: SocketActionType,
}

