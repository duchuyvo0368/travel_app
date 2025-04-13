# --- Build Phase ---
FROM node:20 AS build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .

# --- Debugging Step ---
RUN ls -al /frontend && npm run build

# --- Serve Phase ---
FROM node:20
WORKDIR /frontend
RUN npm install -g serve
COPY --from=build /frontend/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
