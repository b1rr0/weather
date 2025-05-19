FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

COPY .env ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

EXPOSE 3332

CMD ["node", "dist/main"]