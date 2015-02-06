import sqlite3
from flask import g

def connect_db():
    return sqlite3.connect('database.db')

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

def add_user(email, password, firstname, familyname, gender, city, country):
    c = get_db()
    cursor = c.cursor()
    user = (email, password, firstname, familyname, gender, city, country)
    cursor.execute('''INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)''', user)
    c.commit()

def close():
    get_db().close()

add_user('apa@hej.com', 'apa', 'apa', 'apa', 'apa', 'apa', 'apa')
