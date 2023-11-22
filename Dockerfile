FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "."]
EXPOSE 5555