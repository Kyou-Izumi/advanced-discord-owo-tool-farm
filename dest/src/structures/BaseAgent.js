import { Client, Collection, } from "discord.js-selfbot-v13";
import { loadQuestCommand, mapInt, ranInt, shuffleArray, timeHandler } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { quotes } from "../typings/quotes.js";
import { loadPresence } from "../feats/presence.js";
import { owoHandler } from "../handler/owoHandler.js";
import { loadCommands } from "../feats/command.js";
import { commandHandler } from "../handler/commandHandler.js";
import { dmsHandler } from "../handler/dmsHandler.js";
import { loadSweeper } from "../feats/sweeper.js";
import { getQuestReward, processQuestLogs } from "../feats/quest.js";
export class BaseAgent extends Client {
    config;
    cache;
    activeChannel;
    totalCommands = 0;
    totalTexts = 0;
    owoID = "408785106942164992";
    prefix = "owo";
    //equality
    owoCommands = shuffleArray([
        ...Array(5).fill("hunt"),
        ...Array(5).fill("battle"),
    ]);
    questCommands = [];
    commands = new Collection();
    captchaDetected = false;
    paused = false;
    coutChannel = ranInt(17, 51);
    coutSleep = ranInt(38, 92);
    lastTime = 0;
    sleepTime = mapInt(this.coutSleep, 38, 92, 150_000, 1_000_000);
    reloadTime = new Date().setUTCHours(24, ranInt(0, 30), ranInt(0, 59));
    toutOther = 0;
    toutPray = 0;
    inventory = [];
    gem1;
    gem2;
    gem3;
    RETAINED_USERS_IDS = [this.owoID];
    constructor({ options } = {}) {
        super(options);
    }
    registerEvents = () => {
        this.on("ready", async () => {
            logger.info("Logged in as " + this.user?.displayName);
            logger.info(`Next config reload: ${timeHandler(Date.now(), this.reloadTime)}`);
            if (this.config.adminID)
                this.RETAINED_USERS_IDS.push(this.config.adminID);
            loadSweeper(this);
            if (this.config.showRPC)
                loadPresence(this);
            if (this.config.prefix)
                this.commands = await loadCommands();
            this.activeChannel = this.channels.cache.get(this.config.channelID[0]);
            this.main();
        });
        owoHandler(this);
        commandHandler(this);
        dmsHandler(this);
    };
    checkAccount = (token) => {
        return new Promise((resolve, reject) => {
            logger.info("Checking account...");
            this.once("ready", () => {
                resolve(this);
            });
            try {
                token ? this.login(token) : this.QRLogin();
            }
            catch (error) {
                reject(error);
            }
        });
    };
    send = async (message, { withPrefix = true, channel = this.activeChannel, delay = ranInt(120, 3700), } = {}) => {
        if (this.captchaDetected || this.paused)
            return;
        if (delay)
            await this.sleep(Math.abs(delay));
        if (withPrefix)
            message = [this.prefix, message].join(" ");
        await channel.send(message).catch(e => logger.error(e));
        if (withPrefix)
            logger.sent(message);
        withPrefix ? this.totalCommands++ : this.totalTexts++;
        if (this.config.autoQuest || this.cache.autoQuest) {
            this.activeChannel.createMessageCollector({
                filter: m => m.author.id == this.owoID && m.content.includes(m.client.user?.username) && m.content.includes("You finished a quest"),
                max: 1, time: 15_000
            }).once("collect", async (m) => {
                logger.debug("Quest completed! Reloading...");
                logger.info("Quest completed! Reward:" + getQuestReward(m.content.split("earned: ")[1]));
                logger.info("Deloading " + this.questCommands.length + " temporary features");
                this.questCommands = [];
                this.config.autoQuest = this.cache.autoQuest;
                this.config.autoQuote = this.cache.autoQuote;
            });
        }
    };
    aReload = async (force = false) => {
        this.reloadTime = new Date().setUTCHours(0, ranInt(0, 30), ranInt(0, 59), ranInt(0, 1000));
        logger.info(`Reloading config... Next reload ${timeHandler(Date.now(), this.reloadTime)}`);
        [this.gem1, this.gem2, this.gem3] = Array(3).fill(undefined);
        this.config = this.cache;
        return true;
    };
    aDaily = async () => {
        await this.send("daily");
        return this.config.autoDaily = false;
    };
    aPray = async () => {
        this.toutPray = new Date().setMinutes(new Date().getMinutes() + 5, ranInt(0, 59));
        await this.send(this.config.autoPray[ranInt(0, this.config.autoPray.length)]);
    };
    cChannel = async () => {
        this.activeChannel = this.channels.cache.get(this.config.channelID[ranInt(0, this.config.channelID.length)]);
        this.coutChannel += ranInt(17, 51);
    };
    aSleep = async () => {
        logger.info("Pausing for " + timeHandler(0, this.sleepTime, true));
        await this.sleep(Math.abs(this.sleepTime));
        const nextShift = ranInt(38, 92);
        this.coutSleep += nextShift;
        this.sleepTime = mapInt(nextShift, 38, 92, 150_000, 1_000_000);
    };
    aOther = async () => {
        const command = this.config.autoOther[ranInt(0, this.config.autoOther.length)];
        await this.send(command);
        this.toutOther = new Date().setMinutes(new Date().getMinutes() + 1, ranInt(0, 59));
        const filter = (m) => m.author.id == this.owoID &&
            (m.content.startsWith("🚫 **|** ") ||
                m.content.startsWith(":no_entry_sign: **|** "));
        this.activeChannel
            .createMessageCollector({ filter, max: 1, time: 15_000 })
            .once("collect", () => {
            if (this.config.autoOther.indexOf(command) > -1)
                this.config.autoOther.splice(this.config.autoOther.indexOf(command), 1);
        });
    };
    aQuote = async () => {
        switch (this.config.autoQuote[ranInt(0, this.config.autoQuote.length)]) {
            case "owo":
                await this.send("owo", { withPrefix: false });
                break;
            case "quote":
                await this.send(quotes[ranInt(0, quotes.length)], {
                    withPrefix: false,
                });
                break;
        }
    };
    aCookie = async () => {
        if (!this.config.adminID || this.config.adminID.length === 0) {
            logger.warn("Auto Cookie is enabled without AdminID! Skipping...");
            return this.config.autoCookie = false;
        }
        await this.send("cookie " + this.config.adminID);
        return this.config.autoCookie = false;
    };
    aClover = async () => {
        if (!this.config.adminID || this.config.adminID.length === 0) {
            logger.warn("Auto Clover is enabled without AdminID! Skipping...");
            return this.config.autoClover = false;
        }
        await this.send("clover " + this.config.adminID);
        return this.config.autoClover = false;
    };
    ////////////////////////// QUEST COMMANDS SESSION //////////////////////////
    aGamble = () => {
        switch (ranInt(0, 2)) {
            case 0:
                return this.send("slots");
            case 1:
                return this.send("coinflip" + ["head", "tail"][ranInt(0, 2)]);
        }
    };
    aAction = () => {
        const actionCommands = [
            "cuddle", "hug", "kiss", "lick", "nom",
            "pat", "poke", "slap", "stare", "highfive", "bite",
            "greet", "punch", "handholding", "tickle", "kill",
            "hold", "pats", "wave", "boop", "snuggle", "bully"
        ];
        return this.send(`${actionCommands[ranInt(0, actionCommands.length)]} <@${this.owoID}>`);
    };
    ////////////////////// END OF QUEST COMMANDS SESSION ///////////////////////
    // TODO: Implement aQuest
    aQuest = async () => {
        await this.send("quest");
        const filter = (m) => m.author.id == this.owoID &&
            m.embeds.length > 0 &&
            (m.embeds[0].author?.name.includes(m.guild?.members.me?.displayName) &&
                Boolean(m.embeds[0].author?.name.includes("Quest Log")) ||
                Boolean(m.embeds[0].description?.includes(m.client.user?.id)));
        this.activeChannel.createMessageCollector({
            filter,
            max: 1,
            time: 15_000
        }).once("collect", async (m) => {
            const description = m.embeds[0].description;
            if (!description)
                return logger.error("Cannot retrieve Quest Log");
            this.config.autoQuest = false;
            if (description.includes("You finished all of your quests!")) {
                logger.info("Empty Quest Log! " + (m.embeds[0].footer?.text ?? "Skipping..."));
                return;
            }
            const quests = processQuestLogs(description);
            const supportedQuests = quests.filter(q => q != "unsupported");
            if (supportedQuests.length === 0) {
                logger.info("No supported quests found! Skipping...");
                return;
            }
            ;
            logger.info(`${quests.length} quests found: ${supportedQuests.length} supported`);
            if (supportedQuests.includes("gamble")) {
                logger.debug("Temporarily enabling gamble for quest completion");
                this.questCommands.push(loadQuestCommand(this.aGamble));
            }
            if (supportedQuests.includes("action")) {
                logger.debug("Temporarily enabling action for quest completion");
                this.questCommands.push(loadQuestCommand(this.aAction));
            }
            if (supportedQuests.includes("owo") && !this.config.autoQuote.includes("owo")) {
                logger.debug("Temporarily enabling owo for quest completion");
                this.config.autoQuote.push("owo");
            }
            logger.info(this.questCommands.length + " features temporarily enabled for quest completion");
        });
    };
    // TODO: Implement aChecklist
    aChecklist = async () => {
        await this.send("checklist");
        const filter = (m) => m.author.id == this.owoID &&
            m.embeds.length > 0 &&
            (m.embeds[0].author?.name.includes(m.guild?.members.me?.displayName) ?? false) &&
            (m.embeds[0].author?.name.includes("Checklist") ?? false);
        this.activeChannel.createMessageCollector({
            filter,
            max: 1,
            time: 15_000
        }).once("collect", async (m) => {
        });
    };
    aGem = async (uGem1, uGem2, uGem3) => {
        await this.send("inv");
        const filter = (msg) => msg.author.id == this.owoID &&
            msg.content.includes(msg.guild?.members.me?.displayName) &&
            msg.content.includes("Inventory");
        this.activeChannel.createMessageCollector({ filter, max: 1, time: 15_000 })
            .once("collect", async (msg) => {
            this.inventory = msg.content.split("`");
            if (this.config.autoFCrate && this.inventory.includes("049"))
                await this.send("lb fabled");
            await this.sleep(Math.abs(ranInt(4800, 6200)));
            if (this.config.autoCrate && this.inventory.includes("050")) {
                await this.send("lb all");
                await this.sleep(Math.abs(ranInt(4800, 6200)));
                return this.aGem(uGem1, uGem2, uGem3);
            }
            this.gem1 = this.inventory.filter((item) => /^05[1-7]$/.test(item)).map(Number);
            this.gem2 = this.inventory.filter((item) => /^(06[5-9]|07[0-1])$/.test(item)).map(Number);
            this.gem3 = this.inventory.filter((item) => /^07[2-8]$/.test(item)).map(Number);
            const gems = [...this.gem1, ...this.gem2, ...this.gem3].length;
            logger.info(`Found ${gems} type of Hunting gems in Inventory`);
            if (gems == 0) {
                this.config.autoGem = 0;
                return;
            }
            const ugem1 = (uGem1 && this.gem1.length > 0) ? this.config.autoGem > 0
                ? Math.max(...this.gem1) : Math.min(...this.gem1) : undefined;
            const ugem2 = (uGem2 && this.gem2.length > 0) ? this.config.autoGem > 0
                ? Math.max(...this.gem2) : Math.min(...this.gem2) : undefined;
            const ugem3 = (uGem3 && this.gem3.length > 0) ? this.config.autoGem > 0
                ? Math.max(...this.gem3) : Math.min(...this.gem3) : undefined;
            if (!ugem1 && !ugem2 && !ugem3)
                return;
            await this.send(`use ${ugem1 ?? ""} ${ugem2 ?? ""} ${ugem3 ?? ""}`.replace(/\s+/g, " "));
        });
    };
    main = async () => {
        if (this.captchaDetected || this.paused || Date.now() - this.lastTime < 15_000) {
            logger.debug("Need time");
            await this.sleep(Math.abs(ranInt(2000, 5000)));
            this.main();
            return;
        }
        const command = this.owoCommands[ranInt(0, this.owoCommands.length)];
        if (!command) {
            logger.debug("No command found");
            await this.sleep(Math.abs(ranInt(1000, 1000)));
            this.main();
            return;
        }
        await this.send(command);
        this.lastTime = Date.now();
        if (command.includes("h") && this.config.autoGem) {
            const filter = (msg) => msg.author.id == this.owoID &&
                msg.content.includes(msg.guild?.members.me?.displayName) &&
                /hunt is empowered by| spent 5 .+ and caught a/.test(msg.content);
            this.activeChannel
                .createMessageCollector({ filter, max: 1, time: 15_000 })
                .once("collect", async (msg) => {
                let param1 = !msg.content.includes("gem1") && (!this.gem1 || this.gem1.length > 0);
                let param2 = !msg.content.includes("gem3") && (!this.gem2 || this.gem2.length > 0);
                let param3 = !msg.content.includes("gem4") && (!this.gem3 || this.gem3.length > 0);
                if (param1 || param2 || param3)
                    await this.aGem(param1, param2, param3);
            });
        }
        let commands = [
            {
                condition: this.config.autoPray.length > 0 &&
                    Date.now() - this.toutPray >= 360_000,
                action: this.aPray,
            },
            {
                condition: this.config.autoDaily,
                action: this.aDaily
            },
            {
                condition: this.config.autoOther.length > 0 &&
                    Date.now() - this.toutOther >= 60_000,
                action: this.aOther,
            },
            {
                condition: this.config.autoSleep &&
                    this.totalCommands >= this.coutSleep,
                action: this.aSleep,
            },
            {
                condition: this.config.channelID.length > 1 &&
                    this.totalCommands >= this.coutChannel,
                action: this.cChannel,
            },
            {
                condition: this.config.autoReload &&
                    Date.now() > this.reloadTime,
                action: this.aReload,
            },
            {
                condition: this.config.autoQuote.length > 0,
                action: this.aQuote,
            },
            {
                condition: this.config.autoCookie,
                action: this.aCookie,
            },
            {
                condition: this.config.autoClover,
                action: this.aClover,
            }
        ];
        commands = shuffleArray(commands.concat(this.questCommands));
        for (const command of commands) {
            if (this.captchaDetected || this.paused)
                return;
            if (command.condition)
                await command.action();
            const delay = ranInt(15000, 22000) / commands.length;
            await this.sleep(Math.abs(ranInt(delay - 3000, delay + 1200)));
        }
        await this.sleep(Math.abs(ranInt(2000, 5000)));
        this.main();
    };
    run = (config) => {
        this.config = config;
        this.cache = config;
        this.registerEvents();
        this.emit("ready", this.user?.client);
    };
}
