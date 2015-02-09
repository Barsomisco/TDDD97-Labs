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
    c = connect_db()
    user = (email, password, firstname, familyname, gender, city, country)
    try:
        c.execute('''INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)''', user)
        c.commit()
    except:
        return False
    return True

def get_password(email):
    c = connect_db()
    cur = c.cursor()
    mail = (email,)
    try:
        cur.execute('''SELECT password FROM users WHERE email=?''', mail)
        result = cur.fetchone()
        return result[0]
    except:
        return False

def close():
    get_db().close()
