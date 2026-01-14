from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

# Create metadata with naming convention
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize db and bcrypt here to avoid circular imports
# These will be initialized with the app in app.py
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

