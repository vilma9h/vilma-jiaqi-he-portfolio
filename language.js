(() => {
  const original = new Map()
  const page = location.pathname.split('/').pop() || 'index.html'

  const common = {
    '.badge-frame-connect': '期待与你合作 :)',
    '.badge-frame-role': '品牌 · 平面 · UI',
    '.badge-frame-location': '杭州 · 设计师',
    '.badge-frame-slogan': '让我们一起<br>创造一些<br><span>精彩作品。</span>'
  }

  const pages = {
    'index.html': {
      '.hero .services': '品牌设计<br>平面设计<br>UI 设计',
      '.hero h1': '欢迎进入<br>VILMA的设计旅程',
      '.intro .based': '现居杭州',
      '.intro .lead': '高效沟通，快速响应，重视协作，<br>致力于为客户创造长期价值。',
      '.about .statement': '我是一名<span>品牌设计师、平面设计师和 UI 设计师</span>，以好奇心和批判性思维融合交互设计、研究与文化想象，创造以人为本的数字体验。',
      '.about .n1': '负责从品牌定位、视觉识别到网站设计及数字资产的<br>全流程品牌设计。',
      '.about .n2': '结合 UI 设计与用户研究，创造兼具视觉吸引力与<br>用户导向的数字体验。',
      '.about .n3': '拥有美国与中国市场的实践经验，能够灵活适应远程协作与<br>快节奏沟通。',
      '#experience > h2': '我学习如何<br><span>思考</span>',
      '.edu.right h3': 'ArtCenter<br>艺术中心设计学院',
      '.edu.right p': '媒体设计实践 硕士',
      '.edu.left h3': '悉尼大学',
      '.edu.left p': '数字文化与设计 学士',
      '.edu.left small': '2019–2022 双专业',
      '#experience-details > h2': '我学习如何<br><span>创造</span>',
      '.jobs article:nth-child(1) h3': '自由设计师',
      '.jobs article:nth-child(1) h4': '杭州，06/2026 - 至今',
      '.jobs article:nth-child(1) p': '负责打造完整统一的品牌识别体系，包括品牌定位、标志设计、色彩系统与网站设计，确保品牌在所有接触点上的一致性与辨识度。',
      '.jobs article:nth-child(2) h3': '网页设计师',
      '.jobs article:nth-child(2) h4': '<span>TEAOC.ART</span>，洛杉矶，06/2025 - 05/2026',
      '.jobs article:nth-child(2) p': '通过 UI/UX 设计、视觉素材优化与内容更新维护并提升 TEAOC.ART 网站，同时设计社交媒体视觉、活动横幅、邮件版式及其他数字资产，确保品牌体验在各平台保持统一且富有吸引力。',
      '.jobs article:nth-child(3) h3': '媒体设计实习生',
      '.jobs article:nth-child(3) h4': '<span>Solgo Atelier LLC</span>，洛杉矶，04/2024 - 07/2024',
      '.jobs article:nth-child(3) p': '制作数字与动态视觉资产，参与新品发布的界面和品牌设计，并协助日常拍摄与创意视频制作，确保各平台品牌体验一致。',
      '.jobs article:nth-child(4) h3': '发展部实习生',
      '.jobs article:nth-child(4) h4': '<span>UCCA尤伦斯当代艺术中心</span>，北京，12/2021 - 03/2022',
      '.jobs article:nth-child(4) p': '设计 VIP 数字宣传材料，参与 UCCA 年报的编辑、校对、排版与印刷制作，并通过视觉呈现、现场协调和跨团队合作支持 UCCA × Louis Vuitton Cindy Sherman: On Stage 展览及 VIP 活动。',
      '#works > h2': '精选作品',
      '.kuku-card span:nth-child(1)': '品牌策略', '.kuku-card span:nth-child(2)': '品牌设计', '.kuku-card span:nth-child(3)': '网站设计',
      '.teaoc-card span:nth-child(1)': '网站设计', '.teaoc-card span:nth-child(2)': '媒体设计', '.teaoc-card span:nth-child(3)': '营销设计',
      '.porsche-card span:nth-child(1)': 'UI/UX 设计', '.porsche-card span:nth-child(2)': '汽车设计',
      '.wheel-card span:nth-child(1)': 'UI/UX 设计', '.wheel-card span:nth-child(2)': '思辨设计',
      '.card.wide span:nth-child(1)': 'AR 装置', '.card.wide span:nth-child(2)': '数字媒体', '.card.wide span:nth-child(3)': '平面设计',
      '#playground > h2': '实验场'
    },
    'kuku-make.html': {
      '.project-meta div:nth-child(1) dt': '项目类型', '.project-meta div:nth-child(1) dd': '品牌策略、品牌设计、UI/UX 设计',
      '.project-meta div:nth-child(2) dt': '角色', '.project-meta div:nth-child(2) dd': '品牌设计师、UI/UX 设计师、艺术指导',
      '.project-meta div:nth-child(3) dt': '工具',
      '.project-summary': '重新设计 KUKU MAKE 的品牌识别，<br>将其从 3D 打印家居品牌转变为一个大胆、趣味、<br>以设计为驱动，并植根于个性化与<br>可持续理念的生活方式品牌。',
      '.mission h2': '品牌使命', '.mission .section-copy': 'KUKU MAKE 通过数字设计与 3D 打印重新构想日常家居物件。<br>品牌围绕模块化、个性化与可持续性展开，<br>让每件产品适应不同空间、需求和个性，<br>使设计不再固定，而成为每个人都能自由创造的体验。',
      '.mission-grid figure:nth-child(1) figcaption': '趣味', '.mission-grid figure:nth-child(2) figcaption': 'ADAPTABLE', '.mission-grid figure:nth-child(3) figcaption': 'EXPRESSIVE',
      '.feature:nth-of-type(3) h2': '标志设计', '.feature:nth-of-type(3) .section-copy': 'KUKU MAKE 标志将品牌模块化与趣味定制的理念，<br>转化为一套几何化的字体系统。',
      '.feature:nth-of-type(4) h2': '色彩系统', '.feature:nth-of-type(4) .section-copy': 'KUKU MAKE 的色彩系统从日常物件与当代生活空间中汲取灵感，以鲜明主色平衡温暖、稳重的辅助色。',
      '.typography-page h2': '字体系统', '.typography-page .section-copy': '简洁的几何字体平衡了富有表现力的产品形态，<br>并在包装、编辑版式、产品信息与数字界面中<br>建立清晰秩序。',
      '.website h2': '网站', '.website .section-copy': '网站以鲜明的产品图像、舒展的字体和清晰的模块结构为核心，帮助用户理解品牌个性以及每件产品的灵活性。',
      '.outcomes h2': '成果'
    },
    'teaoc-art.html': {
      '.project-meta div:nth-child(1) dt': '项目类型', '.project-meta div:nth-child(1) dd': '网站设计、媒体设计、营销设计',
      '.project-meta div:nth-child(2) dt': '角色', '.project-meta div:nth-child(2) dd': '网页设计师、平面设计师', '.project-meta div:nth-child(3) dt': '工具',
      '.project-summary': '在 TEAOC.ART 工作的一年中，我参与了网站设计、内容组织、横幅、社交媒体与邮件营销，并将既有视觉识别延展至不同数字触点。',
      '.role-section h2': '我的角色', '.role-section > .section-copy': 'TEAOC.ART 已拥有成熟的标志、视觉识别与网站系统。我的职责不是重新塑造品牌，而是在既有框架中维护、延展并组织数字体验。<br><br>这一年中，我的工作集中在五个方面：',
      '.role-grid article:nth-child(1) h3': '网站设计', '.role-grid article:nth-child(1) p': '依据新内容需求设计与调整网站页面，包括合作画廊的页面布局。',
      '.role-grid article:nth-child(2) h3': '内容组织', '.role-grid article:nth-child(2) p': '组织艺术家、作品及相关信息，使不断扩展的网站保持清晰有序。',
      '.role-grid article:nth-child(3) h3': '展览推广', '.role-grid article:nth-child(3) p': '为展览与艺术作品设计网站横幅和数字宣传视觉。',
      '.role-grid article:nth-child(4) h3': '社交媒体', '.role-grid article:nth-child(4) p': '设计 Instagram 内容，在适应快速浏览节奏的同时保持品牌一致性。',
      '.role-grid article:nth-child(5) h3': '邮件设计', '.role-grid article:nth-child(5) p': '为展览、艺术家与活动设计邮件营销，在视觉表达与信息之间建立清晰层级。',
      '.website-section h2': '网站', '.website-section .section-copy': '除日常网站更新外，我还组织艺术家与作品内容，并在 TEAOC.ART 既有网站系统中优化页面布局，建立清晰的内容关系与一致的视觉层级。',
      '.gallery-section h2': '合作画廊', '.gallery-section .section-copy': '随着 TEAOC.ART 与不同画廊展开合作，我参与设计合作画廊页面。页面既需要延续 TEAOC.ART 的整体网站系统，也要为每家画廊提供呈现自身身份、艺术家与精选作品的独立空间。',
      '.social-section h2': '社交媒体', '.social-section > .section-copy': 'Instagram 是 TEAOC.ART 与受众保持持续联系的重要数字触点。',
      '.social-top p': '与网站相比，社交媒体需要更快速地传达艺术家、作品和展览信息。我在既有视觉识别中运用图像比例、字体层级与留白，使内容在快速滚动的环境中依然清晰可辨。',
      '.email-section h2': '邮件设计', '.email-section .section-copy': '邮件比社交媒体承载更多信息，包括展览详情、艺术家介绍、活动日期与明确行动指引。我以编辑设计方式组织长内容，通过标题、正文、图像与 CTA 的清晰层级，延续 TEAOC.ART 以艺术作品为核心的视觉语言。',
      '.outcomes-section h2': '成果', '.outcomes-section .section-copy': '在 TEAOC.ART 任职期间，我参与设计网站、展览推广、社交媒体与邮件等多种数字触点，在保持整体视觉一致性的同时扩展品牌内容与页面。<br><br>这段经历提升了我在成熟品牌系统中工作、管理多类型视觉内容并进行跨平台专业设计的能力。'
    },
    'porsche-taycan.html': {
      '.project-title > p': '2024 ｜ 洛杉矶 ｜ 学校项目',
      '.project-meta div:nth-child(1) dt': '项目类型', '.project-meta div:nth-child(1) dd': 'UI/UX 设计、品牌设计、汽车设计、思辨设计',
      '.project-meta div:nth-child(2) dt': '角色', '.project-meta div:nth-child(2) dd': 'UI/UX 设计师', '.project-meta div:nth-child(3) dt': '工具',
      '.project-summary': '通过竞速、工作与浪漫三种模式重新构想 Porsche 电动运动轿车，将性能体验与未来车主不断变化的生活方式连接起来。',
      '.vision > h2:first-child': '设计愿景', '.vision > .section-copy': 'Porsche Taycan 2035 将电动运动轿车重新定义为多维度座驾：在保留 Porsche 竞速基因的同时，适应未来车主不断变化的生活方式。竞速、工作与浪漫三种模式探索速度、成就与情感连接，将 Porsche 的传承延伸至更可持续、更以人为本的未来。',
      '.vision blockquote': '“超越驾驶，<br>驶入生活的每个维度。”', '.modes-heading': '三种模式', '.modes > p': '界面适应车主生活中的不同场景，在性能、效率与情感连接之间灵活切换。', '.modes .center': '模式切换',
      '.features h2': '核心功能', '.feature-grid > p:nth-of-type(1)': '用户可以在车辆主屏幕上使用应用，而不干扰其他核心功能。系统会根据所选驾驶模式提供适合不同驾驶情境的辅助功能。', '.feature-grid > p:nth-of-type(2)': '竞速模式保留燃油跑车的传统驾驶体验，用户可自定义声音、振动、气流与 G 力设置，并升起挡杆以增强沉浸感。',
      '.owner-section h2': '未来车主', '.owner-section > .section-copy': 'Garrett 代表新一代 Porsche 车主，他们的身份在职业抱负、驾驶热情与个人关系之间流动。', '.owner-content p': '我们识别出现有电动车的体验缺口，并通过问题、挑战与机会的框架指导 Taycan 2035 多维体验设计。',
      '.visual-section > h2:first-child': '视觉方向', '.visual-cards figure:nth-child(1) figcaption': '竞速模式', '.visual-cards figure:nth-child(2) figcaption': '工作模式', '.visual-cards figure:nth-child(3) figcaption': '浪漫模式', '.language-heading': '数字视觉语言'
    },
    'wheel-cart.html': {
      '.project-title > p': '2023 ｜ 悉尼 ｜ 学校项目',
      '.project-meta div:nth-child(1) dt': '项目类型', '.project-meta div:nth-child(1) dd': 'UI/UX 设计、思辨设计', '.project-meta div:nth-child(2) dt': '角色', '.project-meta div:nth-child(2) dd': 'UI/UX 设计师', '.project-meta div:nth-child(3) dt': '工具',
      '.project-summary': 'Wheel Cart 是一个探索移动自动驾驶杂货店的推想型 UX/UI 项目。体验横跨桌面端、智能手机与智能手表，支持用户完成浏览、下单和实时配送追踪。',
      '.vision > h2:first-child': '愿景', '.vision-copy': 'Wheel Cart 通过移动自动驾驶商店探索未来杂货购物。项目结合推想研究与新兴技术，构建横跨桌面端、智能手机与智能手表的连贯体验，将杂货购物重新想象为更便捷灵活的按需服务。',
      '.vision blockquote': '“让新鲜食材驶入你的未来。”', '.context-heading': '背景与挑战', '.context-copy': '随着自动驾驶与按需服务持续发展，杂货购物有机会突破固定零售空间。但移动自动驾驶商店也带来信任、产品质量、服务透明度与跨设备交互等新挑战。',
      '.challenge p:nth-child(1)': '<strong>我们如何</strong>设计顺畅的多设备体验，让用户能够在桌面端、智能手机与智能手表之间轻松探索、下单并接收商品？', '.challenge p:nth-child(2)': '<strong>我们如何</strong>通过清晰传达商品新鲜度、配送状态与车辆功能，建立用户对自动驾驶杂货购物的信任？',
      '.users-section > h2:first-child': '用户', '.persona-labels span:nth-child(1)': '时间紧张的年轻用户', '.persona-labels span:nth-child(2)': '注重便利与行动需求的年长用户', '.flow-heading': '体验流程', '.flow-copy': '体验连接商品浏览、车辆请求、配送追踪与交付，并贯穿多个设备。',
      '.system-section > h2:first-child': '设计系统', '.system-section > .section-copy': '设计系统在桌面端、智能手机与智能手表之间建立统一的视觉语言。共享的色彩、字体、组件与界面模式在保持清晰和熟悉感的同时，也允许各设备适应自身的交互情境。', '.digital-heading': '数字体验',
      '.phone h3': '智能手机 ｜ 主要触点', '.phone p': '智能手机是呼叫自动驾驶商店、浏览商品、查看食品新鲜度与实时追踪配送的主要触点。', '.desktop h3': '桌面端', '.desktop p': '桌面端通过清晰导航和一致的界面模式支持商品浏览、车辆选择与账户管理，帮助用户以最少步骤完成关键任务。', '.watch h3': '智能手表', '.watch p': '智能手表在最后一公里配送与订单交付过程中提供一目了然的状态更新和简化控制，让用户无需打开手机即可查看进度并完成关键操作。',
      '.outcome h2': '成果', '.outcome .section-copy': '该项目提升了我将推想研究转化为实际设计决策的能力。通过多设备协作设计，我也进一步掌握了如何在适应不同使用情境与用户需求的同时，创造连贯统一的用户体验。'
    }
  }

  function rememberAndSet(selector, html, chinese) {
    document.querySelectorAll(selector).forEach((element) => {
      if (!original.has(element)) original.set(element, element.innerHTML)
      element.innerHTML = chinese ? html : original.get(element)
    })
  }

  function applyLanguage(language) {
    const chinese = language === 'zh'
    document.documentElement.lang = chinese ? 'zh-CN' : 'en'
    Object.entries(common).forEach(([selector, html]) => rememberAndSet(selector, html, chinese))
    Object.entries(pages[page] || {}).forEach(([selector, html]) => rememberAndSet(selector, html, chinese))

    if (chinese && page !== 'index.html') {
      document.querySelectorAll('main h1, main h2, main h3, main p, main dd, main blockquote, main figcaption').forEach((element) => {
        element.querySelectorAll('br').forEach((lineBreak) => lineBreak.replaceWith(' '))
      })
    }

    document.querySelectorAll('.nav nav a, .project-nav nav a').forEach((link) => {
      if (!original.has(link)) original.set(link, link.innerHTML)
      if (!chinese) link.innerHTML = original.get(link)
      else {
        const href = link.getAttribute('href') || ''
        link.textContent = href.includes('#about') ? '关于' : href.includes('#experience') ? '经历' : href.includes('#works') ? '作品' : href.includes('#playground') ? '实验场' : link.textContent
      }
    })
    document.querySelectorAll('#contact-toggle').forEach((link) => {
      if (!original.has(link)) original.set(link, link.innerHTML)
      link.textContent = chinese ? '联系' : original.get(link)
    })
    document.querySelectorAll('[aria-label="Switch language"]').forEach((button) => { button.textContent = chinese ? '中' : 'En' })
  }

  let savedLanguage = 'en'
  try { savedLanguage = localStorage.getItem('vilma-language') === 'zh' ? 'zh' : 'en' } catch (_) {}
  let language = savedLanguage
  applyLanguage(language)
  document.querySelectorAll('[aria-label="Switch language"]').forEach((button) => {
    button.addEventListener('click', () => {
      language = language === 'zh' ? 'en' : 'zh'
      try { localStorage.setItem('vilma-language', language) } catch (_) {}
      applyLanguage(language)
    })
  })
})()
