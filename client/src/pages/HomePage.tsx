import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { taskApi } from '@/services/api';
import { wsService } from '@/services/websocket';
import { cn } from '@/utils';
import { Link, Video, FileText, Loader2, Sparkles, Users } from 'lucide-react';

type InputMode = 'link' | 'file' | 'text';

const inputModeOptions: { value: InputMode; label: string; icon: React.ReactNode; placeholder: string }[] = [
  { value: 'link', label: '链接', icon: <Link className="w-5 h-5" />, placeholder: '粘贴抖音/快手/小红书链接...' },
  { value: 'file', label: '文件', icon: <Video className="w-5 h-5" />, placeholder: '拖拽或点击上传视频/音频文件' },
  { value: 'text', label: '文案', icon: <FileText className="w-5 h-5" />, placeholder: '粘贴爆款文案、新闻链接或创意描述...' },
];

export default function HomePage() {
  const { inputMode, setInputMode, inputContent, setInputContent, videoMode, setVideoMode, startTask } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleStart = async () => {
    if (!inputContent.trim()) {
      setError('请输入内容');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const task = await taskApi.createTask({
        input_mode: inputMode,
        input_content: inputContent,
        video_mode: videoMode,
      });
      
      startTask(task);
      
      wsService.connect(task.id);
      wsService.onProgress((data) => {
        useAppStore.getState().updateTaskProgress(data.stage, data.progress);
      });
      wsService.onComplete((data) => {
        useAppStore.getState().completeTask(data.outputUrl, data.thumbnail, data.duration);
        wsService.disconnect();
      });
      wsService.onError((err) => {
        useAppStore.getState().failTask(err);
        wsService.disconnect();
      });
      
    } catch (err) {
      setError('创建任务失败，请重试');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          不需要学剪辑，不需要懂AI
        </h2>
        <p className="text-slate-500">输入素材，自动生成爆款视频</p>
      </div>
      
      <div className="glass rounded-2xl p-6 shadow-xl">
        <div className="flex gap-2 mb-6">
          {inputModeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setInputMode(option.value)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all',
                inputMode === option.value
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
        
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder={inputModeOptions.find(o => o.value === inputMode)?.placeholder}
          className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all text-base"
        />
        
        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>
      
      <div className="mt-8">
        <p className="text-center text-sm text-slate-500 mb-4">选择生成模式</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setVideoMode('anchor')}
            className={cn(
              'relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300',
              videoMode === 'anchor'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/25 scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-2 border-transparent hover:border-primary-200'
            )}
          >
            <div className="relative z-10">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                videoMode === 'anchor' ? 'bg-white/20' : 'bg-primary-100'
              )}>
                <Users className={cn('w-6 h-6', videoMode === 'anchor' ? 'text-white' : 'text-primary-600')} />
              </div>
              <h3 className={cn(
                'font-bold text-lg mb-1',
                videoMode === 'anchor' ? 'text-white' : 'text-slate-800'
              )}>
                口播/带货
              </h3>
              <p className={cn(
                'text-sm',
                videoMode === 'anchor' ? 'text-white/80' : 'text-slate-500'
              )}>
                数字人出镜，适合带货、IP口播
              </p>
            </div>
          </button>
          
          <button
            onClick={() => setVideoMode('manga')}
            className={cn(
              'relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300',
              videoMode === 'manga'
                ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-xl shadow-accent-500/25 scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-2 border-transparent hover:border-accent-200'
            )}
          >
            <div className="relative z-10">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                videoMode === 'manga' ? 'bg-white/20' : 'bg-accent-100'
              )}>
                <Sparkles className={cn('w-6 h-6', videoMode === 'manga' ? 'text-white' : 'text-accent-600')} />
              </div>
              <h3 className={cn(
                'font-bold text-lg mb-1',
                videoMode === 'manga' ? 'text-white' : 'text-slate-800'
              )}>
                故事漫剧
              </h3>
              <p className={cn(
                'text-sm',
                videoMode === 'manga' ? 'text-white/80' : 'text-slate-500'
              )}>
                AI绘画，适合小说推文、故事号
              </p>
            </div>
          </button>
        </div>
      </div>
      
      <button
        onClick={handleStart}
        disabled={isLoading || !inputContent.trim()}
        className="w-full mt-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            正在创建任务...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            开始一键制作
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-slate-400 mt-4">
        点击开始后，您可以去吃饭了，生成完成会通知您
      </p>
    </div>
  );
}
