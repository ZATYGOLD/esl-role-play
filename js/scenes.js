/*
 * Scene data. Each scene has 4 roles, the blanks a group fills in, and the lines in order.
 *
 * Placeholders in a line:
 *   {A}        the group's choice for blank A
 *   {A.where}  a detail of the chosen idea (here: where it is in the store)
 *   {TOTAL}    sum of the chosen ideas' prices (scenes with a budget)
 *   {LEFT}     budget minus TOTAL
 *
 * Ideas: { en, zh, price?, where?, whereZh? }. A blank marked `fixed` must be picked from its ideas
 * (used for priced items so totals stay accurate). Otherwise groups may type their own; a typed choice
 * shows in English in the 中文 hint too.
 *
 * Store prices: 7-ELEVEN Taiwan list prices found online, Nov 2026. Stores and promotions vary.
 */
const SCENES = {
  store: {
    title: "At 7-Eleven",
    zh: "在 7-ELEVEN",
    icon: "store",
    budget: 100,
    budgetLabel: { en: "Gift card", zh: "禮物卡" },
    roles: [
      { id: "clerk", name: "Clerk", zh: "櫃檯店員" },
      { id: "staff", name: "Staff", zh: "補貨店員" },
      { id: "c1", name: "Customer 1", zh: "顧客 1" },
      { id: "c2", name: "Customer 2", zh: "顧客 2" },
    ],
    blanks: [
      {
        key: "A", label: "Customer 1 wants", zh: "顧客 1 想要", fixed: true,
        ideas: [
          { en: "a bottle of tea", zh: "一瓶茶", price: 24 },
          { en: "an ice cream cup", zh: "一杯冰淇淋", price: 25 },
          { en: "a latte", zh: "一杯拿鐵", price: 45 },
        ],
      },
      {
        key: "B", label: "Customer 2 looks for", zh: "顧客 2 要找", fixed: true,
        ideas: [
          { en: "tea eggs", zh: "茶葉蛋", price: 10, where: "next to the counter", whereZh: "櫃檯旁邊" },
          { en: "rice balls", zh: "飯糰", price: 30, where: "in the fridge over there", whereZh: "那邊的冰箱裡" },
          { en: "chips", zh: "洋芋片", price: 35, where: "on the shelf by the door", whereZh: "門口旁邊的架子上" },
          { en: "hot dogs", zh: "大亨堡", price: 45, where: "at the counter", whereZh: "櫃檯那裡" },
        ],
      },
    ],
    lines: [
      { by: ["clerk"], act: ["Customers walk in.", "顧客走進來。"], en: "Hi! Welcome!", zh: "你好！歡迎光臨！" },
      { by: ["c2"], act: ["Hold up the gift card.", "拿出禮物卡。"], en: "We have one hundred dollars. What do you want?", zh: "我們有一百元。你想要什麼？" },
      { by: ["c1"], en: "I want {A}. What about you?", zh: "我想要{A}。你呢？" },
      { by: ["c2"], en: "Hmm… I want a snack.", zh: "嗯……我想要一個點心。" },
      { by: ["staff"], en: "Hi! Can I help you?", zh: "你好！需要幫忙嗎？" },
      { by: ["c2"], en: "Yes, please. Where are the {B}?", zh: "好，麻煩你。{B}在哪裡？" },
      { by: ["staff"], act: ["Point.", "用手指。"], en: "They're {B.where}.", zh: "在{B.where}。" },
      { by: ["c2"], en: "Thanks! I'll take one.", zh: "謝謝！我要一個。" },
      { by: ["staff"], en: "Here you go. Enjoy!", zh: "給你。請慢用！" },
      { by: ["clerk"], en: "Next, please! Is that everything?", zh: "下一位！這樣就好了嗎？" },
      { by: ["c1"], en: "Yes. How much is it?", zh: "對。多少錢？" },
      { by: ["clerk"], en: "That's {TOTAL} dollars. Do you need a bag? It's one dollar.", zh: "一共{TOTAL}元。需要袋子嗎？一個一元。" },
      { by: ["c1"], en: "No, thanks. Can we use this gift card?", zh: "不用，謝謝。可以用這張禮物卡嗎？" },
      { by: ["clerk"], act: ["Scan the card.", "刷卡。"], en: "Sure. You have {LEFT} dollars left. Have a nice day!", zh: "當然可以。卡裡還剩{LEFT}元。祝你有美好的一天！" },
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
        key: "D", label: "Student ticket price", zh: "學生票價", number: true,
        ideas: [{ en: "300", zh: "300" }, { en: "320", zh: "320" }, { en: "340", zh: "340" }],
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
      { by: ["c1"], en: "Two student tickets for {A}, please.", zh: "請給我兩張《{A}》的學生票。" },
      { by: ["ticket"], en: "Sure. Is the {C} show OK?", zh: "好的。{C}那場可以嗎？" },
      { by: ["c2"], en: "Yes! How much is it?", zh: "可以！多少錢？" },
      { by: ["ticket"], en: "It's {D} dollars each. Can I see your student cards?", zh: "一張{D}元。可以看一下你們的學生證嗎？" },
      { by: ["c1"], act: ["Show your student cards.", "拿出學生證。"], en: "Here you go.", zh: "在這裡。" },
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
