# This file is used for debug, test and production!!

# Run Django migration
python manage.py migrate
#Create super admin
python manage.py shell < create_super_admin.py
#Initialize default level and solution
python manage.py shell < init_default_level_and_solution.py
# Run Django server
python manage.py runserver 0.0.0.0:8000

