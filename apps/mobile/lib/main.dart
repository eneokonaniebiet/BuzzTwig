import 'package:flutter/material.dart';
void main()=>runApp(const BuzzTwigApp());
class BuzzTwigApp extends StatelessWidget{const BuzzTwigApp({super.key});@override Widget build(BuildContext context)=>MaterialApp(title:'BuzzTwig',debugShowCheckedModeBanner:false,theme:ThemeData(useMaterial3:true),home:const Scaffold(body:Center(child:Text('BuzzTwig'))));}
