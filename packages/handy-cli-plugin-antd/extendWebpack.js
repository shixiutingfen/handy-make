const tsImportPluginFactory = require("ts-import-plugin");

const getSpecialRule = (config, regStr) => {
  for (let rule of config.module.rules) {
    if (rule.oneOf) {
      for (let handle of rule.oneOf) {
        if (handle.test && handle.test.toString() === regStr) {
          return handle;
        }
      }
    }
  }
};

module.exports = (config, presets) => {
  const hasAntd = presets.features.includes("antd");
  const hasTs = presets.features.includes("typescript");
  if (!hasAntd) return;
  const regStr = hasTs ? "/\\.(ts|tsx)$/" : "/\\.(js|jsx|mjs)$/";
  const loaderConfig = getSpecialRule(config, regStr);
  if (hasTs) {
    // awesome-typescript-loader
    loaderConfig.options = {
      getCustomTransformers: () => ({
        before: [
          tsImportPluginFactory({
            libraryName: "antd",
            libraryDirectory: "lib",
            style: true
          })
        ]
      })
    };
  } else {
    // babel-loader
    loaderConfig.options.plugins.push([
      require.resolve("babel-plugin-import"),
      {
        libraryName: "antd",
        libraryDirectory: "lib",
        style: true // or 'css'
      }
    ]);
  }
};
