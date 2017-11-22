# CodeCheF

## What is CodeCheF?

CodeCheF is an online programming game for young children.
The last letter F is capitalized to avoid conflict with [CodeChef Programming Platform](https://www.codechef.com), and to show our great respect to [CCF (China Computer Federation)](http://www.ccf.org.cn).

## How to run it?

### Run locally

First install Python 2 and Django.
```bash
$ pip install django
```

Then run with `run.sh`, which can be used for any scenario, including debugging, testing and production.
```bash
$ sh run.sh
```

Alternatively, you can run the server manually.
```bash
$ python manage.py migrate  # run Django migration
$ python manage.py shell < create_super_admin.py # create super admin
$ python manage.py shell < init_default_level_and_solution.py # initialize default level and solution
$ python manage.py runserver 0.0.0.0:8000  # run Django server, listening at 0.0.0.0, port 8000
```

To setup levels, one can access /test.html to feed the default levels into SQL.
If any corruption occurs, remove db.sqlite3, migrate, and access /test.html again.
Then change config.useFakeLevel to false in order to use these level.
(This may be fixed in near future)

### Run with Docker

There are some scripts to run and debug CodeCheF with Docker.
```bash
$ sh docker-run.sh  # run CodeCheF with Docker
```
Note that the server is running in background, so you should use the `docker kill` command to shutdown it.

Or if you want to build a Docker image manually and test it.
```bash
$ sh docker-build.sh  # build a Docker image from current directory
$ sh docker-test.sh  # test the image using build.sh
$ sh docker-debug.sh  # start a bash terminal in the image
```

Have fun coding and hacking!
