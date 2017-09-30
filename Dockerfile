FROM wangyisong1996/codechef_base
WORKDIR /CodeCheF
RUN rm -rf /CodeCheF/*
ADD . /CodeCheF
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

