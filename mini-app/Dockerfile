FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-timeout 120000 \
    && npm config set registry https://registry.npmjs.org/ \
    && npm install --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
