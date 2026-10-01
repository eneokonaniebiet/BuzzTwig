import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class ApiException implements Exception {
  final int status;
  final String message;
  ApiException(this.status,this.message);
  @override String toString()=>message;
}

class ApiClient {
  final http.Client _client;
  String? accessToken;
  ApiClient({http.Client? client}):_client=client??http.Client();

  Future<dynamic> request(String method,String path,{Object? body,bool auth=true}) async {
    final headers=<String,String>{'content-type':'application/json'};
    if(auth && accessToken!=null) headers['authorization']='Bearer $accessToken';
    final uri=Uri.parse('${AppConfig.apiBaseUrl}$path');
    final req=http.Request(method,uri)..headers.addAll(headers)..body=jsonEncode(body??{});
    final response=await _client.send(req);
    final text=await response.stream.bytesToString();
    dynamic decoded;
    if(text.isNotEmpty){try{decoded=jsonDecode(text);}catch(_){decoded=text;}}
    if(response.statusCode>=400) throw ApiException(response.statusCode,(decoded is Map?decoded['error']:null)?.toString()??'Request failed');
    return decoded;
  }
}
