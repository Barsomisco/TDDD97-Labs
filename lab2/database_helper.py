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


def add_token(email, token):
    c = connect_db()
    user = (token, email)
    try:
        c.execute('''INSERT INTO logged_in_users VALUES(?, ?)''', user)
        c.commit()
        return True
    except:
        return False


def remove_token(token):
    c = connect_db()
    tok = (token,)
    try:
        c.execute('''DELETE FROM logged_in_users WHERE token=?''', tok)
        c.commit()
        return True
    except:
        return False


def get_user_data(token):
    c = connect_db()
    cur = c.cursor()
    tok = (token,)
    try:
        cur.execute('''SELECT email FROM logged_in_users WHERE token=?''', tok)
        email = cur.fetchone()
        cur.execute('''SELECT * FROM users WHERE email=?''', email)
        result = cur.fetchone()
        return [result[0], result[2], result[3], result[4], result[5], result[6]]
    except:
        return False


def close():
    get_db().close()
