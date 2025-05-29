FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production
RUN echo "VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY" >> .env.production

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173", "--host", "0.0.0.0"]