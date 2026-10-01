import '../../core/network/api_client.dart';
class ProfileRepository {
  final ApiClient api; ProfileRepository(this.api);
  Future<Map<String,dynamic>> me()=>api.request('GET','/v1/users/me').then((v)=>Map<String,dynamic>.from(v));
  Future<Map<String,dynamic>> update({String? displayName,String? bio,String? avatarUrl}) async {final body=<String,dynamic>{};if(displayName!=null)body['displayName']=displayName;if(bio!=null)body['bio']=bio;if(avatarUrl!=null)body['avatarUrl']=avatarUrl;return Map<String,dynamic>.from(await api.request('PATCH','/v1/users/me',body:body));}
}
