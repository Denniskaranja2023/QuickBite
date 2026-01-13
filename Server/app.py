from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api, Resource
from dotenv import load_dotenv
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
import os
#loads the variables from the .env file
load_dotenv()
#creates a Flask APP Instance
app= Flask(__name__)
#Enables communication with the frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
#For the creation of databases
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = os.getenv('SECRET_KEY')
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db= SQLAlchemy(metadata=metadata)
db.init_app(app)
#For restful Apis
api = Api(app)
#Enables migrations
migrate = Migrate(app,db)
#For the encryption of passwords
bcrypt = Bcrypt(app)


if __name__ == '__main__':
    app.run(port=5555, debug=True)