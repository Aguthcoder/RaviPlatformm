export interface EventData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  city: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  image: string;
  active: boolean;
  waitingCount?: number;
}

export const EVENTS_DATA: EventData[] = [
  {
    id: "hamneshin-cafe",
    title: "کافه‌گفتگو همنشین",
    subtitle: "گفتگوی صمیمی با هدایت تسهیل‌گر و بازی‌های ارتباطی",
    category: "همنشین",
    city: "تهران",
    date: "پنجشنبه ۲۸ فروردین",
    time: "۱۸:۰۰ تا ۲۰:۰۰",
    price: 390000,
    capacity: 20,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    active: true,
  },
  {
    id: "hamsohbat-book",
    title: "جمع کتاب‌خوانی هم صحبت",
    subtitle: "هم‌صحبتی پیرامون کتاب و تجربه‌های فردی",
    category: "هم صحبت",
    city: "اصفهان",
    date: "جمعه ۲۹ فروردین",
    time: "۱۶:۰۰ تا ۱۸:۳۰",
    price: 320000,
    capacity: 18,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
    active: true,
  },
  {
    id: "hampa-walk",
    title: "پیاده‌روی شهری هم پا",
    subtitle: "گروه هم‌پا برای مسیرهای کوتاه و گفتگوی فعال",
    category: "هم پا",
    city: "شیراز",
    date: "شنبه ۳۰ فروردین",
    time: "۱۷:۰۰ تا ۱۹:۰۰",
    price: 280000,
    capacity: 24,
    image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1200&q=80",
    active: true,
  },
  {
    id: "inactive-art",
    title: "کارگاه هنر جمعی",
    subtitle: "فعلاً غیرفعال - امکان پیش‌رزرو فعال است",
    category: "هنر و سرگرمی",
    city: "تهران",
    date: "به‌زودی",
    time: "-",
    price: 0,
    capacity: 30,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80",
    active: false,
    waitingCount: 15,
  },
  {
    id: "inactive-business",
    title: "شب شبکه‌سازی",
    subtitle: "فعلاً غیرفعال - امکان پیش‌رزرو فعال است",
    category: "کسب‌وکار",
    city: "تهران",
    date: "به‌زودی",
    time: "-",
    price: 0,
    capacity: 40,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
    active: false,
    waitingCount: 11,
  },
];
