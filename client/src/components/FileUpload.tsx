import React, { useRef } from 'react';
import { UI_STRINGS } from '../constants';

export interface UploadedFile {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'file' | 'youtube';
  name: string;
  url: string;
  size?: number;
  youtubeId?: string;
}

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
  maxSize?: number; // بالميجابايت
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  language,
  theme,
  maxSize = 10
}) => {
  const t = UI_STRINGS[language];
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [showYoutubeInput, setShowYoutubeInput] = React.useState(false);

  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(t.maxFileSize);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onFileUpload({
          id: `img-${Date.now()}`,
          type: 'image',
          name: file.name,
          url: url,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(t.maxFileSize);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onFileUpload({
          id: `vid-${Date.now()}`,
          type: 'video',
          name: file.name,
          url: url,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(t.maxFileSize);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'file';
        onFileUpload({
          id: `file-${Date.now()}`,
          type: fileType,
          name: file.name,
          url: url,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleYoutubeEmbed = () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) {
      alert('Invalid YouTube URL');
      return;
    }

    onFileUpload({
      id: `youtube-${Date.now()}`,
      type: 'youtube',
      name: 'YouTube Video',
      url: `https://www.youtube.com/embed/${youtubeId}`,
      youtubeId: youtubeId
    });

    setYoutubeUrl('');
    setShowYoutubeInput(false);
  };

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {/* زر رفع الصور */}
      <button
        onClick={() => imageInputRef.current?.click()}
        className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title={t.addImages}
      >
        🖼️ {language === 'AR' ? 'صورة' : 'Image'}
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* زر رفع الفيديو */}
      <button
        onClick={() => videoInputRef.current?.click()}
        className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title={t.addVideos}
      >
        🎬 {language === 'AR' ? 'فيديو' : 'Video'}
      </button>
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* زر رفع الملفات */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title={t.addFiles}
      >
        📄 {language === 'AR' ? 'ملف' : 'File'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* زر إدراج YouTube */}
      <button
        onClick={() => setShowYoutubeInput(!showYoutubeInput)}
        className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title={t.embedYoutube}
      >
        ▶️ {language === 'AR' ? 'يوتيوب' : 'YouTube'}
      </button>

      {/* حقل إدراج YouTube */}
      {showYoutubeInput && (
        <div className={`flex gap-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className={`px-3 py-1 rounded border ${
              theme === 'dark'
                ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
          <button
            onClick={handleYoutubeEmbed}
            className="px-3 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700"
          >
            {language === 'AR' ? 'إدراج' : 'Embed'}
          </button>
          <button
            onClick={() => setShowYoutubeInput(false)}
            className={`px-3 py-1 rounded font-bold ${
              theme === 'dark'
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
            }`}
          >
            {language === 'AR' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
