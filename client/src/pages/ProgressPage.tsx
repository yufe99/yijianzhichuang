import { useAppStore } from '@/stores/appStore';
import { PIPELINE_STAGES, type VideoMode, type PipelineStage } from '@/types';
import { cn } from '@/utils';
import { Loader2, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function ProgressPage() {
  const { currentTask, videoMode, resetTask } = useAppStore();
  
  if (!currentTask) {
    return null;
  }
  
  const stages = PIPELINE_STAGES[videoMode as VideoMode];
  const currentIndex = stages.findIndex(s => s.key === currentTask.current_stage);
  
  const getStageIcon = (index: number, stage: PipelineStage) => {
    if (stage === 'complete') {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (index < currentIndex) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (index === currentIndex) {
      return <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />;
    }
    return <Circle className="w-6 h-6 text-slate-300" />;
  };
  
  const getStageStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'processing';
    return 'pending';
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          AI 正在工作中...
        </h2>
        <p className="text-slate-500">
          {videoMode === 'anchor' ? '口播视频生成中' : '漫剧视频生成中'}
        </p>
      </div>
      
      <div className="glass rounded-2xl p-6 shadow-xl mb-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>整体进度</span>
            <span>{currentTask.progress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
              style={{ width: `${currentTask.progress}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className={cn(
                'flex items-center gap-4 p-3 rounded-xl transition-all',
                getStageStatus(index) === 'processing' && 'bg-primary-50',
                getStageStatus(index) === 'completed' && 'bg-green-50'
              )}
            >
              {getStageIcon(index, stage.key)}
              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  getStageStatus(index) === 'pending' && 'text-slate-400',
                  getStageStatus(index) === 'processing' && 'text-primary-600',
                  getStageStatus(index) === 'completed' && 'text-green-600'
                )}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-400">{stage.description}</p>
              </div>
              
              {index < stages.length - 1 && (
                <ArrowRight className={cn(
                  'w-4 h-4',
                  index < currentIndex ? 'text-green-400' : 'text-slate-200'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-4">
          💡 您可以离开去做其他事情，生成完成后会通知您
        </p>
        
        <button
          onClick={resetTask}
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          取消任务
        </button>
      </div>
    </div>
  );
}
