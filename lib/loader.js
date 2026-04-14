import fs from "fs"

export function loadPlugins(plugins) {
  const files = fs.readdirSync("./plugins")

  for (const file of files) {
    if (!file.endsWith(".js")) continue

    import(`../plugins/${file}`).then(mod => {
      plugins.set(mod.name, mod)
      console.log("Loaded:", mod.name)
    })
  }
}
