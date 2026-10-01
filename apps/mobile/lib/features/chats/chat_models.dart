class ChatRoom {
  final String id,type; final String? title;
  ChatRoom({required this.id,required this.type,this.title});
  factory ChatRoom.fromJson(Map<String,dynamic> j)=>ChatRoom(id:j['id'],type:j['room_type'],title:j['title']);
}
