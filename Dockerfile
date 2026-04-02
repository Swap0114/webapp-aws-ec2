FROM node:latest 
WORKDIR /app 
COPY . /app 
RUN npm install express multer 
CMD ["node","index.js"]
EXPOSE 3000

