# 免费部署指南

## 方案一：前端 Vercel + 后端 Render

### 第一步：部署后端 (Render)

1. 注册 [Render.com](https://render.com) 账号 (用 GitHub 登录)
2. 创建 New Web Service
3. 连接到您的 GitHub 仓库
4. 配置：
   - Name: yijianzhichuang-api
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 点击 Create Web Service

### 第二步：部署前端 (Vercel)

1. 注册 [Vercel.com](https://vercel.com) 账号 (用 GitHub 登录)
2. Import GitHub 仓库
3. 配置：
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
4. 添加环境变量：
   - `VITE_API_URL` = 您的 Render 后端地址 (如 https://yijianzhichuang-api.onrender.com)
5. 点击 Deploy

---

## 方案二：一体化部署 (Railway)

1. 注册 [Railway.app](https://railway.app)
2. 创建新项目，选择 "Deploy from GitHub repo"
3. 添加 MySQL 和 Redis 插件 (可选)
4. 部署会自动进行

---

## GitHub 推送步骤

```bash
# 1. 初始化 git
git init
git add .
git commit -m "Initial commit"

# 2. 创建 GitHub 仓库
# 访问 https://github.com/new 创建仓库

# 3. 推送
git remote add origin https://github.com/您的用户名/仓库名.git
git push -u origin main
```

---

## 注意事项

- 免费平台有休眠机制，长时间无访问会休眠
- 首次访问可能需要 30-60 秒唤醒
- 生产环境建议使用付费方案
