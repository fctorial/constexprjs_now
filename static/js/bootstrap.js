(async () => {
  eval(await (await fetch('/static/js/lib.js')).text())

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
  insertFirst(article, hdr)

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
