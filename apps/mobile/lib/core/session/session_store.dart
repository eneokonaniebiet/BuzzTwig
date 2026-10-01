import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SessionStore {
  static const _access='buzztwig.access';
  static const _refresh='buzztwig.refresh';
  final FlutterSecureStorage _storage=const FlutterSecureStorage();
  Future<void> save({required String access,required String refresh}) async {await _storage.write(key:_access,value:access);await _storage.write(key:_refresh,value:refresh);}
  Future<String?> access()=>_storage.read(key:_access);
  Future<String?> refresh()=>_storage.read(key:_refresh);
  Future<void> clear() async {await _storage.delete(key:_access);await _storage.delete(key:_refresh);}
}
