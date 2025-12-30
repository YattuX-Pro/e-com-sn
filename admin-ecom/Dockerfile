FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Argument de build pour l'URL de l'API
ARG NEXT_PUBLIC_API_URL=http://localhost:5001
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
