FROM node:8.12.0

LABEL maintainer="Ifiok Eyo"

ENV NODE_ENV=docker
ENV PORT=5000

COPY . /home/app

WORKDIR /home/app

EXPOSE $PORT

RUN npm install
RUN ls


# wait for postgres

COPY start_server.sh /start_server.sh
RUN chmod +x /start_server.sh

COPY wait_for_it.sh /wait_for_it.sh
RUN chmod +x /wait_for_it.sh

# ENTRYPOINT "/start_server.sh" && /bin/bash

CMD ["/wait_for_it.sh", "-s", "db:5432", "--", "/start_server.sh"]

