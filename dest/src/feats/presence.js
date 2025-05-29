import { RichPresence } from "discord.js-selfbot-v13";
export const loadPresence = async (client) => {
    const rpc = new RichPresence(client)
        .setApplicationId("1249814041120215171")
        .setType("Watching")
        .setName("Rùa Bé Con")
        .setDetails("Dịch vụ cày OwO!!")
        .setStartTimestamp(client.readyTimestamp ?? Date.now())
        .setAssetsLargeImage("https://media.discordapp.net/attachments/1313133940156137587/1376942657846116445/image.png?ex=68372947&is=6835d7c7&hm=bb8098586064ebec0f83f897500c1fe6ce78f78cf1f733fc7c642af69b781f7e&=&format=webp&quality=lossless&width=618&height=363")
        .setAssetsLargeText("Rs Store")
        .setAssetsSmallImage("https://media.discordapp.net/attachments/1371178741933412503/1371178850528137356/IMG_5775.png?ex=6836a091&is=68354f11&hm=e31eaf902607caa0cc6ebfc04b68789997b067dad68a8661578b8c7a4445fae9&=&format=webp&quality=lossless&width=400&height=400")
        .setAssetsSmallText("Velion")
        .addButton("RsStore", "https://discord.gg/rsstore")
        .addButton("Velion", "https://discord.gg/velion");
    client.user?.setPresence({ activities: [rpc] });
};
