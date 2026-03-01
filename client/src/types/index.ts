export type InputMode = 'link' | 'file' | 'text';
export type VideoMode = 'anchor' | 'manga';
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type PipelineStage = 
  | 'parsing'
  | 'rewriting'
  | 'compliance_check'
  | 'voice'
  | 'digital_human'
  | 'storyboard'
  | 'image_gen'
  | 'video_render'
  | 'packaging'
  | 'complete';

export interface PipelineStageInfo {
  key: PipelineStage;
  label: string;
  description: string;
}

export const PIPELINE_STAGES: Record<VideoMode, PipelineStageInfo[]> = {
  anchor: [
    { key: 'parsing', label: '解析素材', description: '提取视频/文案内容' },
    { key: 'rewriting', label: 'AI改写', description: '智能改写文案' },
    { key: 'compliance_check', label: '合规检查', description: '敏感词过滤' },
    { key: 'voice', label: '语音合成', description: '克隆声音合成' },
    { key: 'digital_human', label: '数字人生成', description: 'AI驱动口播' },
    { key: 'packaging', label: '智能包装', description: '字幕+配乐' },
    { key: 'complete', label: '完成', description: '生成完成' },
  ],
  manga: [
    { key: 'parsing', label: '解析素材', description: '提取视频/文案内容' },
    { key: 'rewriting', label: 'AI改写', description: '扩写为剧本' },
    { key: 'compliance_check', label: '合规检查', description: '敏感词过滤' },
    { key: 'storyboard', label: 'AI分镜', description: '生成分镜脚本' },
    { key: 'image_gen', label: 'AI绘图', description: '批量生成分镜图' },
    { key: 'video_render', label: '视频渲染', description: '添加运镜效果' },
    { key: 'packaging', label: '智能包装', description: '字幕+配乐' },
    { key: 'complete', label: '完成', description: '生成完成' },
  ],
};

export interface TaskInput {
  input_mode: InputMode;
  input_content: string;
  video_mode: VideoMode;
}

export interface Task {
  id: string;
  input_mode: InputMode;
  input_content: string;
  video_mode: VideoMode;
  status: TaskStatus;
  current_stage: PipelineStage;
  progress: number;
  output_url?: string;
  thumbnail?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  bound: boolean;
}

export const PLATFORMS: Platform[] = [
  { id: 'douyin', name: '抖音', icon: '抖音', bound: false },
  { id: 'kuaishou', name: '快手', icon: '快手', bound: false },
  { id: 'xiaohongshu', name: '小红书', icon: '小红书', bound: false },
  { id: 'bilibili', name: 'B站', icon: 'B站', bound: false },
  { id: 'weixin', name: '视频号', icon: '视频号', bound: false },
];
