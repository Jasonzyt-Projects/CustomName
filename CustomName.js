const PLUGIN_DIR = "plugins/CustomName/";
const CONFIG_FILE = PLUGIN_DIR + "config.json";

const Config = {
    _raw: {},
    load() {
        if (!File.exists(CONFIG_FILE)) {
            this.save();
        }
        this._raw = JSON.parse(File.readFrom(CONFIG_FILE));
        let keys = Object.keys(this._raw);
        keys.forEach(key => {
            if (this._raw[key] != null) {
                this[key] = this._raw[key];
            }
        });
    },
    save() {
        let keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (key.startsWith('_')) continue;
            if (typeof this[key] == 'function') continue;
            this._raw[key] = this[key];
        }
        File.writeTo(CONFIG_FILE, JSON.stringify(this._raw, null, 4));
    },

    maxNameLength: 20,
    names: {}
};

const Command = {
    setup() {
        let cmd = mc.newCommand("setname", "Set your custom name!", PermType.Any);
        cmd.setAlias("sn");
        cmd.optional("name", ParamType.RawText);
        cmd.overload(["name"]);
        cmd.setCallback(Command.execute);
        cmd.setup();
    },
    execute(_cmd, ori, out, args) {
        if (ori.player == null) {
            out.error("This command can only be executed by player!");
            return;
        }
        let customName = args["name"];
        let realName = ori.player?.realName;
        if (realName == null) {
            return;
        }
        if (customName.length > Config.maxNameLength) {
            out.error("Your name is too long!");
            return;
        }
        if (customName == null) {
            delete Config.names[ori.player.realName];
            Config.save();
            ori.player.rename(realName);
            out.success("Your name has been reset!");
            return;
        }
        Config.names[realName] = customName;
        Config.save();
        ori.player.rename(customName);
        out.success("Your name has been set to " + customName);
    }
};

if (File.exists(PLUGIN_DIR)) {
    File.mkdir(PLUGIN_DIR);
}

Config.load();
Command.setup();

mc.listen("onJoin", function (player) {
    let name = player.realName;
    if (Config.names[name] != null) {
        player.rename(Config.names[name]);
    }
});