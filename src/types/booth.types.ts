export type BoothLayout =
  | 'single' | 'double' | 'triple' | 'quad'
  | 'strip-2' | 'strip-3' | 'strip-4'
  | 'grid-2x2' | 'grid-3x3'
  | 'wedding' | 'birthday'
  | 'landscape' | 'portrait' | 'square';

export interface CaptureSettings {
  countdown: number;
  interval: number;
  totalShots: number;
  quality: number;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  background?: string;
  frame?: FrameConfig;
  stickers?: StickerConfig[];
  text?: TextConfig[];
  layout: BoothLayout;
  isPremium: boolean;
  tags: string[];
}

export type TemplateCategory =
  | 'wedding' | 'graduation' | 'birthday' | 'corporate'
  | 'christmas' | 'ramadhan' | 'eid' | 'cny' | 'halloween'
  | 'valentine' | 'baby-shower' | 'engagement' | 'anniversary'
  | 'travel' | 'nature' | 'floral' | 'luxury' | 'modern'
  | 'minimalist' | 'classic' | 'kids' | 'neon' | 'retro'
  | 'gaming' | 'cyberpunk' | 'school' | 'kpop' | 'polaroid'
  | 'scrapbook' | 'vintage' | 'booth-strip';

export interface FrameConfig {
  type: 'border' | 'overlay' | 'mask';
  src: string;
  opacity: number;
  blendMode: string;
}

export interface StickerConfig {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
}

export interface TextConfig {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

export interface Package {
  id: string;
  name: 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';
  price: number;
  prints: number;
  photos: number;
  duration: number;
  premiumTemplates: boolean;
  hdDownload: boolean;
  cloudGallery: boolean;
}

export interface Transaction {
  id: string;
  packageId: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  paymentMethod: 'qris' | 'bank_transfer' | 'ewallet';
  createdAt: Date;
  paidAt?: Date;
  invoiceUrl?: string;
  qrDownload?: string;
}
