from flask import Flask
import database_helper
app = Flask(__name__)


if __name__ == '__main__':
    app.run()

@app.route('/signin', methods=['POST'])
def sign_in(email, password):
    return true

@app.route('/signup', methods=['POST'])
def sign_up(email, password, firstname, familyname, gender, city, country):
    if request.method == 'POST':
        token = database_helper.add_contact(email, password, firstname, familyname, gender, city, country)
    return token
