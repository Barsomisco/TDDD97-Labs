from flask import Flask, app, request
import database_helper
import hashlib
import uuid
import json

app = Flask(__name__)


@app.route('/')
def hello():
    return "hello world!"


@app.route('/signin', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db_password = database_helper.get_password(email)
        hashed_password = hashlib.sha256(password).hexdigest()
        token = uuid.uuid4().hex
        if hashed_password == db_password:
            return json.dumps([{'success': 'true', 'message': "Login successful!", 'token': token}])
        else:
            return json.dumps([{'success': 'false', 'message': '''Wrong email or password'''}])


@app.route('/signup', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        firstname = request.form['firstname']
        familyname = request.form['familyname']
        gender = request.form['gender']
        city = request.form['city']
        country = request.form['country']
        hashed_password = hashlib.sha256(password).hexdigest()
        database_helper.add_user(email, hashed_password, firstname, familyname, gender, city, country)
        return "Bra jobbat"

@app.route('/changepass', methods=['POST'])
def change_password():
    if request.method == 'POST':
        token = request.form['token']
        old_password = request.form['old_password']
        new_password = request.form['new_password']
        email = database_helper.get.email(token)
        db_current_hashed_password = database_helper.get_password(email).hexdigest()
        hashed_old_password = hashlib.sha256(old_password).hexdigest()
        if hashed_old_password == db_current_hashed_password:
            database_helper.change_password(email, new_password)
            return 'successful'
        else:
            return 'failed'

if __name__ == '__main__':
    app.run()
