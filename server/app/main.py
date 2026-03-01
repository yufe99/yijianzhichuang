from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api import tasks, accounts, publish
from app.core.config import settings
from app.core.websocket import ws_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ws_manager.connect()
    yield
    await ws_manager.disconnect()


app = FastAPI(
    title="一键智创 AI API",
    description="AI视频生成后端服务",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["任务"])
app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["账号"])
app.include_router(publish.router, prefix="/api/v1/publish", tags=["发布"])


@app.get("/")
async def root():
    return {"message": "一键智创 AI API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
