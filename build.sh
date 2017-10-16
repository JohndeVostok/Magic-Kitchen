# This file is used for SEP (Software Engineering Platform)
# DON'T use it in production!!

# Remove the SQLite DB first
rm -f db.sqlite3
# Run Django migration
python manage.py migrate
# Run tests
coverage run manage.py test
# Generate coverage reports
rm -rf Coverage_Python
coverage html -d Coverage_Python

