FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
