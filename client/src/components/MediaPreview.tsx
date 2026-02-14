import React from 'react';
import { UploadedFile } from './FileUpload';

interface MediaPreviewProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  theme: 'light' | 'dark';
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ files, onRemoveFile, theme }) => {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {files.map(file => (
        <div
          key={file.id}
          className={`relative rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          {/* صور */}
          {file.type === 'image' && (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-32 object-cover"
            />
          )}

          {/* فيديو */}
          {file.type === 'video' && (
            <video
              src={file.url}
              className="w-full h-32 object-cover"
              controls
            />
          )}

          {/* ملفات PDF و أخرى */}
          {(file.type === 'pdf' || file.type === 'file') && (
            <div className={`w-full h-32 flex flex-col items-center justify-center ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}>
              <div className="text-3xl mb-2">
                {file.type === 'pdf' ? '📄' : '📎'}
              </div>
              <p className={`text-xs text-center px-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
              </p>
            </div>
          )}

          {/* YouTube */}
          {file.type === 'youtube' && (
            <div className="w-full h-32 bg-black flex items-center justify-center">
              <img
                src={`https://img.youtube.com/vi/${file.youtubeId}/maxresdefault.jpg`}
                alt="YouTube thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-4xl">▶️</div>
              </div>
            </div>
          )}

          {/* زر الحذف */}
          <button
            onClick={() => onRemoveFile(file.id)}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition text-xs font-bold"
            title="Remove file"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
