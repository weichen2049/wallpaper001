'use client';

import { useState } from 'react';
import Image from 'next/image';

// 定义主题选项
const themes = [
  { id: 'character', label: '人物', prompt: 'character portrait' },
  { id: 'animal', label: '动物', prompt: 'animal' },
  { id: 'technology', label: '科技', prompt: 'futuristic technology' },
  { id: 'landscape', label: '风景', prompt: 'beautiful landscape' },
  { id: 'architecture', label: '建筑', prompt: 'architecture' },
  { id: 'abstract', label: '抽象', prompt: 'abstract art' },
];

// 定义风格选项
const styles = [
  { id: 'realistic', label: '写实', prompt: 'photorealistic, highly detailed, 8k' },
  { id: 'natural', label: '自然', prompt: 'natural lighting, organic, serene' },
  { id: 'anime', label: '二次元', prompt: 'anime style, manga, vibrant colors' },
  { id: 'cyberpunk', label: '赛博朋克', prompt: 'cyberpunk, neon lights, futuristic city' },
  { id: 'fantasy', label: '奇幻', prompt: 'fantasy art, magical, ethereal' },
  { id: 'minimalist', label: '极简', prompt: 'minimalist, clean, simple composition' },
];

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 生成壁纸
  const handleGenerate = async () => {
    if (!selectedTheme || !selectedStyle) {
      setError('请选择主题和风格');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await fetch('/api/wallpaper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: selectedTheme,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成失败');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 下载图片
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `wallpaper-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI 壁纸生成器
          </h1>
          <p className="text-gray-600">选择主题和风格，生成专属壁纸</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：选择区域 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* 主题选择 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                选择主题
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedTheme === theme.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 风格选择 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                选择风格
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedStyle === style.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !selectedTheme || !selectedStyle}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '生成中...' : '生成壁纸'}
            </button>
          </div>

          {/* 右侧：预览区域 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              预览效果
            </h2>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">正在生成壁纸...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={generatedImage}
                    alt="Generated wallpaper"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>选择主题和风格后生成壁纸</p>
                </div>
              )}
            </div>

            {/* 下载按钮 */}
            {generatedImage && (
              <button
                onClick={handleDownload}
                className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
              >
                下载壁纸
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}