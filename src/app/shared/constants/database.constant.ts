export const DATABASE_NAME = "data.db";

export enum CREATE_QUERY {
    PRODUCT_TABLE = `CREATE TABLE IF NOT EXISTS  products (
        id INTEGER PRIMARY KEY,
        sku TEXT,
        barcode TEXT,
        title TEXT NOT NULL,
        description TEXT,
        quantity REAL,
        unit VARCHAR,
        unitPrice REAL,
        minQuantity INTEGER,
        familly_id INTEGER,
        location_id INTEGER,
        FOREIGN KEY(familly_id) REFERENCES famillies(id),
        FOREIGN KEY(location_id) REFERENCES locations(id)
        );`,
    FAMILY_TABLE = `CREATE TABLE IF NOT EXISTS famillies (
        id INTEGER PRIMARY KEY,
        reference VARCHAR(32) NOT NULL,
        name TEXT NOT NULL,
        unit VARCHAR);`,
    LOCATION_TABLE = `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL);`,
    TRANSACTION_TABLE = `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        date TEXT,
        quantity REAL,
        unitCost REAL,
        reason VARCHAR,
        upc TEXT,
        comment TEXT,
        product_id INTEGER,
        FOREIGN KEY(product_id) REFERENCES products(id));`
}