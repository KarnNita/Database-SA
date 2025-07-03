FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .
# COPY public public

ARG DATABASE_URL

EXPOSE 3000
