import '../../core/network/api_client.dart';
import '../../core/session/session_store.dart';

class AuthController {
  final ApiClient api; final SessionStore sessions;
  AuthController(this.api,this.sessions);

  Future<Map<String,dynamic>> login(String username,String password) async {
    final data=Map<String,dynamic>.from(await api.request('POST','/v1/auth/login',body:{'username':username,'password':password},auth:false));
    await sessions.save(access:data['accessToken'],refresh:data['refreshToken']); api.accessToken=data['accessToken']; return data;
  }

  Future<Map<String,dynamic>> register(String username,String password,String displayName) async {
    final data=Map<String,dynamic>.from(await api.request('POST','/v1/auth/register',body:{'username':username,'password':password,'displayName':displayName},auth:false));
    await sessions.save(access:data['accessToken'],refresh:data['refreshToken']); api.accessToken=data['accessToken']; return data;
  }

  Future<bool> restore() async {
    final token=await sessions.access();
    if(token==null)return false;
    api.accessToken=token;
    try{await api.request('GET','/v1/users/me');return true;}
    catch(_){
      final refresh=await sessions.refresh();
      if(refresh==null)return false;
      try{
        final data=Map<String,dynamic>.from(await api.request('POST','/v1/auth/refresh',body:{'refreshToken':refresh},auth:false));
        await sessions.save(access:data['accessToken'],refresh:data['refreshToken']);
        api.accessToken=data['accessToken'];
        await api.request('GET','/v1/users/me');
        return true;
      }catch(_){await sessions.clear();api.accessToken=null;return false;}
    }
  }

  Future<void> logout() async {
    final refresh=await sessions.refresh();
    if(refresh!=null){try{await api.request('POST','/v1/auth/logout',body:{'refreshToken':refresh},auth:false);}catch(_){}}
    await sessions.clear();api.accessToken=null;
  }
}
