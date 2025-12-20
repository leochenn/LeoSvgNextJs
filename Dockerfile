# 1. 安装依赖阶段
FROM node:18-alpine AS deps
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# 安装依赖
# RUN yarn --frozen-lockfile
# 如果您使用 npm, 用下面这行替换
RUN npm ci

# 2. 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 会自动加载 .env.* 文件
# 如果您有环境变量，请确保在Cloud Run服务中配置它们
ENV NEXT_TELEMETRY_DISABLED 1

# 构建 Next.js 应用
RUN npm run build

# 3. 运行阶段
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 从构建器阶段复制 standalone 输出
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 运行 Next.js 服务
# 默认端口是 3000
ENV PORT 3000

# 暴露端口
EXPOSE 3000

# 启动服务器
CMD ["node", "server.js"]
