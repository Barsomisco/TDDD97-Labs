from Twidder import app
from flask import request
from werkzeug import secure_filename
import database_helper
import hashlib
import uuid
import json
import os
from validate_email import validate_email
import base64


connection = []
MEDIA_FOLDER = './Twidder/media'
MEDIA_ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'ogg', 'mp4'])


@app.route('/socket')
def autologout():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        while True:
            message = ws.receive()
            if message == "close connection":
                for user in connection:
                    if user[0] == ws:
                        connection.remove(user)
                        if message is not None:
                            email = database_helper.get_email(message)
                            if email is not False:
                                connection.append([ws, email])
                                ws.send(message)
                                return


@app.route('/', methods=['GET'])
def welcome_view():
    return app.send_static_file('client.html')


def allowed_filename(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in MEDIA_ALLOWED_EXTENSIONS


@app.route('/postmedia', methods=['POST'])
def upload_media():
    if request.method == 'POST':
        token = request.form['token']
        media = request.files['media']
        if database_helper.is_logged_in(token) is False:
            return json.dumps({'success': False,
                               'message': '''Not logged in'''})
        email = database_helper.get_email(token)
        if media and allowed_filename(media.filename):
            filename = secure_filename(media.filename)
            if not os.path.exists(MEDIA_FOLDER + '/' + email):
                os.makedirs(MEDIA_FOLDER + '/' + email)
            if database_helper.save_media(email, os.path.join(
                    MEDIA_FOLDER + '/' + email, filename)) is False:
                return json.dumps({'success': False,
                                   'message': '''Failed to upload'''})
            media.save(os.path.join(MEDIA_FOLDER + '/' + email, filename))
            return json.dumps({'success': True,
                               'message': '''File uploaded successfully!'''})
        return json.dumps({'success': False,
                           'message': '''Invalid file format'''})


@app.route('/media/token', methods=['POST'])
def get_user_media_by_token():
    if request.method == 'POST':
        token = request.form['token']
        email = database_helper.get_email(token)
        media_paths = database_helper.get_user_media_by_email(email)
        if media_paths is not False:
            medias = []
            for media in media_paths:
                media_extension = media.rsplit('.', 2)[2]
                with open(media) as m:
                    medias.append([base64.b64encode(m.read()), media_extension])
                return json.dumps({'success': True,
                                   'message': '''User media retrieved
                                   successfully''', 'media': medias})
        return json.dumps({'success': False,
                           'message': '''Token doesn't exists'''})


@app.route('/media/email', methods=['POST'])
def get_user_media_by_email():
    if request.method == 'POST':
        token = request.form['token']
        email = request.form['email']
        if database_helper.is_logged_in(token):
            if database_helper.user_exists(email):
                media_paths = database_helper.get_user_media_by_email(
                    email)
                medias = []
                for media in media_paths:
                    media_extension = media.rsplit('.', 2)[2]
                    with open(media) as m:
                        medias.append([base64.b64encode(m.read()),
                                       media_extension])
                return json.dumps({'success': True,
                                   'message': '''User media retrieved
                                   successfully''', 'media': medias})
        return json.dumps({'success': False,
                           'message': '''There is no user with that email'''})


@app.route('/signin', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db_password = database_helper.get_password(email)
        if db_password is False:
            return json.dumps({'success': False, 'message': "Wrong email!"})
        hashed_password = hashlib.sha256(password).hexdigest()
        token = uuid.uuid4().hex
        for user in connection:
            if user[1] == email:
                user[0].send('Signout')
        if hashed_password == db_password:
            if database_helper.add_token(email, token):
                return json.dumps({'success': True,
                                   'message': "Login successful!",
                                   'token': token})
        else:
            return json.dumps({'success': False,
                               'message': '''Wrong password'''})


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
        if len(password) < 7:
            return json.dumps({'success': False,
                               'message': '''Password is too short'''})
        if validate_email(email) is False:
            return json.dumps({'success': False,
                               'message': '''Not a valid email'''})
        hashed_password = hashlib.sha256(password).hexdigest()
        if database_helper.add_user(email, hashed_password, firstname,
                                    familyname, gender, city, country):
            return json.dumps({'success': True,
                               'message': '''User signed up successfully'''})
        return json.dumps({'success': False,
                           'message': '''Email already exists'''})


@app.route('/changepass', methods=['POST'])
def change_password():
    if request.method == 'POST':
        token = request.form['token']
        old_password = request.form['old_password']
        new_password = request.form['new_password']
        email = database_helper.get_email(token)
        if email is False:
            return json.dumps({'success': False, 'message': "Invalid token"})
        if len(new_password) < 7:
            return json.dumps({'success': False,
                               'message': '''Password is too short'''})
        db_current_hashed_password = database_helper.get_password(email)
        hashed_old_password = hashlib.sha256(old_password).hexdigest()
        if hashed_old_password == db_current_hashed_password:
            hashed_new_password = hashlib.sha256(new_password).hexdigest()
            database_helper.change_password(email, hashed_new_password)
            return json.dumps({'success': True, 'message': "Password changed"})
        return json.dumps({'success': False, 'message': "Wrong password"})


@app.route('/signout', methods=['POST'])
def sign_out():
    if request.method == 'POST':
        token = request.form['token']
        i = 0
        for user in connection:
            if database_helper.get_email(token) == user[1]:
                del connection[i]
            i = i + 1
        if database_helper.remove_token(token):
            return json.dumps({'success': True,
                               'message': 'signed out successfully!'})
        return json.dumps({'success': False,
                           'message': '''token doesn't exist'''})


@app.route('/userdata/token', methods=['POST'])
def get_user_data_by_token():
    if request.method == 'POST':
        token = request.form['token']
        user_data = database_helper.get_user_data_by_token(token)
        if user_data is not False:
            return json.dumps({'success': True, 'message': "Userdata retrieved",
                               'email': user_data[0], 'firstname': user_data[1],
                               'familyname': user_data[2],
                               'gender': user_data[3], 'city': user_data[4],
                               'country': user_data[5]})
        return json.dumps({'success': False,
                           'message': '''Token doesn't exist'''})


@app.route('/userdata/email', methods=['POST'])
def get_user_data_by_email():
    if request.method == 'POST':
        token = request.form['token']
        email = request.form['email']
        if database_helper.user_exists(email) is False:
            return json.dumps({'success': False,
                               'message': '''Email doesn't exist'''})
        if database_helper.is_logged_in(token):
            user_data = database_helper.get_user_data_by_email(email)
            return json.dumps({'success': True, 'message': 'Userdata retrieved',
                               'email': user_data[0], 'firstname': user_data[1],
                               'familyname': user_data[2],
                               'gender': user_data[3], 'city': user_data[4],
                               'country': user_data[5]})
        return json.dumps({'success': False, 'message': ''})


@app.route('/messages/token', methods=['POST'])
def get_user_messages_by_token():
    if request.method == 'POST':
        token = request.form['token']
        messages = database_helper.get_user_messages_by_token(token)
        if messages is not False:
            return json.dumps({'success': True,
                               'message': '''User messages retrieved''',
                               'messages': messages})
        return json.dumps({'success': False,
                           'message': '''Token doesn't exist'''})


@app.route('/postmessage', methods=['POST'])
def post_message():
    if request.method == 'POST':
        token = request.form['token']
        message = request.form['message']
        email = request.form['email']
        sender = database_helper.get_email(token)
        if sender is False:
            return json.dumps({'success': False,
                               'message': '''Token doesn't exists'''})
        if database_helper.user_exists(email) is False:
            return json.dumps({'success': False,
                               'message': '''Receiver does not exists'''})
        result = database_helper.post_message(sender, message, email)
        if result:
            return json.dumps({'success': True,
                               'message': '''Message posted successfully'''})
        return json.dumps({'success': False, 'message': '''Invalid message'''})


@app.route('/messages/email', methods=['POST'])
def get_user_messages_by_email():
    if request.method == 'POST':
        token = request.form['token']
        email = request.form['email']
        if database_helper.is_logged_in(token):
            messages = database_helper.get_user_messages_by_email(email)
            if database_helper.user_exists(email):
                return json.dumps({'success': True,
                                   'message': '''Messages retrieved
                                   successfully''', 'messages': messages})
        return json.dumps({'success': False,
                           'message': '''There is no user with that email'''})


@app.errorhandler(404)
def fallback(e):
    return app.send_static_file('client.html')

if __name__ == '__main__':
    app.run()
