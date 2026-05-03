FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 ADD THIS LINE (CRITICAL)
RUN npx prisma generate

EXPOSE 3000

CMD ["npx", "nodemon", "index.js"]