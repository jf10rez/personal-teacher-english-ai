FROM node:20-alpine AS development
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN rm -f *.tsbuildinfo && pnpm build
EXPOSE 4000
CMD ["pnpm", "start:dev"]

FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
COPY --from=development /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main"]
