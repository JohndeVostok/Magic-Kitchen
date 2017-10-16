FROM wangyisong1996/codechef_base
WORKDIR /CodeCheF
RUN rm -rf /CodeCheF/*
ADD . /CodeCheF
EXPOSE 8000
CMD ["sh", "run.sh"]

