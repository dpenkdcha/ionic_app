import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import * as DBCONSTANT from '../../constants/database.constant';
import { DatabaseInterFace } from '../../model/database.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  public row_data: any[];

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is("android")) {
        this.sqlite.create({ name: DBCONSTANT.DATABASE_NAME, location: "default" }).then((db: SQLiteObject) => {
          this.database = db;
          this.createTables();
        }, (error: any) => {
          console.error("ERROR: ", error);
        });
      }
    }).catch(error => {
      console.error(error);
    })
  }

  async createTables() {
    try {
      await this.database.executeSql(DBCONSTANT.CREATE_QUERY.USER_TABLE, []);
    } catch (e) {
      console.error("Error !");
    }
  }

  private _filterQueryToArray(response) {
    let data = [];
    for (let i = 0; i < response.rows.length; i++) {
      data.push(response.rows.item(i));
    }
    return data;
  }

  private executeQuery(query: string, parameter: Array<any>): Observable<any> {
    console.log("Query: " + query);
    console.log("Params: " + parameter);
    return new Observable((resolve) => {
      this.database.executeSql(query, parameter)
        .then(
          (res) => {
            console.log('Query Executed!', JSON.stringify(res));
            this.row_data = [];
            if (!!res.rows && res.rows.length > 0) {
              this.row_data = this._filterQueryToArray(res);
            }
            resolve.next({ "status": 200, "data": this.row_data });
          },
          (error) => {
            console.error(error);
            resolve.next({ "status": 500, "data": this.row_data });
          }
        )
    })
  }

  private appendWhereCondition(data: any, query: string) {
    let _where = [];
    if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
      query += (_where.length ? "" : " WHERE ");
      for (let item in data.WHERE.AND) {
        if (!!data.WHERE.AND[item].OR) {
          for (let itemOR in data.WHERE.AND[item].OR) {
            query += (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
            query += (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
            _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
          }
        } else {
          query += (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
          query += (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
          _where.push(data.WHERE.AND[item].VALUE);
        }
      }
    } else if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
      query += (_where.length ? " OR " : " WHERE ");
      for (let item in data.WHERE.OR) {
        if (!!data.WHERE.OR[item].AND) {
          for (let itemAND in data.WHERE.OR[item].AND) {
            query += (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
            query += (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
            _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
          }
        } else {
          query += (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
          query += (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
          _where.push(data.WHERE.OR[item].VALUE);
        }
      }
    }
    return { "query": query, "_where": _where };
  }

  private generateSelectQuery(data: DatabaseInterFace.Select) {
    let query: string = "";
    let where = [];
    if (data.SELECT.length > 0) {
      query += (data.IS_DISTINCT ? "SELECT DISTINCT " : "SELECT ");
      for (let item in data.SELECT) {
        query += data.SELECT[item] + (data.SELECT.length > parseInt(item) + 1 ? ", " : "");
      }
      query += " FROM " + data.TABLE;
    } else {
      query += (data.IS_DISTINCT ? "SELECT DISTINCT * FROM " : "SELECT * FROM ") + data.TABLE;
    }

    let _whereCondition = this.appendWhereCondition(data, query);
    query = _whereCondition.query;
    where = _whereCondition._where;

    if (!!data.GROUP_BY && data.GROUP_BY.length > 0) {
      query += " GROUP BY ";
      for (let item in data.GROUP_BY) {
        query += data.GROUP_BY[item] + (data.GROUP_BY.length > parseInt(item) + 1 ? ", " : "");
      }
    }

    if (!!data.ORDER_BY && data.ORDER_BY.length > 0) {
      for (let item in data.ORDER_BY) {
        if (item == "0") {
          query += " ORDER BY ";
        }
        query += data.ORDER_BY[item].KEY + " " + data.ORDER_BY[item].VALUE + (data.ORDER_BY.length > parseInt(item) + 1 ? ", " : "")
      }
    }
    return { "query": query, "parameter": where };
  }

  private generateInsertQuery(data: DatabaseInterFace.Insert) {
    let query: string = "";
    let items_mark = [];
    let items_key = [];
    let items_value = [];
    for (let item in data.INSERT) {
      items_mark.push("?");
      items_key.push(item);
      items_value.push(data.INSERT[item]);
    }
    query += "INSERT INTO " + data.TABLE + " (" + items_key.join(", ") + ") VALUES (" + items_mark.join(", ") + ")";
    return { "query": query, "parameter": items_value };
  }

  private generateUpdateQuery(data: DatabaseInterFace.Update) {
    let query: string = "";
    let where = [];
    let items_mark = [];
    let items_key = [];
    let items_value = [];
    for (let item in data.UPDATE) {
      items_mark.push("?");
      items_key.push(item + " = ?");
      items_value.push(data.UPDATE[item]);
    }
    query += "UPDATE " + data.TABLE + " SET " + items_key.join(", ");

    let _whereCondition = this.appendWhereCondition(data, query);
    query = _whereCondition.query;
    where = _whereCondition._where;

    return { "query": query, "parameter": items_value.concat(where) };
  }

  private generateDeleteQuery(data: DatabaseInterFace.Delete) {
    let query = "";
    let where = [];
    query += "DELETE FROM " + data.TABLE + " ";

    let _whereCondition = this.appendWhereCondition(data, query);
    query = _whereCondition.query;
    where = _whereCondition._where;

    return { "query": query, "parameter": where };
  }

  private insertOrUpdateRecords(data: DatabaseInterFace.InsertOrUpdate): Observable<any> {
    let query = "";
    let where = [];
    let items_mark = [];
    let items_key = [];
    let items_value = [];
    query += "SELECT * FROM " + data.TABLE;

    let _whereCondition = this.appendWhereCondition(data, query);
    query = _whereCondition.query;
    where = _whereCondition._where;

    return new Observable((resolve) => {
      this.executeQuery(query, items_value.concat(where)).subscribe((res: any) => {
        query = "";
        where = [];
        items_value = [];
        data = (data as DatabaseInterFace.InsertOrUpdate);
        if (res['status'] === 200 && res.data.length > 0) {
          for (let item in data.INSERTORUPDATE) {
            items_mark.push("?");
            items_key.push(item + " = ?");
            items_value.push(data.INSERTORUPDATE[item]);
          }
          query += "UPDATE " + data.TABLE + " SET " + items_key.join(", ");

          let _whereCondition = this.appendWhereCondition(data, query);
          query = _whereCondition.query;
          where = _whereCondition._where;

        } else {
          for (let item in data.INSERTORUPDATE) {
            items_mark.push("?");
            items_key.push(item);
            items_value.push(data.INSERTORUPDATE[item]);
          }
          query += "INSERT INTO " + data.TABLE + " (" + items_key.join(", ") + ") VALUES (" + items_mark.join(", ") + ")";
        }
        this.executeQuery(query, items_value.concat(where)).subscribe((res: any) => {
          resolve.next(res);
        });
      });
    });
  }

  createQuery(data: DatabaseInterFace.Select | DatabaseInterFace.Insert | DatabaseInterFace.Update | DatabaseInterFace.Delete | DatabaseInterFace.InsertOrUpdate | DatabaseInterFace.Query): Observable<any> {
    let queryData = { "query": "", "parameter": [] };

    if ((data as DatabaseInterFace.Select).SELECT) {
      queryData = this.generateSelectQuery(data as DatabaseInterFace.Select);
    } else if ((data as DatabaseInterFace.Insert).INSERT) {
      queryData = this.generateInsertQuery(data as DatabaseInterFace.Insert);
    } else if ((data as DatabaseInterFace.Update).UPDATE) {
      queryData = this.generateUpdateQuery(data as DatabaseInterFace.Update);
    } else if ((data as DatabaseInterFace.Delete).DELETE) {
      queryData = this.generateDeleteQuery(data as DatabaseInterFace.Delete);
    } else if ((data as DatabaseInterFace.Query).QUERY) {
      queryData.query = (data as DatabaseInterFace.Query).QUERY;
      queryData.parameter = (data as DatabaseInterFace.Query).PARAMETER;
    }

    if (queryData.query != "") {
      return new Observable((resolve) => {
        this.executeQuery(queryData.query, queryData.parameter).subscribe((res: any) => {
          resolve.next(res);
        });
      })
    } else {
      if ((data as DatabaseInterFace.InsertOrUpdate).INSERTORUPDATE) {
        return new Observable((resolve) => {
          this.insertOrUpdateRecords(data as DatabaseInterFace.InsertOrUpdate).subscribe((res: any) => {
            resolve.next(res);
          });
        })
      }
    }
  }
}