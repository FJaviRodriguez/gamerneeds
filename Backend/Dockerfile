FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

EXPOSE 5000

CMD ["npm", "start"]