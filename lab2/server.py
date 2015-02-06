from flask import Flask, app, request
import database_helper
import hashlib, uuid

app = Flask(__name__)

@app.route('/')
def hello():
    return "hello world!"

@app.route('/signin', methods=['POST'])
def sign_in(email, password):

    return token

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
        salt = uuid.uuid4().hex
        hashed_password = hashlib.sha256(password + salt).hexdigest()
        result = database_helper.add_user(email, hashed_password, firstname, familyname, gender, city, country)
        return "bra gjort"
       # if result == True:
       #     'User added'
       # else:
       #     'User with that email already exists'

if __name__ == '__main__':
    app.run()
