import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Скрываем значок Next.js в режиме разработки — он перекрывает кнопки прототипа
  devIndicators: false,
  images: {
    // В прототипе фотографии уже подготовлены по размеру или загружаются
    // пользователем как data URL, поэтому серверная оптимизация не нужна.
    unoptimized: true,
  },
};

export default nextConfig;
