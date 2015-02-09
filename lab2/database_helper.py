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







def get_email(token):
    c.connect_db()
    cur = c.cursor()
    tok = (token ,)
    try:
        cur.execute('''SELECT email FROM logged_in_users WHERE token=?''', tok)
        result = cur.fetchone()
        return result[0]
    except:
        return False

def change_password(email, new_password):
    c.connect_db()
    cur = c.cursor()
   # mail = (email,)
   # new_pass = (new_password,)
    try:
        cur.execute('''UPDATE users SET password=? WHERE email=?''', (new_password, email))
        c.commit()
        return True
    except:
        return False

def close():
    get_db().close()
