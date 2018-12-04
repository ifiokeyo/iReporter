#! /usr/bin/env bash


# function wait_for_db() {
#     pg_isready -h db -U andeladeveloper -p 5432 -q

#     if [ "$1" = "0" ]
#     then
#         return 0
#     else
#         return 1
#     fi

# }

# until wait_for_db; do
#   >&2 echo "Postgres is unavailable - sleeping"
#   sleep 1
# done
# >&2 echo "Postgres is up - continuing..."

cd server
sleep 30
ls
npm run migrate
popd
ls
npm run start-dev