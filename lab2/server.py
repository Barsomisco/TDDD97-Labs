from flask import Flask
import database_helperi
import hashlib, uuid
app = Flask(__name__)


if __name__ == '__main__':
    app.run()

@app.route('/signin', methods=['POST'])
def sign_in(email, password):

    return token

@app.route('/signup', methods=['POST'])
def sign_up(email, password, firstname, familyname, gender, city, country):
    if request.method == 'POST':
        salt = uuid.uuid4().hex
        hashed_password = hashlib.sha256(password + salt).hexdigest()
        database_helper.add_user(email, hashed_password, firstname, familyname, gender, city, country)
