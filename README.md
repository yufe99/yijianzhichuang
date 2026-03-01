# 一键智创 AI

"不需要学剪辑，不需要懂AI，甚至不需要会写字。"

一款主打"零门槛、全自动"的AI视频生成客户端/Web端软件。

## 功能特性

- **万能输入**: 支持链接/文件/文案多种输入方式
- **双轨生成引擎**: 
  - 数字人口播/带货模式
  - AI漫剧/故事模式
- **全自动化**: 一键生成，无需干预
- **多平台分发**: 支持抖音、快手、小红书、B站、视频号

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Vite

### 后端
- FastAPI (Python 3.10+)
- SQLAlchemy
- Celery + Redis

## 快速开始

### 前端

```bash
cd client
npm install
npm run dev
```

### 后端

```bash
cd server

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 复制环境变量
cp .env.example .env

# 运行服务
uvicorn app.main:app --reload
```

## 项目结构

```
yijianzhichuang/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/     # UI组件
│   │   ├── pages/          # 页面
│   │   ├── services/       # API服务
│   │   ├── stores/         # 状态管理
│   │   └── types/          # 类型定义
│   └── package.json
│
├── server/                 # 后端项目
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据模型
│   │   └── services/       # 业务逻辑
│   └── requirements.txt
│
└── SPEC.md                 # 技术规格文档
```

## 核心流程

1. **输入**: 用户在首页输入素材（链接/文件/文案）
2. **处理**: AI自动解析、改写、生成
3. **输出**: 预览视频并一键分发到各平台

## 开发说明

当前版本为MVP演示版本，AI生成模块为模拟实现。

实际生产环境需要集成:
- LLM服务 (OpenAI/Claude/国产大模型)
- TTS服务 (语音合成)
- 数字人服务 (D-ID/HeyGen/国产方案)
- 生图服务 (Midjourney/SD/国产方案)
- 视频渲染服务

## License

MIT
