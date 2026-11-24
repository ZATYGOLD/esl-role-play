/*
 * Scene data. Each scene has 4 roles, the blanks a group fills in, and the lines in order.
 * In a line, {A} is replaced by the group's choice for blank A. `by` lists the role ids who say it.
 * Ideas are [English, 中文] pairs; a choice typed by the group shows in English in the 中文 hint too.
 */
const SCENES = {
  store: {
    title: "At the Convenience Store",
    zh: "在便利商店",
    icon: "store",
    roles: [
      { id: "clerk", name: "Clerk", zh: "櫃檯店員" },
      { id: "staff", name: "Staff", zh: "店內店員" },
      { id: "c1", name: "Customer 1", zh: "顧客 1" },
      { id: "c2", name: "Customer 2", zh: "顧客 2" },
    ],
    blanks: [
      { key: "A", label: "Something to find", zh: "要找的東西", ideas: [["milk", "牛奶"], ["bread", "麵包"], ["tea", "茶"], ["ice cream", "冰淇淋"]] },
      { key: "B", label: "Where it is", zh: "在哪裡", ideas: [["next to the juice", "果汁旁邊"], ["near the door", "門口附近"], ["in the back", "後面"]] },
      { key: "C", label: "A snack", zh: "點心", ideas: [["a rice ball", "一個飯糰"], ["a sandwich", "一個三明治"], ["a hot dog", "一根熱狗"], ["some chocolate", "一些巧克力"]] },
      { key: "D", label: "Something you need", zh: "需要的東西", ideas: [["umbrellas", "雨傘"], ["tissues", "面紙"], ["batteries", "電池"], ["phone chargers", "手機充電器"]] },
      { key: "E", label: "Price of (D)", zh: "(D) 的價錢", number: true, ideas: [["50", "50"], ["99", "99"], ["120", "120"]] },
      { key: "F", label: "Total price", zh: "總價", number: true, ideas: [["150", "150"], ["200", "200"], ["250", "250"]] },
      { key: "G", label: "How you pay", zh: "付款方式", ideas: [["cash", "現金"], ["a card", "卡"], ["my phone", "手機"]] },
    ],
    lines: [
      { by: ["clerk"], act: ["Customers walk in.", "顧客走進來。"], en: "Hello! Welcome!", zh: "你好！歡迎光臨！" },
      { by: ["c1"], en: "Hi! Excuse me, where is the {A}?", zh: "嗨！不好意思，請問{A}在哪裡？" },
      { by: ["staff"], act: ["Point.", "用手指。"], en: "It's {B}, over there.", zh: "在{B}，在那邊。" },
      { by: ["c1"], en: "Thanks! I want {C}, too.", zh: "謝謝！我也想要{C}。" },
      { by: ["c2"], en: "Excuse me. Do you have {D}?", zh: "不好意思，請問有{D}嗎？" },
      { by: ["staff"], act: ["Walk with Customer 2.", "陪顧客 2 走過去。"], en: "Yes! They're over here.", zh: "有！在這裡。" },
      { by: ["c2"], en: "Great. How much is this one?", zh: "太好了。這個多少錢？" },
      { by: ["staff"], en: "It's {E} dollars.", zh: "{E}元。" },
      { by: ["clerk"], act: ["Scan the items.", "刷商品條碼。"], en: "Next, please! That's {F} dollars.", zh: "下一位！一共{F}元。" },
      { by: ["c1"], en: "Can I pay with {G}?", zh: "我可以用{G}付款嗎？" },
      { by: ["clerk"], en: "Sure. Do you need a bag?", zh: "當然可以。需要袋子嗎？" },
      { by: ["c2"], en: "No, thanks.", zh: "不用，謝謝。" },
      { by: ["clerk"], en: "OK. Here you go. Have a nice day!", zh: "好的，給你。祝你有美好的一天！" },
      { by: ["c1", "c2"], act: ["Wave.", "揮手。"], en: "Thanks! Bye!", zh: "謝謝！再見！" },
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
      { key: "B", label: "How it looks", zh: "看起來", ideas: [["funny", "好笑"], ["exciting", "刺激"], ["scary", "恐怖"], ["cool", "酷"]] },
      { key: "C", label: "Show time", zh: "場次", ideas: [["2:30", "2:30"], ["4:00", "4:00"], ["6:45", "6:45"]] },
      { key: "D", label: "Ticket price", zh: "票價", number: true, ideas: [["250", "250"], ["280", "280"], ["300", "300"]] },
      { key: "E", label: "Where to sit", zh: "座位", ideas: [["front", "前面"], ["middle", "中間"], ["back", "後面"]] },
      { key: "F", label: "Popcorn size", zh: "爆米花大小", ideas: [["small", "小"], ["medium", "中"], ["large", "大"]] },
      { key: "G", label: "Two drinks", zh: "兩杯飲料", ideas: [["colas", "可樂"], ["waters", "水"], ["iced teas", "冰茶"], ["juices", "果汁"]] },
      { key: "H", label: "Snack price", zh: "點心價錢", number: true, ideas: [["150", "150"], ["180", "180"], ["200", "200"]] },
    ],
    lines: [
      { by: ["c1"], act: ["Look at the movie posters.", "看電影海報。"], en: "Which movie do you want to see?", zh: "你想看哪一部電影？" },
      { by: ["c2"], en: "Let's see {A}! It looks {B}.", zh: "我們來看《{A}》吧！看起來很{B}。" },
      { by: ["ticket"], en: "Hi! How can I help you?", zh: "你好！有什麼可以幫你的嗎？" },
      { by: ["c1"], en: "Two tickets for {A}, please.", zh: "請給我兩張《{A}》的票。" },
      { by: ["ticket"], en: "What time do you want?", zh: "你想要幾點的？" },
      { by: ["c2"], en: "{C}, please. How much are the tickets?", zh: "請給我{C}的。票多少錢？" },
      { by: ["ticket"], en: "They're {D} dollars each. Where do you want to sit?", zh: "一張{D}元。你想坐哪裡？" },
      { by: ["c1"], en: "In the {E}, please.", zh: "請給我{E}的位子。" },
      { by: ["ticket"], act: ["Hand over the tickets.", "把票交給顧客。"], en: "OK. Here are your tickets.", zh: "好的，這是你們的票。" },
      { by: ["snack"], en: "Hi! Would you like some popcorn?", zh: "你好！要不要來點爆米花？" },
      { by: ["c2"], en: "Yes. One {F} popcorn, please.", zh: "好。請給我一份{F}爆米花。" },
      { by: ["snack"], en: "Anything to drink?", zh: "要喝點什麼嗎？" },
      { by: ["c1"], en: "Two {G}, please.", zh: "請給我兩杯{G}。" },
      { by: ["snack"], en: "That's {H} dollars. Enjoy the movie!", zh: "一共{H}元。看電影愉快！" },
      { by: ["c1", "c2"], act: ["Walk to the theater.", "走進影廳。"], en: "Thank you!", zh: "謝謝！" },
    ],
  },
};
