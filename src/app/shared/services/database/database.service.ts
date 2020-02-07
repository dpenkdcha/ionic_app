import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import * as DBCONSTANT from '../../constants/database.constant';

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
          console.log("ERROR: ", error);
        });
      }
    }).catch(error => {
      console.log(error);
    })
  }

  async createTables() {
    try {
      await this.database.executeSql(DBCONSTANT.CREATE_QUERY.USER_TABLE, []);
    } catch (e) {
      console.log("Error !");
    }
  }

  private _filterQueryToArray(response) {
    var data = [];
    for (var i = 0; i < response.rows.length; i++) {
      data.push(response.rows.item(i));
    }
    return data;
  }

  private executeQuery(query: string, parameter: Array<any>): Observable<any> {
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
            resolve.next({ "status": 500, "data": this.row_data });
          }
        )
    })
  }

  createQuery(data): Observable<any> {
    var query = "";
    var _where = [];
    var items_mark = [];
    var items_key = [];
    var items_value = [];

    if (!!data.SELECT) {
      if (data.SELECT.length > 0) {
        query = query + (data.IS_DISTINCT ? "SELECT DISTINCT " : "SELECT ");
        for (var item in data.SELECT) {
          query = query + data.SELECT[item] + (data.SELECT.length > item + 1 ? ", " : "");
        }
        query = query + " FROM " + data.TABLE;
      } else {
        query = query + (data.IS_DISTINCT ? "SELECT DISTINCT * FROM " : "SELECT * FROM ") + data.TABLE;
      }

      if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
        query = query + (_where.length ? "" : " WHERE ");
        for (var item in data.WHERE.AND) {
          if (!!data.WHERE.AND[item].OR) {
            for (var itemOR in data.WHERE.AND[item].OR) {
              query = query + (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
              query = query + (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
            _where.push(data.WHERE.AND[item].VALUE);
          }
        }
      }

      if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
        query = query + (_where.length ? " OR " : " WHERE ");
        for (var item in data.WHERE.OR) {
          if (!!data.WHERE.OR[item].AND) {
            for (var itemAND in data.WHERE.OR[item].AND) {
              query = query + (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
              query = query + (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
            _where.push(data.WHERE.OR[item].VALUE);
          }
        }
      }

      if (!!data.GROUP_BY && data.GROUP_BY.length > 0) {
        query = query + " GROUP BY ";
        for (var item in data.GROUP_BY) {
          query = query + data.GROUP_BY[item] + (data.GROUP_BY.length > item + 1 ? ", " : "");
        }
      }

      if (!!data.ORDER_BY && data.ORDER_BY.length > 0) {
        for (var item in data.ORDER_BY) {
          if (item == "0") {
            query = query + " ORDER BY ";
          }
          query = query + data.ORDER_BY[item].KEY + " " + data.ORDER_BY[item].VALUE + (data.ORDER_BY.length > item + 1 ? ", " : "")
        }
      }
    } else if (!!data.INSERT) {

      for (var item in data.INSERT) {
        items_mark.push("?");
        items_key.push(item);
        items_value.push(data.INSERT[item]);
      }
      query = query + "INSERT INTO " + data.TABLE + " (" + items_key.join(", ") + ") VALUES (" + items_mark.join(", ") + ")";
    } else if (!!data.UPDATE) {

      for (var item in data.UPDATE) {
        items_mark.push("?");
        items_key.push(item + " = ?");
        items_value.push(data.UPDATE[item]);
      }
      query = query + "UPDATE " + data.TABLE + " SET " + items_key.join(", ");

      if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
        query = query + (_where.length ? "" : " WHERE ");
        for (var item in data.WHERE.AND) {
          if (!!data.WHERE.AND[item].OR) {
            for (var itemOR in data.WHERE.AND[item].OR) {
              query = query + (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
              query = query + (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
            _where.push(data.WHERE.AND[item].VALUE);
          }
        }
      }

      if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
        query = query + (_where.length ? " OR " : " WHERE ");
        for (var item in data.WHERE.OR) {
          if (!!data.WHERE.OR[item].AND) {
            for (var itemAND in data.WHERE.OR[item].AND) {
              query = query + (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
              query = query + (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
            _where.push(data.WHERE.OR[item].VALUE);
          }
        }
      }
    } else if (!!data.DELETE) {

      query = query + "DELETE FROM " + data.TABLE + " ";

      if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
        query = query + (_where.length ? "" : " WHERE ");
        for (var item in data.WHERE.AND) {
          if (!!data.WHERE.AND[item].OR) {
            for (var itemOR in data.WHERE.AND[item].OR) {
              query = query + (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
              query = query + (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
            _where.push(data.WHERE.AND[item].VALUE);
          }
        }
      }

      if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
        query = query + (_where.length ? " OR " : " WHERE ");
        for (var item in data.WHERE.OR) {
          if (!!data.WHERE.OR[item].AND) {
            for (var itemAND in data.WHERE.OR[item].AND) {
              query = query + (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
              query = query + (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
              _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
            }
          } else {
            query = query + (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
            query = query + (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
            _where.push(data.WHERE.OR[item].VALUE);
          }
        }
      }
    }

    console.log(query);
    console.log(items_value.concat(_where));

    if (query != "") {
      return new Observable((resolve) => {
        this.executeQuery(query, items_value.concat(_where)).subscribe((res: any) => {
          resolve.next(res);
        });
      })
    } else {
      if (!!data.INSERTORUPDATE) {

        query = query + "SELECT * FROM " + data.TABLE;

        if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
          query = query + (_where.length ? "" : " WHERE ");
          for (var item in data.WHERE.AND) {
            if (!!data.WHERE.AND[item].OR) {
              for (var itemOR in data.WHERE.AND[item].OR) {
                query = query + (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
                query = query + (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
                _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
              }
            } else {
              query = query + (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
              query = query + (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
              _where.push(data.WHERE.AND[item].VALUE);
            }
          }
        }

        if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
          query = query + (_where.length ? " OR " : " WHERE ");
          for (var item in data.WHERE.OR) {
            if (!!data.WHERE.OR[item].AND) {
              for (var itemAND in data.WHERE.OR[item].AND) {
                query = query + (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
                query = query + (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
                _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
              }
            } else {
              query = query + (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
              query = query + (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
              _where.push(data.WHERE.OR[item].VALUE);
            }
          }
        }

        return new Observable((resolve) => {
          this.executeQuery(query, items_value.concat(_where)).subscribe((res: any) => {
            query = "";
            _where = [];
            items_value = [];
            if (res['status'] === 200 && res.data.length > 0) {
              for (var item in data.INSERTORUPDATE) {
                items_mark.push("?");
                items_key.push(item + " = ?");
                items_value.push(data.INSERTORUPDATE[item]);
              }
              query = query + "UPDATE " + data.TABLE + " SET " + items_key.join(", ");

              if (!!data.WHERE && !!data.WHERE.AND && data.WHERE.AND.length > 0) {
                query = query + (_where.length ? "" : " WHERE ");
                for (var item in data.WHERE.AND) {
                  if (!!data.WHERE.AND[item].OR) {
                    for (var itemOR in data.WHERE.AND[item].OR) {
                      query = query + (item == "0" && itemOR == "0" ? "((" : (itemOR == "0" ? "(" : "")) + data.WHERE.AND[item].OR[itemOR].KEY + " " + data.WHERE.AND[item].OR[itemOR].SEPERATOR + " ? ";
                      query = query + (data.WHERE.AND[item].OR.length > parseInt(itemOR) + 1 ? " OR " : (data.WHERE.AND.length > parseInt(item) + 1 ? ")" : "))"));
                      _where.push(data.WHERE.AND[item].OR[itemOR].VALUE);
                    }
                  } else {
                    query = query + (item == "0" ? "(" : "") + data.WHERE.AND[item].KEY + " " + data.WHERE.AND[item].SEPERATOR + " ? ";
                    query = query + (data.WHERE.AND.length > parseInt(item) + 1 ? " AND " : ")");
                    _where.push(data.WHERE.AND[item].VALUE);
                  }
                }
              }

              if (!!data.WHERE && !!data.WHERE.OR && data.WHERE.OR.length > 0) {
                query = query + (_where.length ? " OR " : " WHERE ");
                for (var item in data.WHERE.OR) {
                  if (!!data.WHERE.OR[item].AND) {
                    for (var itemAND in data.WHERE.OR[item].AND) {
                      query = query + (item == "0" && itemAND == "0" ? "((" : (itemAND == "0" ? "(" : "")) + data.WHERE.OR[item].AND[itemAND].KEY + " " + data.WHERE.OR[item].AND[itemAND].SEPERATOR + " ? ";
                      query = query + (data.WHERE.OR[item].AND.length > parseInt(itemAND) + 1 ? " AND " : (data.WHERE.OR.length > parseInt(item) + 1 ? ")" : "))"));
                      _where.push(data.WHERE.OR[item].AND[itemAND].VALUE);
                    }
                  } else {
                    query = query + (item == "0" ? "(" : "") + data.WHERE.OR[item].KEY + " " + data.WHERE.OR[item].SEPERATOR + " ? ";
                    query = query + (data.WHERE.OR.length > parseInt(item) + 1 ? " OR " : ")");
                    _where.push(data.WHERE.OR[item].VALUE);
                  }
                }
              }
            } else {
              for (var item in data.INSERTORUPDATE) {
                items_mark.push("?");
                items_key.push(item);
                items_value.push(data.INSERTORUPDATE[item]);
              }
              query = query + "INSERT INTO " + data.TABLE + " (" + items_key.join(", ") + ") VALUES (" + items_mark.join(", ") + ")";
            }
            console.log(query);
            console.log(items_value.concat(_where));
            this.executeQuery(query, items_value.concat(_where)).subscribe((res: any) => {
              resolve.next(res);
            });
          });
        });
      }
    }
  }
}