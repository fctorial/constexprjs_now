if (!window._ConstexprJS_) {
  window._ConstexprJS_ = {
    compile: () => {},
    abort: () => {},
    addPath: () => {},
    addExclusions: () => {},
    log: () => {}
  }
}

const meval = eval

async function evalScript(path) {
  window._ConstexprJS_.addExclusions([path])
  meval(await (await fetch(path)).text())
}

async function stage1() {
  const tag = document.createElement('script')
}

(async () => {
  await evalScript('/static/js/lib.js')

  const cfg = await (await fetch('/collections/config.json')).json()

  const hdr = make_element(`
<header>
    <div class="info">
        <a href="/"><img alt="${cfg.name}" src="${cfg.avatar}" /></a>
        <div class="info_text">
            <a href="/"><div class="name">${cfg.name}</div></a>
            <div class="description">${cfg.description}</div>
        </div>
    </div>
</header>
`)
  const nav = make_element('<nav></nav>')
  cfg.nav_items.forEach(e => {
    nav.appendChild(make_element(`<a href="${e.url}"><div>${e.text}</div></a>`))
  })

  hdr.appendChild(nav)

  const article = document.querySelector('article')
  const wrapper = make_element('<div class="body_wrapper"></div>')
  wrapper.appendChild(hdr)
  wrapper.appendChild(article)

  const footer = make_element('<footer class=".footer"></footer>')
  const footer_items = [
    "email",
    "github",
    "twitter"
  ]
  footer_items.forEach(item => {
    if (cfg.footer_links[item]) {
      footer.appendChild(make_element(`<a href="${cfg.footer_links[item]}"><i class="svg-icon ${item}"></i></a>`))
    }
  })

  document.body.appendChild(wrapper)
  document.body.appendChild(footer)

  document.head.appendChild(make_element(`
    <link rel="stylesheet" href="/static/css/styles.css" />
  `))
  document.head.appendChild(
    make_element(
      `<meta name="viewport" content="width=device-width, min-width=800">`
    )
  )
})()

window.onfocus = () => {
  setTimeout(() => window.location.reload(), 150)
}
