module.exports = {
    name: "modFormat",
    execute(enabledMods) {
        if (enabledMods === "") {
            enabledMods = "NM";
          }
          enabledMods = enabledMods.replace("None", "NM");
          enabledMods = enabledMods.replace("NoFail", "NF");
          enabledMods = enabledMods.replace("Easy", "EZ");
          enabledMods = enabledMods.replace("TouchDevice", "TD");
          enabledMods = enabledMods.replace("Hidden", "HD");
          enabledMods = enabledMods.replace("HardRock", "HR");
          enabledMods = enabledMods.replace("SuddenDeath", "SD");
          enabledMods = enabledMods.replace("Perfect", "PF");
          enabledMods = enabledMods.replace("DoubleTime", "DT");
          enabledMods = enabledMods.replace("Nightcore", "NC");
          enabledMods = enabledMods.replace("Relax", "RX");
          enabledMods = enabledMods.replace("HalfTime", "HT");
          enabledMods = enabledMods.replace("Flashlight", "FL");
          enabledMods = enabledMods.replace("Autoplay", "Auto");
          enabledMods = enabledMods.replace("SpunOut", "SO");
          enabledMods = enabledMods.replace("Relax2", "AP");
          enabledMods = enabledMods.replace("Key4", "4K");
          enabledMods = enabledMods.replace("Key5", "5K");
          enabledMods = enabledMods.replace("Key6", "6K");
          enabledMods = enabledMods.replace("Key7", "7K");
          enabledMods = enabledMods.replace("Key8", "8K");
          enabledMods = enabledMods.replace("FreeModAllowed", "");
          enabledMods = enabledMods.replace("ScoreIncreaseMods", "");

          if (enabledMods.includes('NC')) {
              enabledMods = enabledMods.replace("DT", "")
          }
          if (enabledMods.includes('PF')) {
            enabledMods = enabledMods.replace("SD", "")
        }

          return enabledMods;
    }
}