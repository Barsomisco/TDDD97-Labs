import sqlite3

database = sqlite3.connect('database.db')
db_cursor = database.cursor()

def createTables():
    db_cursor.execute('''CREATE TABLE if NOT EXISTS users (email text, 
            password text, firstname text, familyname text, 
            gender text, city text, country text)''')

if (database):
    createTables()

def add_user(email, password, firstname, familyname, gender, city, country):
    user = (email, password, firstname, familyname, gender, city, country)
    db_cursor.execute('''INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)''', user)
    database.commit()

database.close()
