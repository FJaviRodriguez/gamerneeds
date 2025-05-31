FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

ENV HOST=0.0.0.0
EXPOSE 5000

CMD ["npm", "start"]