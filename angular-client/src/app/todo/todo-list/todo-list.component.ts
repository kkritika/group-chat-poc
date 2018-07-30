// ./angular-client/src/app/todo/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  rooms:any[] = [];
  defaultRoom:any = {};
  oldRoom:any = {};
  newRoom:any = {};
  user:any = {};
  // todoToEdit:any = {};
  // todoToDelete:any = {};
  // fetchingData:boolean = false;
  // apiMessage:string;
  private socket: io.Socket; 

  private url = 'http://localhost:3001';
  // private socket;

  constructor(private todoService:TodoService) { }

  ngOnInit(): void {
    this.socket = io(this.url);
    // console.log(this.socket)
    // Receive Added Todo
    this.socket.on('setup', (data) => {
      this.rooms = data.rooms;
      this.user.id = data.user.id
      this.socket.emit('new user', {user: {id: this.user.id} });
    });

    this.socket.on('user left', (data) => {
      console.log('user left room - '+JSON.stringify(data))
    });

    this.socket.on('user joined', (data) => {
      console.log('user joined room - '+JSON.stringify(data))
      this.oldRoom = data.newRoom
      this.newRoom = data.newRoom
    });






    // //Receive Updated Todo
    // this.socket.on('TodoUpdated', (data) => {
    //   console.log('TodoUpdated: '+JSON.stringify(data));
    //   const updatedTodos = this.todos.map(t => {
    //       if(data.todo._id !== t._id){
    //         return t;
    //       }
    //       return { ...t, ...data.todo };
    //     })
    //     this.apiMessage = data.message;
    //     this.todos = updatedTodos;
    // });
    // //Receive Deleted Todo and remove it from liste
    // this.socket.on('TodoDeleted', (data) => {
    //   console.log('TodoDeleted: '+JSON.stringify(data));
    //   const filteredTodos = this.todos.filter(t => t._id !== data.todo._id);
    //   this.apiMessage = data.message;
    //   this.todos = filteredTodos;
    // });
  }


  switchRoom(room){
    console.log('new room - '+room)
    this.newRoom = room;
    this.socket.emit('switch room', {oldRoom: this.oldRoom, newRoom: this.newRoom})
    this.oldRoom = room;
  }

  sendMessage(user){
      console.log('new message sent')
      console.log(user)
      this.socket.emit('new message', {user:user});

  }
 //  AddTodo(todo:any):void{
 //    // console.log(this.socket)
 //    if(!todo){ return; }
 //    this.todoService.createTodo(todo,this.socket);
 //  }

 //  showEditTodo(todo:any):void{
 //    this.todoToEdit = todo;
 //    this.apiMessage = "";
 //  }

 //  EditTodo(todo:any):void{
 //    if(!todo){ return; }
 //    todo.id = this.todoToEdit._id;
 //    this.todoService.updateTodo(todo,this.socket);
 //  }

 // showDeleteTodo(todo:any):void{
 //   this.todoToDelete = todo;
 //   this.apiMessage = "";
 // }

 // DeleteTodo(todo:any):void{
 //   if(!todo){ return; }
 //   this.todoService.deleteTodo(todo,this.socket);
 // }

}
