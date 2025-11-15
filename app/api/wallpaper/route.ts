import { NextRequest, NextResponse } from 'next/server';

// 定义请求体类型
interface WallpaperRequest {
  theme: string;
  style: string;
}

// 定义错误类型
interface StabilityError {
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  request?: unknown;
  message: string;
}

// 主题映射
const themePrompts: Record<string, string> = {
  character: 'character portrait',
  animal: 'animal',
  technology: 'futuristic technology',
  landscape: 'beautiful landscape',
  architecture: 'architecture',
  abstract: 'abstract art',
};

// 风格映射
const stylePrompts: Record<string, string> = {
  realistic: 'photorealistic, highly detailed, 8k',
  natural: 'natural lighting, organic, serene',
  anime: 'anime style, manga, vibrant colors',
  cyberpunk: 'cyberpunk, neon lights, futuristic city',
  fantasy: 'fantasy art, magical, ethereal',
  minimalist: 'minimalist, clean, simple composition',
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 解析请求体
    const body = await request.json() as WallpaperRequest;
    const { theme, style } = body;

    // 验证参数
    if (!theme || !style) {
      return NextResponse.json(
        { error: '缺少必要参数：theme 和 style 是必需的' },
        { status: 400 }
      );
    }

    // 验证主题和风格是否有效
    if (!themePrompts[theme]) {
      return NextResponse.json(
        { error: `无效的主题: ${theme}` },
        { status: 400 }
      );
    }

    if (!stylePrompts[style]) {
      return NextResponse.json(
        { error: `无效的风格: ${style}` },
        { status: 400 }
      );
    }

    // 检查API密钥
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error('错误：未找到 STABILITY_API_KEY 环境变量');
      return NextResponse.json(
        { error: '服务器配置错误：缺少API密钥，请检查环境变量配置' },
        { status: 500 }
      );
    }

    // 拼接完整的prompt
    const fullPrompt = `${themePrompts[theme]}, ${stylePrompts[style]}, wallpaper, high quality, masterpiece`;

    console.log('========== 开始生成壁纸 ==========');
    console.log('主题:', theme);
    console.log('风格:', style);
    console.log('完整Prompt:', fullPrompt);
    console.log('================================');

    // 准备请求数据
    const formData = new FormData();
    formData.append('prompt', fullPrompt);
    formData.append('output_format', 'jpeg');

    // 调用Stable Diffusion API
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'image/*',
        },
        body: formData,
      }
    );

    // 检查响应状态
    if (response.ok) {
      console.log('✅ 壁纸生成成功');
      
      // 获取图片数据
      const imageBuffer = await response.arrayBuffer();
      console.log('图片大小:', imageBuffer.byteLength, 'bytes');
      
      // 成功生成图片，返回图片数据
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': imageBuffer.byteLength.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } else {
      // API返回错误
      const errorText = await response.text();
      console.error('❌ Stability API错误');
      console.error('状态码:', response.status);
      console.error('错误信息:', errorText);
      
      let userFriendlyMessage = '生成失败，请重试';
      
      // 根据不同的错误状态码提供友好的错误信息
      if (response.status === 401) {
        userFriendlyMessage = 'API密钥无效，请检查配置';
      } else if (response.status === 402) {
        userFriendlyMessage = 'API额度不足，请充值';
      } else if (response.status === 429) {
        userFriendlyMessage = '请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        userFriendlyMessage = 'API服务器错误，请稍后重试';
      }
      
      return NextResponse.json(
        { 
          error: userFriendlyMessage,
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }
  } catch (error: unknown) {
    // 捕获所有错误
    console.error('❌ 生成壁纸时出错:', error);

    // 类型保护：检查是否是Error对象
    if (error instanceof Error) {
      const err = error as StabilityError;
      
      // 请求超时
      if (err.code === 'ECONNABORTED') {
        console.error('请求超时');
        return NextResponse.json(
          { error: '请求超时（超过60秒），请重试' },
          { status: 408 }
        );
      }
      
      // 网络错误
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        console.error('网络连接错误:', err.code);
        return NextResponse.json(
          { error: '无法连接到API服务器，请检查网络连接' },
          { status: 503 }
        );
      }
      
      // API返回的错误响应
      if (err.response) {
        console.error('API响应错误:', err.response.status);
        return NextResponse.json(
          { 
            error: `API错误 (${err.response.status})`,
            details: err.message
          },
          { status: err.response.status }
        );
      }
      
      // 请求配置错误
      if (err.request) {
        console.error('请求错误，未收到响应');
        return NextResponse.json(
          { error: '未收到API响应，请重试' },
          { status: 500 }
        );
      }
      
      // 其他Error对象
      console.error('错误信息:', err.message);
      return NextResponse.json(
        { 
          error: '服务器内部错误',
          details: err.message
        },
        { status: 500 }
      );
    }

    // 处理JSON解析错误
    if (error instanceof SyntaxError) {
      console.error('请求体解析错误');
      return NextResponse.json(
        { error: '请求格式错误' },
        { status: 400 }
      );
    }

    // 其他未知错误
    console.error('未知错误类型');
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        details: '发生未知错误'
      },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}