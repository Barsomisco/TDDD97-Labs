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
    c = connect_db()
    cur = c.cursor()
    tok = (token,)
    try:
        cur.execute('''SELECT email FROM logged_in_users WHERE token=?''', tok)
        result = cur.fetchone()
        return result[0]
    except:
        return False


def change_password(email, new_password):
    c = connect_db()
    cur = c.cursor()
    user = (new_password, email)
    try:
        cur.execute('''UPDATE users SET password=? WHERE email=?''', user)
        c.commit()
        return True
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


def get_user_data_by_token(token):
    c = connect_db()
    cur = c.cursor()
    email = (get_email(token),)
    try:
        cur.execute('''SELECT * FROM users WHERE email=?''', email)
        result = cur.fetchone()
        return [result[0], result[2], result[3],
                result[4], result[5], result[6]]
    except:
        return False


def is_logged_in(token):
    c = connect_db()
    cur = c.cursor()
    tok = (token,)
    try:
        cur.execute('''SELECT EXISTS(SELECT *
                    FROM logged_in_users WHERE token=?)''', tok)
    except:
        return False
    if cur.fetchone()[0] == 1:
        return True
    return False


def get_user_data_by_email(email):
    c = connect_db()
    cur = c.cursor()
    mail = (email,)
    try:
        cur.execute('''SELECT * FROM users WHERE email=?''', mail)
        result = cur.fetchone()
        return [result[0], result[2], result[3],
                result[4], result[5], result[6]]
    except:
        return False


def get_user_messages_by_token(token):
    c = connect_db()
    cur = c.cursor()
    email = (get_email(token),)
    try:
        cur.execute('''SELECT message, sender
                    FROM messages WHERE receiver=?''', email)
    except:
        return False
    result = cur.fetchall()
    messages = []
    senders = []
    for m in result:
        messages.append(m[0])
        senders.append(m[1])
    return messages, senders


def post_message(sender, message, receiver):
    c = connect_db()
    cur = c.cursor()
    message_info = (sender, message, receiver)
    try:
        cur.execute('''INSERT INTO messages VALUES (?, ?, ?)''', message_info)
        c.commit()
        return True
    except:
        return False


def get_user_messages_by_email(email):
    c = connect_db()
    cur = c.cursor()
    mail = (email,)
    try:
        cur.execute('''SELECT message, sender
                    FROM messages WHERE receiver=?''', mail)
    except:
        return False
    result = cur.fetchall()
    messages = []
    senders = []
    for m in result:
        messages.append(m[0])
        senders.append(m[1])
    return messages, senders


def user_exists(email):
    c = connect_db()
    cur = c.cursor()
    mail = (email,)
    try:
        cur.execute('''SELECT EXISTS(SELECT *
                    FROM users WHERE email=?)''', mail)
    except:
        return False
    if cur.fetchone()[0] == 1:
        return True
    return False


def save_picture(email, file_path):
    c = connect_db()
    cur = c.cursor()
    picture = (email, file_path)
    try:
        cur.execute('''INSERT INTO pictures VALUES(?, ?)''', picture)
        c.commit()
    except:
        return False
    return True


def close():
    get_db().close()
