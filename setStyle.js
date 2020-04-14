const setStyle = (el, style) => {
  for (let [key, value] of Object.entries(style)) {
    el.style[key] = value
  }
}

module.export = setStyle