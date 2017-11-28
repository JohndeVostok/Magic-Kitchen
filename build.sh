# This file is used for SEP (Software Engineering Platform)
# DON'T use it in production!!

# Remove the SQLite DB first
rm -f db.sqlite3
# Run Django migration
python manage.py migrate
# Run tests
coverage run --omit="./web/SUBMAIL_PYTHON_SDK_MAIL_AND_MESSAGE_WITH_ADDRESSBOOK/*,./web/send_email.py,./manage.py,./web/views.py" manage.py test 
# Generate coverage reports
rm -rf Coverage_Python
coverage html -d Coverage_Python

