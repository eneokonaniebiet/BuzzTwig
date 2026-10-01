import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../core/session/session_store.dart';
import '../features/auth/auth_controller.dart';
import 'home_shell.dart';
import 'auth_screen.dart';

class BuzzTwigApp extends StatefulWidget{const BuzzTwigApp({super.key});@override State<BuzzTwigApp> createState()=>_BuzzTwigAppState();}
class _BuzzTwigAppState extends State<BuzzTwigApp>{
  final api=ApiClient(); late final AuthController auth; bool loading=true,signedIn=false;
  @override void initState(){super.initState();auth=AuthController(api,SessionStore());_restore();}
  Future<void> _restore() async {signedIn=await auth.restore();if(mounted)setState(()=>loading=false);}
  @override Widget build(BuildContext context)=>MaterialApp(title:'BuzzTwig',debugShowCheckedModeBanner:false,theme:ThemeData(useMaterial3:true,colorSchemeSeed:const Color(0xFFEF6C45)),darkTheme:ThemeData(useMaterial3:true,colorSchemeSeed:const Color(0xFFEF6C45),brightness:Brightness.dark),home:loading?const _Loading():signedIn?HomeShell(api:api,onLogout:(){auth.logout();setState(()=>signedIn=false);}):AuthScreen(auth:auth,onSignedIn:(){setState(()=>signedIn=true);}});
}
class _Loading extends StatelessWidget{const _Loading();@override Widget build(BuildContext c)=>const Scaffold(body:Center(child:CircularProgressIndicator()));}
