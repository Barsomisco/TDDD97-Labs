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
            database_helper.add_token(email, token)
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
        email = database_helper.get_email(token)
        db_current_hashed_password = database_helper.get_password(email)
        hashed_old_password = hashlib.sha256(old_password).hexdigest()
        if hashed_old_password == db_current_hashed_password:
            hashed_new_password = hashlib.sha256(new_password).hexdigest()
            database_helper.change_password(email, hashed_new_password)
            return 'successful'
        else:
            return 'failed'

@app.route('/signout', methods=['POST'])
def sign_out():
    if request.method == 'POST':
        token = request.form['token']
        database_helper.remove_token(token)


@app.route('/userdata/token', methods=['POST'])
def get_user_data_by_token():
    if request.method == 'POST':
        token = request.form['token']
        user_data = database_helper.get_user_data_by_token(token)
        return json.dumps([{'email': user_data[0], 'firstname':user_data[1], 'familyname':user_data[2], 'gender':user_data[3], 'city':user_data[4], 'country':user_data[5]}])


@app.route('/userdata/email', methods=['POST'])
def get_user_data_by_email():
    if request.method == 'POST':
        token = request.form['token']
        email = request.form['email']
        if database_helper.is_logged_in(token):
            user_data = database_helper.get_user_data_by_email(email)
            return json.dumps([{'email': user_data[0], 'firstname':user_data[1], 'familyname':user_data[2], 'gender':user_data[3], 'city':user_data[4], 'country':user_data[5]}])
    return False


@app.route('/messages/token', methods=['POST'])
def get_user_messages_by_token():
    if request.method == 'POST':
        token = request.form['token']
        messages = database_helper.get_user_messages_by_token(token)
        return json.dumps([{'messages': messages}])
    return False


@app.route('/postmessage', methods=['POST'])
def post_message():
    if request.method == 'POST':
        token = request.form['token']
        message = request.form['message']
        email = request.form['email']
        sender = database_helper.get_email(token)
        result = database_helper.post_message(sender, message, email)
        return json.dumps([{'success':result}])


if __name__ == '__main__':
    app.run()
