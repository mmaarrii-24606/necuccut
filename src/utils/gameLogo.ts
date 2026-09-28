import defaultLogoImg from '../assets/images/ne_cuc_cut_logo_1790513158559.jpg';

const CUSTOM_LOGO_STORAGE_KEY = 'poop_dodger_custom_game_logo_v1';

export const DEFAULT_GAME_LOGO: string = defaultLogoImg || '/logo.jpg';

export function getGameLogo(): string {
  try {
    const saved = localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
    if (saved && saved.startsWith('data:image/')) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_GAME_LOGO;
}

export function setCustomGameLogo(dataUrl: string): string {
  try {
    localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, dataUrl);
  } catch {
    // ignore storage quota errors
  }
  syncFaviconWithLogo(dataUrl);
  return dataUrl;
}

export function resetGameLogo(): string {
  try {
    localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
  } catch {
    // ignore
  }
  syncFaviconWithLogo(DEFAULT_GAME_LOGO);
  return DEFAULT_GAME_LOGO;
}

export function isCustomGameLogo(): boolean {
  try {
    const saved = localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
    return Boolean(saved && saved.startsWith('data:image/'));
  } catch {
    return false;
  }
}

export function syncFaviconWithLogo(logoUrl: string): void {
  if (typeof document === 'undefined') return;

  let iconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!iconLink) {
    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    document.head.appendChild(iconLink);
  }
  iconLink.href = logoUrl;

  let appleIconLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
  if (!appleIconLink) {
    appleIconLink = document.createElement('link');
    appleIconLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleIconLink);
  }
  appleIconLink.href = logoUrl;
}

/**
 * Resize and convert an uploaded image File into a crisp data URL for the game logo
 */
export function processUploadedLogoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP, GIF).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png', 0.92);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Không thể đọc hình ảnh này.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Lỗi khi tải file hình ảnh.'));
    reader.readAsDataURL(file);
  });
}
