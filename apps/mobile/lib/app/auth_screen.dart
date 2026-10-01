import 'package:flutter/material.dart';
import '../features/auth/auth_controller.dart';

class AuthScreen extends StatefulWidget{final AuthController auth;final VoidCallback onSignedIn;const AuthScreen({super.key,required this.auth,required this.onSignedIn});@override State<AuthScreen> createState()=>_AuthScreenState();}
class _AuthScreenState extends State<AuthScreen>{
  final user=TextEditingController(),pass=TextEditingController(),name=TextEditingController();bool register=false,busy=false;String? error;
  Future<void> submit() async {setState(()=>busy=true);try{if(register)await widget.auth.register(user.text,pass.text,name.text);else await widget.auth.login(user.text,pass.text);widget.onSignedIn();}catch(e){if(mounted)setState(()=>error=e.toString());}finally{if(mounted)setState(()=>busy=false);}}
  @override Widget build(BuildContext c)=>Scaffold(body:SafeArea(child:Center(child:SingleChildScrollView(padding:const EdgeInsets.all(28),child:ConstrainedBox(constraints:const BoxConstraints(maxWidth:460),child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[
    Text('BuzzTwig',style:Theme.of(c).textTheme.displaySmall?.copyWith(fontWeight:FontWeight.w800)),const SizedBox(height:8),Text(register?'Create your account':'Welcome back',style:Theme.of(c).textTheme.titleMedium),const SizedBox(height:32),
    if(register)TextField(controller:name,decoration:const InputDecoration(labelText:'Display name',border:OutlineInputBorder())),if(register)const SizedBox(height:12),
    TextField(controller:user,decoration:const InputDecoration(labelText:'Username',prefixText:'@',border:OutlineInputBorder())),const SizedBox(height:12),
    TextField(controller:pass,obscureText:true,decoration:const InputDecoration(labelText:'Password',border:OutlineInputBorder())),
    if(error!=null)Padding(padding:const EdgeInsets.only(top:12),child:Text(error!,style:TextStyle(color:Theme.of(c).colorScheme.error))),
    const SizedBox(height:20),FilledButton(onPressed:busy?null:submit,child:Padding(padding:const EdgeInsets.all(14),child:Text(busy?'Please wait…':register?'Create account':'Sign in'))),
    TextButton(onPressed:busy?null:()=>setState(()=>register=!register),child:Text(register?'Already have an account? Sign in':'New to BuzzTwig? Create an account')),
  ])))));
}
