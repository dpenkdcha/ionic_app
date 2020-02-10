export namespace DatabaseInterFace {
    export interface Where {
        AND?: Array<any>;
        OR?: Array<any>;
    }

    export interface Select {
        SELECT: [] | Array<string>;
        TABLE: string;
        IS_DISTINCT?: boolean
        WHERE?: Where;
        ORDER_BY?: Array<any>;
        GROUP_BY?: Array<any>;
    }

    export interface Insert {
        INSERT: JSON;
        TABLE: string;
    }

    export interface Update {
        UPDATE: JSON;
        TABLE: string;
        WHERE?: Where;
    }

    export interface Delete {
        DELETE: JSON;
        TABLE: string;
        WHERE?: Where;
    }

    export interface InsertOrUpdate {
        INSERTORUPDATE: JSON;
        TABLE: string;
        WHERE: Where;
    }

    export interface Query {
        QUERY: string;
        PARAMETER: Array<any>;
    }
}