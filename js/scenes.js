/*
 * Scene data. Each scene has 4 roles, the blanks a group fills in, and the lines in order.
 *
 * Placeholders in a line:
 *   {A}        the group's choice for blank A
 *   {A.ask}    a detail of the chosen idea (its 中文 version is `askZh`)
 *   {TOTAL1}   payer 1's total: their chosen ideas' prices + extra (scenes with a budget)
 *   {LEFT1}    budget minus TOTAL1
 *
 * Ideas: { en, zh, price?, ...details }. A blank marked `fixed` must be picked from its ideas
 * (used for priced items so totals stay accurate). Otherwise groups may type their own; a typed choice
 * shows in English in the 中文 hint too.
 *
 * Store prices: 7-ELEVEN Taiwan list prices found online, Nov 2026. Stores and promotions vary.
 */
const STORE_DRINKS = [
  { en: "a bottle of water", zh: "一瓶水", price: 18 },
  { en: "a bottle of tea", zh: "一瓶茶", price: 24 },
];

const STORE_SNACKS = [
  { en: "a tea egg", zh: "一顆茶葉蛋", price: 10, ask: "where are the tea eggs?", askZh: "茶葉蛋在哪裡？", answer: "They're next to the counter.", answerZh: "在櫃檯旁邊。" },
  { en: "a banana", zh: "一根香蕉", price: 18, ask: "where are the bananas?", askZh: "香蕉在哪裡？", answer: "They're in the fruit fridge.", answerZh: "在水果冰櫃裡。" },
  { en: "an ice cream", zh: "一杯冰淇淋", price: 25, ask: "where is the ice cream?", askZh: "冰淇淋在哪裡？", answer: "It's in the freezer.", answerZh: "在冷凍櫃裡。" },
  { en: "a rice ball", zh: "一個飯糰", price: 30, ask: "where are the rice balls?", askZh: "飯糰在哪裡？", answer: "They're in the fridge over there.", answerZh: "在那邊的冰箱裡。" },
  { en: "a bag of chips", zh: "一包洋芋片", price: 35, ask: "where are the chips?", askZh: "洋芋片在哪裡？", answer: "They're on the shelf by the door.", answerZh: "在門口旁邊的架子上。" },
  { en: "a hot dog", zh: "一個大亨堡", price: 45, ask: "where are the hot dogs?", askZh: "大亨堡在哪裡？", answer: "They're at the counter.", answerZh: "在櫃檯那裡。" },
  { en: "a bag of grapes", zh: "一袋葡萄", price: 69, ask: "where are the grapes?", askZh: "葡萄在哪裡？", answer: "They're in the fruit fridge.", answerZh: "在水果冰櫃裡。" },
];

const SCENES = {
  store: {
    title: "At 7-Eleven",
    zh: "在 7-ELEVEN",
    icon: "store",
    budget: 100,
    // Each customer pays separately with their own gift card. `extra` adds the NT$1 bag.
    payers: [
      { id: "1", name: "Customer 1", zh: "顧客 1", blanks: ["A", "B"], extra: 0 },
      { id: "2", name: "Customer 2", zh: "顧客 2", blanks: ["C", "D"], extra: 1 },
    ],
    roles: [
      { id: "clerk", name: "Clerk", zh: "店員" },
      { id: "staff", name: "Staff", zh: "店員 2" },
      { id: "c1", name: "Customer 1", zh: "顧客 1" },
      { id: "c2", name: "Customer 2", zh: "顧客 2" },
    ],
    blanks: [
      { key: "A", label: "Customer 1 drink", zh: "顧客 1 飲料", fixed: true, ideas: STORE_DRINKS },
      { key: "B", label: "Customer 1 food", zh: "顧客 1 食物", fixed: true, ideas: STORE_SNACKS },
      { key: "C", label: "Customer 2 drink", zh: "顧客 2 飲料", fixed: true, ideas: STORE_DRINKS },
      { key: "D", label: "Customer 2 food", zh: "顧客 2 食物", fixed: true, ideas: STORE_SNACKS },
    ],
    lines: [
      { by: ["clerk"], act: ["Customers walk in.", "顧客走進來。"], en: "Hi! Welcome!", zh: "你好！歡迎光臨！" },
      { by: ["c1"], en: "I want {A} and {B}. What about you?", zh: "我想要{A}和{B}。你呢？" },
      { by: ["c2"], en: "I want {C} and {D}. Excuse me, {D.ask}", zh: "我想要{C}和{D}。不好意思，{D.ask}" },
      { by: ["staff"], act: ["Point.", "用手指。"], en: "{D.answer}", zh: "{D.answer}" },
      { by: ["clerk"], en: "Next, please!", zh: "下一位！" },
      { by: ["c1"], act: ["Put your items on the counter.", "把東西放在櫃檯上。"], en: "Just these, please.", zh: "就這些，謝謝。" },
      { by: ["clerk"], en: "That's {TOTAL1} dollars. Do you need a bag?", zh: "一共{TOTAL1}元。需要袋子嗎？" },
      { by: ["c1"], en: "No, thanks. Here's my gift card.", zh: "不用，謝謝。這是我的禮物卡。" },
      { by: ["clerk"], act: ["Scan the card.", "刷卡。"], en: "OK! You have {LEFT1} dollars left.", zh: "好了！卡裡還剩{LEFT1}元。" },
      { by: ["staff"], act: ["Open the second register.", "打開第二台收銀機。"], en: "I can help you over here!", zh: "這邊可以幫你結帳！" },
      { by: ["c2"], en: "Thanks! Can I get a bag, too?", zh: "謝謝！我也可以要一個袋子嗎？" },
      { by: ["staff"], en: "Sure. That's {TOTAL2} dollars with the bag.", zh: "可以。加袋子一共{TOTAL2}元。" },
      { by: ["c2"], en: "Here's my gift card.", zh: "這是我的禮物卡。" },
      { by: ["staff"], act: ["Scan the card.", "刷卡。"], en: "You have {LEFT2} dollars left. Have a nice day!", zh: "卡裡還剩{LEFT2}元。祝你有美好的一天！" },
      { by: ["c1", "c2"], act: ["Wave.", "揮手。"], en: "Thank you! Bye!", zh: "謝謝！再見！" },
    ],
  },

  movie: {
    title: "At the Movie Theater",
    zh: "在電影院",
    icon: "movie",
    roles: [
      { id: "ticket", name: "Ticket Seller", zh: "售票員" },
      { id: "snack", name: "Snack Seller", zh: "小吃部店員" },
      { id: "c1", name: "Customer 1", zh: "顧客 1" },
      { id: "c2", name: "Customer 2", zh: "顧客 2" },
    ],
    blanks: [
      { key: "A", label: "A movie", zh: "電影", ideas: [] },
      {
        key: "B", label: "How it looks", zh: "看起來",
        ideas: [{ en: "funny", zh: "好笑" }, { en: "exciting", zh: "刺激" }, { en: "scary", zh: "恐怖" }, { en: "cool", zh: "酷" }],
      },
      {
        key: "C", label: "Show time", zh: "場次",
        ideas: [{ en: "2:30", zh: "2:30" }, { en: "4:10", zh: "4:10" }, { en: "6:50", zh: "6:50" }],
      },
      {
        key: "D", label: "Ticket price", zh: "票價", number: true,
        ideas: [{ en: "320", zh: "320" }, { en: "340", zh: "340" }, { en: "360", zh: "360" }],
      },
      {
        key: "E", label: "Seat row", zh: "座位排",
        ideas: [{ en: "F", zh: "F" }, { en: "G", zh: "G" }, { en: "H", zh: "H" }],
      },
      {
        key: "F", label: "Popcorn size", zh: "爆米花大小",
        ideas: [{ en: "small", zh: "小" }, { en: "medium", zh: "中" }, { en: "large", zh: "大" }],
      },
      {
        key: "G", label: "Two drinks", zh: "兩杯飲料",
        ideas: [{ en: "colas", zh: "可樂" }, { en: "iced teas", zh: "冰紅茶" }, { en: "waters", zh: "水" }],
      },
      {
        key: "H", label: "Popcorn flavor", zh: "爆米花口味",
        ideas: [{ en: "Sweet", zh: "甜的" }, { en: "Salty", zh: "鹹的" }, { en: "Half and half", zh: "一半一半" }],
      },
      {
        key: "I", label: "Snack price", zh: "點心價錢", number: true,
        ideas: [{ en: "150", zh: "150" }, { en: "180", zh: "180" }, { en: "210", zh: "210" }],
      },
    ],
    lines: [
      { by: ["c1"], act: ["Look at the movie posters.", "看電影海報。"], en: "What do you want to watch?", zh: "你想看什麼？" },
      { by: ["c2"], en: "How about {A}? It looks {B}!", zh: "看《{A}》怎麼樣？看起來很{B}！" },
      { by: ["ticket"], en: "Hi! How can I help you?", zh: "你好！有什麼可以幫你的嗎？" },
      { by: ["c1"], en: "Two tickets for {A}, please.", zh: "請給我兩張《{A}》的票。" },
      { by: ["ticket"], en: "Sure. Is the {C} show OK?", zh: "好的。{C}那場可以嗎？" },
      { by: ["c2"], en: "Yes! How much is it?", zh: "可以！多少錢？" },
      { by: ["ticket"], en: "It's {D} dollars each.", zh: "一張{D}元。" },
      { by: ["c1"], act: ["Pay.", "付錢。"], en: "OK. Here you go.", zh: "好，給你。" },
      { by: ["ticket"], act: ["Hand over the tickets.", "把票交給顧客。"], en: "Thanks! Your seats are in row {E}.", zh: "謝謝！你們的座位在 {E} 排。" },
      { by: ["snack"], en: "Hi! What would you like?", zh: "你好！你們想要什麼？" },
      { by: ["c2"], en: "One {F} popcorn and two {G}, please.", zh: "請給我一份{F}爆米花和兩杯{G}。" },
      { by: ["snack"], en: "Sweet or salty?", zh: "要甜的還是鹹的？" },
      { by: ["c1"], en: "{H}, please!", zh: "{H}，謝謝！" },
      { by: ["snack"], en: "That's {I} dollars. Enjoy the movie!", zh: "一共{I}元。看電影愉快！" },
      { by: ["c1", "c2"], act: ["Walk to the theater.", "走進影廳。"], en: "Thank you!", zh: "謝謝！" },
    ],
  },
};
