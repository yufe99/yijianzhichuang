# 一键智创 AI - 技术规格文档

## 1. 项目概述

### 1.1 产品名称
一键智创 AI (One-Click AI Creator)

### 1.2 项目类型
AI视频生成客户端/Web端软件

### 1.3 核心定位
"零门槛、全自动"的AI视频生成工具，将复杂的多模态大模型和多智能体技术隐藏在后台。

---

## 2. 技术架构

### 2.1 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Web/客户端)                      │
│  ┌─────────┐  ┌─────────────┐  ┌──────────┐                │
│  │ 输入界面 │→ │ 进度流水线  │→ │ 结果预览 │                │
│  └─────────┘  └─────────────┘  └──────────┘                │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                       后端服务 (API)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ 任务调度 │  │ AI处理   │  │ 渲染引擎 │  │ 账号管理    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    外部AI服务集成                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│  │ LLM    │ │ TTS    │ │ 数字人 │ │ 生图   │ │ 视频渲染 │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈选型

#### 前端
- **框架**: React 18 + TypeScript
- **UI库**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **HTTP客户端**: Axios
- **WebSocket**: socket.io-client
- **视频播放器**: video.js

#### 后端
- **框架**: FastAPI (Python 3.10+)
- **数据库**: PostgreSQL + Redis
- **任务队列**: Celery + Redis
- **ORM**: SQLAlchemy 2.0
- **AI集成**: LangChain

### 2.3 项目结构
```
yijianzhichuang/
├── client/                    # 前端项目
│   ├── src/
│   │   ├── components/       # UI组件
│   │   ├── pages/            # 页面组件
│   │   ├── hooks/            # 自定义Hooks
│   │   ├── services/         # API服务
│   │   ├── stores/           # 状态管理
│   │   ├── types/            # TypeScript类型
│   │   └── utils/            # 工具函数
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # 后端项目
│   ├── app/
│   │   ├── api/              # API路由
│   │   ├── core/             # 核心配置
│   │   ├── models/           # 数据模型
│   │   ├── services/         # 业务逻辑
│   │   ├── tasks/            # 异步任务
│   │   └── utils/            # 工具函数
│   ├── requirements.txt
│   └── main.py
│
└── docs/                      # 文档
```

---

## 3. 功能模块设计

### 3.1 前端模块

#### 3.1.1 首页 - 万能输入框
```typescript
interface HomePageProps {
  // 状态
  inputMode: 'link' | 'file' | 'text';
  inputContent: string;
  videoMode: 'anchor' | 'manga';
  
  // 方法
  onInputModeChange: (mode: string) => void;
  onContentChange: (content: string) => void;
  onVideoModeChange: (mode: string) => void;
  onStartGenerate: () => void;
}
```

#### 3.1.2 进度页 - 流水线
```typescript
interface ProgressPageProps {
  // 状态
  taskId: string;
  currentStage: PipelineStage;
  progress: number;
  stages: PipelineStage[];
  
  // 阶段类型
  type PipelineStage = 
    | 'parsing'      // 解析素材
    | 'rewriting'   // AI改写
    | 'voice'       // 声音合成
    | 'digital_human' // 数字人生成
    | 'storyboard'  // 分镜设计
    | 'image_gen'   // 图片生成
    | 'video_render' // 视频渲染
    | 'packaging'  // 智能包装
    | 'complete';   // 完成
}
```

#### 3.1.3 结果页 - 预览与分发
```typescript
interface ResultPageProps {
  // 状态
  videoUrl: string;
  thumbnail: string;
  duration: number;
  platforms: Platform[];
  isPublished: boolean;
  
  // 方法
  onPreview: () => void;
  onDownload: () => void;
  onPublish: (platforms: string[]) => void;
  onEdit: (segment: VideoSegment) => void;
}
```

### 3.2 后端模块

#### 3.2.1 任务服务
```python
class VideoTaskService:
    def create_task(self, user_id: str, input_data: TaskInput) -> str:
        """创建视频生成任务"""
        
    def get_task_status(self, task_id: str) -> TaskStatus:
        """获取任务状态"""
        
    def cancel_task(self, task_id: str) -> bool:
        """取消任务"""
```

#### 3.2.2 AI处理服务
```python
class AIProcessingService:
    def parse_content(self, input_data: ContentInput) -> ParsedContent:
        """解析输入内容"""
        
    def rewrite_content(self, content: ParsedContent, style: StyleConfig) -> RewrittenContent:
        """AI改写文案"""
        
    def check_compliance(self, content: str) -> ComplianceResult:
        """合规审查"""
```

#### 3.2.3 口播引擎
```python
class AnchorVideoEngine:
    def synthesize_voice(self, text: str, voice_id: str) -> AudioResult:
        """语音合成"""
        
    def generate_digital_human(self, audio: AudioResult, avatar_id: str) -> VideoResult:
        """数字人生成"""
        
    def add_subtitle(self, video: VideoResult, text: str) -> VideoResult:
        """添加字幕"""
        
    def add_bgm(self, video: VideoResult, style: str) -> VideoResult:
        """添加背景音乐"""
```

#### 3.2.4 漫剧引擎
```python
class MangaVideoEngine:
    def generate_storyboard(self, script: str) -> List[Storyboard]:
        """生成分镜"""
        
    def generate_prompts(self, storyboard: Storyboard) -> List[ImagePrompt]:
        """生成提示词"""
        
    def generate_images(self, prompts: List[ImagePrompt]) -> List[ImageResult]:
        """批量生图"""
        
    def add_ken_burns(self, images: List[ImageResult]) -> List[VideoClip]:
        """添加运镜效果"""
        
    def merge_to_video(self, clips: List[VideoClip], audio: AudioResult) -> VideoResult:
        """合成视频"""
```

#### 3.2.5 账号管理
```python
class AccountService:
    def bind_platform(self, user_id: str, platform: Platform, auth_data: AuthData) -> str:
        """绑定平台账号"""
        
    def publish_video(self, task_id: str, platforms: List[str]) -> PublishResult:
        """发布视频"""
        
    def schedule_publish(self, task_id: str, publish_time: datetime) -> str:
        """定时发布"""
```

### 3.3 数据库模型

#### 3.3.1 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.3.2 任务表 (video_tasks)
```sql
CREATE TABLE video_tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    input_type VARCHAR(50),       -- link, file, text
    input_content TEXT,
    video_mode VARCHAR(50),       -- anchor, manga
    status VARCHAR(50),           -- pending, processing, completed, failed
    current_stage VARCHAR(50),
    progress INT DEFAULT 0,
    output_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.3.3 平台账号表 (platform_accounts)
```sql
CREATE TABLE platform_accounts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    platform VARCHAR(50),         -- douyin, kuaishou, xiaohongshu, bilibili, videocom
    platform_user_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. API接口设计

### 4.1 任务接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/tasks | 创建视频生成任务 |
| GET | /api/v1/tasks/{task_id} | 获取任务状态 |
| GET | /api/v1/tasks/{task_id}/progress | 获取任务进度(WebSocket) |
| DELETE | /api/v1/tasks/{task_id} | 取消任务 |

### 4.2 内容处理接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/parse | 解析输入内容 |
| POST | /api/v1/rewrite | AI改写文案 |
| POST | /api/v1/compliance/check | 合规检查 |

### 4.3 账号接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/accounts | 获取已绑定账号 |
| POST | /api/v1/accounts/bind | 绑定新账号 |
| DELETE | /api/v1/accounts/{id} | 解绑账号 |

### 4.4 发布接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/publish | 发布视频到平台 |
| POST | /api/v1/publish/schedule | 定时发布 |

---

## 5. 流水线设计

### 5.1 口播视频流水线
```
输入 → 解析 → 改写 → 合规检查 → 语音合成 → 数字人生成 → 字幕 → BGM → 输出
```

### 5.2 漫剧视频流水线
```
输入 → 解析 → 改写 → 合规检查 → 分镜 → 提示词 → 生图 → 运镜 → 配音 → 音效 → 字幕 → BGM → 输出
```

### 5.3 错误处理机制
- 每个阶段重试最多3次
- 单个阶段失败不影响其他阶段
- 失败阶段自动降级处理
- 详细错误日志记录

---

## 6. 安全与合规

### 6.1 敏感词过滤
- 内置违禁词库（动态更新）
- 极限词自动替换
- 支持自定义词库

### 6.2 平台合规
- 各平台内容规范检查
- 标题/描述自动优化
- 热门话题标签推荐

---

## 7. 性能目标

| 指标 | 目标值 |
|------|--------|
| 口播视频(2分钟) | ≤3分钟 |
| 漫剧视频(3分钟) | ≤8分钟 |
| API响应时间 | ≤500ms |
| 并发任务数 | 支持100+ |

---

## 8. 部署架构

### 8.1 开发环境
- 前端: Vite Dev Server
- 后端: FastAPI (Uvicorn)
- 数据库: SQLite (开发) / PostgreSQL (生产)
- 队列: Redis

### 8.2 生产环境
- 前端: Nginx + 静态文件
- 后端: Gunicorn + Uvicorn workers
- 数据库: PostgreSQL 主从
- 对象存储: S3/OSS
- CDN: 视频分发

---

*文档版本: 1.0*
*创建日期: 2026-03-01*
