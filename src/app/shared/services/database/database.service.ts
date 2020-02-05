import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  private database: SQLiteObject;

  constructor(private sqlite: SQLite) { 
    this.sqlite.create({name: "data.db", location: "default"}).then((db : SQLiteObject) => {
        this.database = db;
    }, (error: any) => {
        console.log("ERROR: ", error);
    });     
  }
}