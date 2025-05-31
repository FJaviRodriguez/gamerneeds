FROM node:22-alpine

WORKDIR /app

ARG VITE_API_URL
ARG VITE_STRIPE_PUBLIC_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY" >> .env

# Build the application
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]