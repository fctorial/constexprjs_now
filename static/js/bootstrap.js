if (!window._ConstexprJS_) {
  window._ConstexprJS_ = {
    compile: () => {},
    abort: () => {},
    addPaths: () => {},
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

async function render_base_page () {
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

  window.article = document.querySelector('article')
  const wrapper = make_element('<div class="body_wrapper"></div>')
  wrapper.appendChild(hdr)
  wrapper.appendChild(article)

  if (!document.querySelector('#main_title')) {
    const posts = await fetch('/collections/posts.json').then(res => res.json())
    const curr_post = posts.filter(post => post.url === window.location.pathname)[0]
    if (curr_post) {
      insertFirst(article, make_element(`<h1 id="main_title">${curr_post.title}</h1>`))
    } else {
      insertFirst(article, make_element(`<h1 id="main_title"></h1>`))
    }
  }

  const footer = make_element('<footer class=".footer"></footer>')
  const footer_linkers = {
    "email": (id) => `mailto:${id}`,
    "github": (id) => `https://github.com/${id}`,
    "twitter": (id) => `https://twitter.com/${id}`
  }
  Object.keys(footer_linkers).forEach(item => {
    if (cfg.footer_links[item]) {
      footer.appendChild(make_element(`<a target="_blank" href="${footer_linkers[item](cfg.footer_links[item])}"><i class="svg-icon ${item}"></i></a>`))
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

  if (cfg.disqus_id && window.location.pathname.startsWith('/posts')) {
    wrapper.appendChild(make_element(`<div id="disqus_thread"></div>`));
    function disqus_initialization (url, disqus_id) {
      var disqus_config = function () {
        // Replace PAGE_URL with your page's canonical URL variable
        this.page.url = url;

        // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        this.page.identifier = window.location.pathname;
      };

      (() => {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW
        var d = document, s = d.createElement('script');
        s.src = `https://${disqus_id}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', +new Date());
        d.head.appendChild(s);
      })();
    }
    const di = document.createElement('script')
    di.textContent = disqus_initialization.toString()
    document.head.appendChild(di)

    const dic = document.createElement('script')
    dic.textContent = `disqus_initialization('${cfg.url}', '${cfg.disqus_id}')`
    document.head.appendChild(dic)
  }
}

window.onfocus = () => {
  // setTimeout(() => window.location.reload(), 150)
}
