export interface BookEntry {
  id?: string
  isFiller?: true
  isBerserk?: true
  title?: string
  annotation?: string
  handnote?: string | null
  color: string
  colorDark: string
  width: number
  height: number
  titleSize?: number
  bookmark?: string
  gap?: number
}

export const BOOKS: BookEntry[] = [
  // ── left end fillers ──
  { isFiller:true, width:19, height:120, color:'#6A3018', colorDark:'#401C0A' },
  { isFiller:true, width:13, height:106, color:'#1A2848', colorDark:'#0E1830' },
  { isFiller:true, width:22, height:128, color:'#3A4828', colorDark:'#222C18' },
  { isFiller:true, width:15, height:108, color:'#6A2848', colorDark:'#401830' },
  { isFiller:true, width:13, height:102, color:'#8B4A2A', colorDark:'#5A2C14' },

  // ── b1 ──
  { id:'b1',
    title:'Я уже вышла',
    annotation:'Практическое пособие по нахождению дома\nв пижаме после заявления о выходе.',
    handnote:'я уже вышла',
    color:'#7A3050', colorDark:'#4E1C38', width:46, height:150, titleSize:9.5, bookmark:'#D4A060' },

  { isFiller:true, width:21, height:124, color:'#4A4A22', colorDark:'#2C2C12' },
  { isFiller:true, width:15, height:110, color:'#5A1E28', colorDark:'#381218' },
  { isFiller:true, width:17, height:116, color:'#7A5A18', colorDark:'#4E3A0A' },

  // ── b2 ──
  { id:'b2',
    title:'Тёмная эстетика и почему она права',
    annotation:'Научный трактат. Включает главу «Серый — компромисс слабых».',
    handnote:'серый не принимается',
    color:'#2A4038', colorDark:'#162818', width:52, height:140, titleSize:9 },

  { isFiller:true, width:19, height:122, color:'#683818', colorDark:'#3E2008' },
  { isFiller:true, width:14, height:104, color:'#6A4858', colorDark:'#422838' },
  { isFiller:true, width:17, height:116, color:'#5A2A18', colorDark:'#38180A' },

  // ── b3 ──
  { id:'b3',
    title:'Реклама: выживание среди Excel',
    annotation:'Практическое руководство. Бесплатное приложение: валерьянка.',
    handnote:'выдержала',
    color:'#6E5014', colorDark:'#483408', width:38, height:156, titleSize:8.5, bookmark:'#C8922A' },

  { isFiller:true, width:21, height:126, color:'#3E3A5C', colorDark:'#201C38' },
  { isFiller:true, width:15, height:110, color:'#5E3C22', colorDark:'#3A2212' },

  // ── b4 ──
  { id:'b4',
    title:'Учёба была в плане',
    annotation:'Документальная повесть о маршруте,\nкоторый теоретически мог привести к занятиям.',
    handnote:'но не сегодня',
    color:'#222230', colorDark:'#101018', width:56, height:146, titleSize:9 },

  { isFiller:true, width:17, height:114, color:'#683018', colorDark:'#3E1C0A' },
  { isFiller:true, width:13, height:104, color:'#7A4858', colorDark:'#4E2C38' },
  { isFiller:true, width:21, height:120, color:'#2A3848', colorDark:'#16202C' },

  // ── b5 ──
  { id:'b5',
    title:'Садик. Начало великой саги',
    annotation:'Том I. Хроника. Главная загадка: где она была всё это время.',
    handnote:'начало всего',
    color:'#6A2818', colorDark:'#461808', width:48, height:145, titleSize:9, bookmark:'#C8922A' },

  { isFiller:true, width:15, height:108, color:'#5A3028', colorDark:'#38181A' },
  { isFiller:true, width:29, height:136, color:'#3A5820', colorDark:'#223410' },

  // ── b_shav ──
  { id:'b_shav',
    title:'Шаверма на двоих',
    annotation:'Финансово-гастрономическое исследование\nо том, как один объект питания становился общим счастьем.',
    handnote:'бюджет утверждён дружбой',
    color:'#8B4A14', colorDark:'#5A2C08', width:44, height:150, titleSize:9, bookmark:'#D4A060' },

  { isFiller:true, width:19, height:118, color:'#5A3820', colorDark:'#382210' },
  { isFiller:true, width:14, height:106, color:'#7A4A28', colorDark:'#4E2C16' },

  // ── b6 ──
  { id:'b6',
    title:'Культурный маршрут через пышечную',
    annotation:'Методическое пособие по совмещению\nдуховного развития и сахарной пудры.',
    handnote:'учебные заведения не пострадали',
    color:'#6A4010', colorDark:'#462808', width:40, height:154, titleSize:8.5 },

  { isFiller:true, width:23, height:124, color:'#4A2058', colorDark:'#2C1038' },
  { isFiller:true, width:17, height:110, color:'#683018', colorDark:'#3E1C0A' },
  { isFiller:true, width:13, height:104, color:'#7A4028', colorDark:'#4E2616' },

  // ── b7 berserk ──
  { id:'b7', isBerserk:true, gap:36,
    title:'Манхва, стекло и моральные травмы',
    annotation:'Пособие для тех, кто хотел романтику,\nа получил драму, боль и красивых мужчин.',
    handnote:'читать с пледом',
    color:'#0E0A1A', colorDark:'#060410', width:62, height:164, titleSize:8.5 },

  // ── right end fillers ──
  { isFiller:true, width:21, height:122, color:'#2A3848', colorDark:'#16202C' },
  { isFiller:true, width:15, height:108, color:'#5A2848', colorDark:'#38182C' },
  { isFiller:true, width:17, height:114, color:'#6A3028', colorDark:'#401818' },
  { isFiller:true, width:25, height:128, color:'#2A3840', colorDark:'#162028' },
  { isFiller:true, width:13, height:100, color:'#4A2838', colorDark:'#2C1420' },
]
