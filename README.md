docker postgres run command is 
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -v brainlydb:/var/lib/postgresql/data postgres

postgres url is 
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"