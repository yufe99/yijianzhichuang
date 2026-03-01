import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { publishApi } from '@/services/api';
import { PLATFORMS } from '@/types';
import { formatDuration, cn } from '@/utils';
import { Play, Download, Share2, Check, Loader2, Edit3, ChevronRight } from 'lucide-react';

export default function ResultPage() {
  const { currentTask, videoMode, resetTask, goToPage } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  
  if (!currentTask) {
    return null;
  }
  
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };
  
  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;
    
    setIsPublishing(true);
    try {
      await publishApi.publish(currentTask.id, selectedPlatforms);
      setPublished(true);
    } catch (err) {
      console.error('发布失败', err);
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleDownload = () => {
    if (currentTask.output_url) {
      window.open(currentTask.output_url, '_blank');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          视频生成完成！
        </h2>
        <p className="text-slate-500">
          {videoMode === 'anchor' ? '口播视频' : '漫剧视频'} · {formatDuration(currentTask.duration || 0)}
        </p>
      </div>
      
      <div className="glass rounded-2xl overflow-hidden shadow-xl mb-6">
        <div className="relative aspect-video bg-slate-900">
          {currentTask.thumbnail && (
            <img
              src={currentTask.thumbnail}
              alt="视频封面"
              className="w-full h-full object-cover"
            />
          )}
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 group"
          >
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
              ) : (
                <Play className="w-8 h-8 text-slate-800 ml-1" />
              )}
            </div>
          </button>
          
          {currentTask.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-white text-sm">
              {formatDuration(currentTask.duration)}
            </div>
          )}
        </div>
        
        <div className="p-4 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            下载视频
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition-colors">
            <Edit3 className="w-5 h-5" />
            微调修改
          </button>
        </div>
      </div>
      
      <div className="glass rounded-2xl p-6 shadow-xl mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          一键分发到平台
        </h3>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                selectedPlatforms.includes(platform.id)
                  ? 'bg-primary-50 border-2 border-primary-500'
                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                selectedPlatforms.includes(platform.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              )}>
                {platform.icon[0]}
              </div>
              <span className="text-xs text-slate-600">{platform.name}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={handlePublish}
          disabled={selectedPlatforms.length === 0 || isPublishing || published}
          className={cn(
            'w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all',
            published
              ? 'bg-green-500 text-white'
              : selectedPlatforms.length > 0
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在发布...
            </>
          ) : published ? (
            <>
              <Check className="w-5 h-5" />
              发布成功
            </>
          ) : (
            <>
              全网发布
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        {published && (
          <p className="text-center text-sm text-green-600 mt-3">
            视频已成功发布到 {selectedPlatforms.length} 个平台
          </p>
        )}
      </div>
      
      <div className="text-center">
        <button
          onClick={() => { resetTask(); goToPage('home'); }}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          创建新视频
        </button>
      </div>
    </div>
  );
}
