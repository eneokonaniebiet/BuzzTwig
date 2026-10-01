import '../../core/network/api_client.dart';
import 'chat_models.dart';
class ChatRepository {
  final ApiClient api; ChatRepository(this.api);
  Future<List<ChatRoom>> rooms() async {final data=await api.request('GET','/v1/rooms') as List;return data.map((e)=>ChatRoom.fromJson(Map<String,dynamic>.from(e))).toList();}
  Future<String> createDirect(String participantId) async {final data=Map<String,dynamic>.from(await api.request('POST','/v1/rooms',body:{'roomType':'DIRECT','participantIds':[participantId]}));return data['id'];}
}
