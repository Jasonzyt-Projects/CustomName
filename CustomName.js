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

    names: {}
};

if (File.exists(PLUGIN_DIR)) {
    File.mkdir(PLUGIN_DIR);
}

Config.load();
