FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]

docker run -d \
--name postgres-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=tododb \
-p 5432:5432 \
postgres

docker run -d \
--name postgres-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=11111 \
-e POSTGRES_DB=tododb \
-p 5432:5432 \
postgres


