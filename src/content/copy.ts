// All site copy lives here. Arabic is a first draft in Modern Standard Arabic —
// REVIEW(client): have a native speaker approve every `ar` string before launch.

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const site = {
  whatsapp: '9647729472451',
  phone: '+964 772 947 2451',
  email: 'contact@pluto-co.com',
  instagram: 'https://www.instagram.com/pluto_company_',
  facebook: 'https://www.facebook.com/share/19S5hYuN5U/',
  timeZone: 'Asia/Baghdad',
};

export const waLink = (message: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
export const mailLink = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const en = {
  meta: {
    title: 'Pluto — Aesthetic & Medical Devices, Iraq',
    description:
      "From the world's most respected laboratories to Iraq's leading clinics — Pluto imports and distributes aesthetic and medical devices, with nothing lost along the way.",
  },
  nav: { about: 'About', journey: 'Journey', portfolio: 'Flagship', advantages: 'Advantages', global: 'Coverage', menu: 'Menu', close: 'Close', switchTo: 'العربية' },
  cta: {
    partner: 'Become a Partner',
    visit: 'Request a Representative Visit',
    choose: 'Reach us by',
    whatsapp: 'WhatsApp',
    email: 'Email',
    partnerSubject: 'Partnership enquiry',
    visitSubject: 'Request for a representative visit',
    partnerMsg: 'Hello Pluto, I would like to become a partner. My clinic / company: ',
    visitMsg: 'Hello Pluto, I would like to request a representative visit. Clinic name and city: ',
  },
  dots: { top: 'Pluto', about: 'About', journey: 'Journey', product: 'Flagship', brands: 'Brands', advantages: 'Advantages', coverage: 'Coverage' },
  hero: {
    label: 'Aesthetic & medical devices — Iraq',
    name: 'Pluto Company',
    company: 'Company',
    title: ["The world's best,", 'brought home.'],
    intro:
      "Pluto imports and distributes aesthetic and medical devices from the world's most respected manufacturers to Iraq's leading clinics — with nothing lost along the way.",
    scroll: 'Scroll to explore',
  },
  journey: {
    label: 'The journey',
    title: 'From the source to your hands.',
    aria: 'A Pluto shipment travels from the laboratory, through our offices, into the hands of a clinic team.',
    beats: [
      { n: '01', title: 'Sourced at the origin.', body: 'We partner directly with manufacturers. No intermediaries, no grey market, no compromise.' },
      { n: '02', title: 'Verified in our hands.', body: 'Every shipment is inspected, documented and stored to specification before it carries our name.' },
      { n: '03', title: 'Delivered to yours.', body: 'Placed personally with the practitioners who depend on it — on time, intact, and accountable.' },
    ],
    final: 'Opened with confidence.',
  },
  manifesto: {
    label: 'About Pluto',
    text: "Pluto is Iraq's dedicated house for aesthetic and medical devices. We exist for the practitioner who refuses to guess — about where a product came from, how it travelled, or who stands behind it.",
    stats: [
      { value: '2020', label: 'Founded' },
      { value: '500+', label: 'Clinics & doctors served' },
      { value: '4', label: 'Exclusive brand lines' },
    ],
  },
  pillars: {
    label: 'What we stand on',
    items: [
      { title: 'Exclusive Distribution', body: 'The sole authorised distributor in Iraq for every line we carry. Each unit is genuine and traceable to its batch.' },
      { title: 'Clinical Partnership', body: 'We work beside physicians, not just for them — with product education, hands-on training and honest counsel.' },
      { title: 'Uncompromised Logistics', body: 'Stored and transported to manufacturer specification, handled by our own people from customs to clinic door.' },
      { title: 'A Curated Portfolio', body: 'We do not carry everything. We carry what we would stand behind in our own practice.' },
    ],
  },
  product: {
    label: 'The flagship',
    headline: 'Science, in its most refined form.',
    body: 'CLAPIO Konfid CHHA unites calcium hydroxyapatite with hyaluronic acid in a single sterile syringe — available in Iraq exclusively through Pluto.',
    aria: 'A CLAPIO carton lifts away to reveal a glass syringe; the gel extrudes in a clear spiral.',
    specsTitle: 'CLAPIO Konfid CHHA',
    specs: [
      ['Category', 'Dermal filler'],
      ['Composition', 'CaHA 557 mg + HA / ml'],
      ['Anaesthetic', 'With lidocaine'],
      ['Format', '1.5 ml × 1 syringe'],
      ['Included', '2 needles'],
      ['Sterility', 'Sterilised · single use'],
      ['Storage', '1 – 30 °C'],
      ['Manufacturer', 'GCS Co., Ltd.'],
      ['Availability', 'Licensed practitioners only'],
    ],
    second: { title: 'Every detail, traceable.', body: 'From batch number to delivery signature, the full history of every product is yours on request.' },
  },
  brands: { label: 'Our lines', title: 'Four houses. One exclusive partner in Iraq.' },
  advantages: {
    label: 'A better way to supply',
    items: [
      { title: 'Training & Education', body: 'Workshops and one-to-one sessions led by international trainers and our clinical team, so new technology arrives with the skill to use it.' },
      { title: 'Controlled Logistics', body: 'Temperature-controlled storage and transport that holds manufacturer specification through an Iraqi summer — and documents it.' },
      { title: 'Guaranteed Authenticity', body: 'Sourced only from the manufacturer. Verifiable, sealed, and backed by documentation on every unit.' },
      { title: 'Dedicated Representatives', body: 'A named representative for your clinic, who visits in person, knows your practice, and answers when you call.' },
      {
        title: 'Registration & Representation',
        body: 'We register manufacturers with the Iraqi Ministry of Health and the Kurdistan Region Ministry of Health, and act as their official representative in Iraq — so a product arrives fully licensed, and stays that way.',
      },
    ],
  },
  coverage: {
    label: 'Coverage',
    stats: [
      { label: 'Reach', value: 'All provinces' },
      { label: 'Headquartered in', value: 'Erbil, Iraq' },
      { label: 'Local time', value: 'TIME' },
    ],
    title: ['One partner.', 'Every province.'],
    closing: 'Tell us where you practise. A Pluto representative will come to you.',
    cities: ['Baghdad', 'Erbil', 'Duhok', 'Sulaymaniyah', 'Basra', 'Mosul', 'Kirkuk', 'Najaf', 'Karbala', 'Hillah', 'Ramadi', 'Tikrit', 'Baqubah', 'Kut', 'Amarah', 'Nasiriyah', 'Samawah', 'Diwaniyah', 'Halabja'],
  },
  footer: {
    offices: [
      { city: 'Erbil — Headquarters', address: 'Villa R5-44, Atconz (New Azadi)' },
      { city: 'Duhok', address: 'O3, Luxe Tower, Malta St.' },
      { city: 'Baghdad', address: 'Al Yarmouk, Mansour District' },
    ],
    inquiries: 'For inquiries',
    rights: '©2026 Pluto. All rights reserved',
    disclaimer: 'Products are intended for use by licensed healthcare professionals.',
  },
};

const ar: typeof en = {
  meta: {
    title: 'بلوتو — الأجهزة التجميلية والطبية في العراق',
    description: 'من أرقى المختبرات العالمية إلى أبرز العيادات في العراق — بلوتو تستورد وتوزّع الأجهزة التجميلية والطبية دون أن يضيع شيء في الطريق.',
  },
  nav: { about: 'من نحن', journey: 'الرحلة', portfolio: 'المنتج الرائد', advantages: 'مزايانا', global: 'التغطية', menu: 'القائمة', close: 'إغلاق', switchTo: 'English' },
  cta: {
    partner: 'كن شريكنا',
    visit: 'اطلب زيارة مندوب',
    choose: 'تواصلوا معنا عبر',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    partnerSubject: 'استفسار عن الشراكة',
    visitSubject: 'طلب زيارة مندوب',
    partnerMsg: 'مرحباً بلوتو، أرغب في أن أصبح شريكاً. اسم العيادة / الشركة: ',
    visitMsg: 'مرحباً بلوتو، أرغب في طلب زيارة مندوب. اسم العيادة والمدينة: ',
  },
  dots: { top: 'بلوتو', about: 'من نحن', journey: 'الرحلة', product: 'المنتج الرائد', brands: 'علاماتنا', advantages: 'مزايانا', coverage: 'التغطية' },
  hero: {
    label: 'الأجهزة التجميلية والطبية — العراق',
    name: 'شركة بلوتو',
    company: 'شركة بلوتو',
    title: ['أفضل ما في العالم،', 'إلى الوطن.'],
    intro: 'تستورد بلوتو الأجهزة التجميلية والطبية وتوزّعها من أرقى المصنّعين في العالم إلى أبرز العيادات في العراق — دون أن يضيع شيء في الطريق.',
    scroll: 'مرّر للاستكشاف',
  },
  journey: {
    label: 'الرحلة',
    title: 'من المصدر إلى أيديكم.',
    aria: 'شحنة من بلوتو تنتقل من المختبر، عبر مكاتبنا، إلى أيدي فريق العيادة.',
    beats: [
      { n: '01', title: 'من المصدر مباشرة.', body: 'نتعامل مع المصنّعين مباشرة. بلا وسطاء، بلا سوق موازية، بلا تنازلات.' },
      { n: '02', title: 'موثّقة بين أيدينا.', body: 'تُفحص كل شحنة وتُوثّق وتُخزَّن وفق المواصفات قبل أن تحمل اسمنا.' },
      { n: '03', title: 'مُسلَّمة إلى أيديكم.', body: 'نسلّمها شخصياً إلى الممارسين الذين يعتمدون عليها — في موعدها، سليمة، وبمسؤولية كاملة.' },
    ],
    final: 'تُفتح بثقة.',
  },
  manifesto: {
    label: 'عن بلوتو',
    text: 'بلوتو هي الدار المتخصصة في العراق بالأجهزة التجميلية والطبية. وُجدنا من أجل الممارس الذي يرفض التخمين — في مصدر المنتج، أو طريقة وصوله، أو من يقف خلفه.',
    stats: [
      { value: '2020', label: 'سنة التأسيس' },
      { value: '500+', label: 'عيادة وطبيب نخدمهم' },
      { value: '4', label: 'علامات حصرية' },
    ],
  },
  pillars: {
    label: 'ما نرتكز عليه',
    items: [
      { title: 'توزيع حصري', body: 'الموزّع المعتمد الوحيد في العراق لكل علامة نحملها. كل وحدة أصلية ويمكن تتبّعها حتى رقم التشغيلة.' },
      { title: 'شراكة سريرية', body: 'نعمل إلى جانب الأطباء لا من أجلهم فحسب — بالتعريف بالمنتج والتدريب العملي والمشورة الصادقة.' },
      { title: 'لوجستيات بلا تنازل', body: 'تخزين ونقل وفق مواصفات المصنّع، يتولّاه فريقنا من المنفذ الجمركي حتى باب العيادة.' },
      { title: 'تشكيلة منتقاة', body: 'لا نحمل كل شيء. نحمل ما نقبل أن نقف خلفه في ممارستنا نحن.' },
    ],
  },
  product: {
    label: 'المنتج الرائد',
    headline: 'العلم، في أرقى صوره.',
    body: 'يجمع CLAPIO Konfid CHHA بين هيدروكسي أباتيت الكالسيوم وحمض الهيالورونيك في حقنة واحدة معقّمة — متوفر في العراق حصرياً عبر بلوتو.',
    aria: 'تُرفع علبة CLAPIO لتكشف عن حقنة زجاجية، ويخرج الجل بشكل لولبي شفاف.',
    specsTitle: 'CLAPIO Konfid CHHA',
    specs: [
      ['الفئة', 'فيلر جلدي'],
      ['التركيب', 'CaHA 557 mg + HA / ml'],
      ['التخدير', 'مع ليدوكايين'],
      ['العبوة', 'حقنة واحدة × 1.5 مل'],
      ['المرفقات', 'إبرتان'],
      ['التعقيم', 'معقّم · للاستخدام مرة واحدة'],
      ['التخزين', '1 – 30 °م'],
      ['المصنّع', 'GCS Co., Ltd.'],
      ['التوفّر', 'للممارسين المرخّصين فقط'],
    ],
    second: { title: 'كل تفصيل قابل للتتبّع.', body: 'من رقم التشغيلة إلى توقيع الاستلام، السجل الكامل لكل منتج متاح لكم عند الطلب.' },
  },
  brands: { label: 'علاماتنا', title: 'أربع علامات. شريك حصري واحد في العراق.' },
  advantages: {
    label: 'طريقة أفضل للتوريد',
    items: [
      { title: 'التدريب والتعليم', body: 'ورش عمل وجلسات فردية يقدّمها مدرّبون دوليون وفريقنا السريري، لتصل التقنية الجديدة ومعها مهارة استخدامها.' },
      { title: 'لوجستيات مضبوطة', body: 'تخزين ونقل بدرجة حرارة مضبوطة يحافظان على مواصفات المصنّع حتى في صيف العراق — مع التوثيق.' },
      { title: 'أصالة مضمونة', body: 'من المصنّع حصراً. قابلة للتحقّق، مختومة، ومدعومة بالوثائق لكل وحدة.' },
      { title: 'مندوبون مخصّصون', body: 'مندوب باسمه لعيادتكم، يزوركم شخصياً، ويعرف ممارستكم، ويجيب حين تتصلون.' },
      {
        title: 'التسجيل والتمثيل الرسمي',
        body: 'نسجّل المصنّعين لدى وزارة الصحة العراقية ووزارة الصحة في إقليم كردستان، ونمثّلهم رسمياً في العراق — ليصل المنتج مرخّصاً بالكامل ويبقى كذلك.',
      },
    ],
  },
  coverage: {
    label: 'التغطية',
    stats: [
      { label: 'النطاق', value: 'جميع المحافظات' },
      { label: 'المقر الرئيسي', value: 'أربيل، العراق' },
      { label: 'التوقيت المحلي', value: 'TIME' },
    ],
    title: ['شريك واحد.', 'كل المحافظات.'],
    closing: 'أخبرونا أين تمارسون عملكم، وسيزوركم مندوب بلوتو.',
    cities: ['بغداد', 'أربيل', 'دهوك', 'السليمانية', 'البصرة', 'الموصل', 'كركوك', 'النجف', 'كربلاء', 'الحلة', 'الرمادي', 'تكريت', 'بعقوبة', 'الكوت', 'العمارة', 'الناصرية', 'السماوة', 'الديوانية', 'حلبجة'],
  },
  footer: {
    offices: [
      { city: 'أربيل — المقر الرئيسي', address: 'فيلا R5-44، أتكونز (آزادي الجديدة)' },
      { city: 'دهوك', address: 'O3، برج لوكس، شارع مالطا' },
      { city: 'بغداد', address: 'اليرموك، قضاء المنصور' },
    ],
    inquiries: 'للاستفسارات',
    rights: '©2026 بلوتو. جميع الحقوق محفوظة',
    disclaimer: 'المنتجات مخصّصة للاستخدام من قبل المتخصصين المرخّصين في الرعاية الصحية.',
  },
};

export const copy: Record<Locale, typeof en> = { en, ar };
export type Copy = typeof en;
