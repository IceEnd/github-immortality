document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const usernameInput = document.getElementById('username-input');
  const generateBtn = document.getElementById('generate-btn');
  const statsCard = document.getElementById('stats-card');
  const loadingOverlay = document.getElementById('loading-overlay');
  const errorMessage = document.getElementById('error-message');
  const codeOutput = document.getElementById('code-output');
  const copyBtn = document.getElementById('copy-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const langToggleBtn = document.getElementById('lang-toggle');
  const themeLightBtn = document.getElementById('theme-light-btn');
  const themeDarkBtn = document.getElementById('theme-dark-btn');
  const themeSlider = document.getElementById('theme-slider');

  // State
  let currentUsername = '';
  let currentFormat = 'markdown';
  let currentLang = 'zh';
  let currentTheme = 'light';
  let hasGenerated = false;

  // Translations
  const translations = {
    zh: {
      title: 'GitHub Immortality',
      tagline: '推演天地法则，洞察道友修为',
      placeholder: '输入 GitHub 用户名',
      generate: '生成',
      error: '未找到该用户，请检查用户名。',
      copy: '复制',
      copied: '已复制到剪贴板',
      github: 'GitHub',
      themeLight: '浅色',
      themeDark: '深色',
      emptyHint: '输入用户名，点击生成查看卡片'
    },
    en: {
      title: 'GitHub Immortality',
      tagline: 'Reveal Your Cultivation Realm',
      placeholder: 'Enter GitHub username',
      generate: 'Generate',
      error: 'User not found. Please check the username.',
      copy: 'Copy',
      copied: 'Copied to clipboard',
      github: 'GitHub',
      themeLight: 'Light',
      themeDark: 'Dark',
      emptyHint: 'Enter a username and click Generate to see the card'
    }
  };

  // Initialize
  initLanguage();
  showEmptyState();

  // Event Listeners
  generateBtn.addEventListener('click', generateCard);
  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateCard();
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFormat = btn.dataset.format;
      updateCodeOutput();
    });
  });

  langToggleBtn.addEventListener('click', () => {
    const nextLang = currentLang === 'zh' ? 'en' : 'zh';
    switchLanguage(nextLang);
  });

  // 主题切换按钮
  themeLightBtn.addEventListener('click', () => switchTheme('light'));
  themeDarkBtn.addEventListener('click', () => switchTheme('dark'));

  function switchTheme(theme) {
    currentTheme = theme;
    const isDark = theme === 'dark';
    // 更新滑块位置
    themeSlider.classList.toggle('dark-active', isDark);
    // 更新按钮激活状态
    themeLightBtn.classList.toggle('active', !isDark);
    themeDarkBtn.classList.toggle('active', isDark);
    // 重新加载卡片以应用新主题
    refreshCard();
  }

  copyBtn.addEventListener('click', copyToClipboard);

  // Functions
  function showEmptyState() {
    statsCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingOverlay.classList.add('hidden');
    // 显示引导提示
    let hint = document.getElementById('empty-hint');
    if (!hint) {
      hint = document.createElement('p');
      hint.id = 'empty-hint';
      hint.className = 'empty-hint';
      document.getElementById('card-wrapper').appendChild(hint);
    }
    hint.textContent = translations[currentLang].emptyHint;
    hint.classList.remove('hidden');
    // 隐藏复制区域
    document.getElementById('copy-section').classList.add('hidden');
  }

  function hideEmptyState() {
    const hint = document.getElementById('empty-hint');
    if (hint) hint.classList.add('hidden');
    // 显示复制区域
    document.getElementById('copy-section').classList.remove('hidden');
  }

  function generateCard() {
    const username = usernameInput.value.trim();
    if (!username) return;

    currentUsername = username;
    hasGenerated = true;
    hideEmptyState();
    showLoading();

    // Update card image with theme
    const themeParam = currentTheme === 'dark' ? '&theme=dark' : '';
    const cacheBust = `&t=${Date.now()}`;
    const cardUrl = `/api?username=${username}${themeParam}${cacheBust}`;
    statsCard.src = cardUrl;

    statsCard.onload = () => {
      hideLoading();
      statsCard.classList.remove('hidden');
      updateCodeOutput();
    };

    statsCard.onerror = () => {
      hideLoading();
      errorMessage.classList.remove('hidden');
    };
  }

  function refreshCard() {
    if (!hasGenerated || !currentUsername) return;
    showLoading();
    statsCard.classList.add('hidden');
    const themeParam = currentTheme === 'dark' ? '&theme=dark' : '';
    const cacheBust = `&t=${Date.now()}`;
    const cardUrl = `/api?username=${currentUsername}${themeParam}${cacheBust}`;
    statsCard.src = cardUrl;

    statsCard.onload = () => {
      hideLoading();
      statsCard.classList.remove('hidden');
      updateCodeOutput();
    };

    statsCard.onerror = () => {
      hideLoading();
    };
  }

  function showLoading() {
    loadingOverlay.classList.remove('hidden');
    errorMessage.classList.add('hidden');
  }

  function hideLoading() {
    loadingOverlay.classList.add('hidden');
  }

  function updateCodeOutput() {
    if (!hasGenerated || !currentUsername) {
      codeOutput.textContent = '';
      return;
    }
    const baseUrl = window.location.origin;
    const themeParam = currentTheme === 'dark' ? '&theme=dark' : '';
    const cardUrl = `${baseUrl}/api?username=${currentUsername}${themeParam}`;
    const profileUrl = `https://github.com/${currentUsername}`;

    let code = '';
    if (currentFormat === 'markdown') {
      code = `[![${currentUsername}'s GitHub stats](${cardUrl})](${profileUrl})`;
    } else if (currentFormat === 'html') {
      code = `<a href="${profileUrl}">\n  <img src="${cardUrl}" alt="${currentUsername}'s GitHub stats" />\n</a>`;
    } else {
      code = cardUrl;
    }

    codeOutput.textContent = code;
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(codeOutput.textContent);
      copyFeedback.classList.remove('hidden');
      setTimeout(() => {
        copyFeedback.classList.add('hidden');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }

  function initLanguage() {
    // Check localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      switchLanguage(savedLang);
      return;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
      switchLanguage('zh');
    } else {
      switchLanguage('en');
    }
  }

  function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // Update toggle button text (show the other language)
    langToggleBtn.textContent = lang === 'zh' ? 'English' : '中文';

    // Update text content
    const t = translations[lang];
    document.title = `${t.title} - ${t.tagline}`;
    document.getElementById('main-title').textContent = t.title;
    document.getElementById('sub-title').textContent = t.tagline;
    usernameInput.placeholder = t.placeholder;
    generateBtn.textContent = t.generate;
    document.getElementById('error-message').textContent = t.error;
    copyBtn.textContent = t.copy;
    copyFeedback.textContent = t.copied;
    document.querySelector('.github-link').textContent = t.github;
    
    // 更新主题按钮文字
    themeLightBtn.querySelector('span').textContent = t.themeLight;
    themeDarkBtn.querySelector('span').textContent = t.themeDark;

    // 更新引导提示
    const hint = document.getElementById('empty-hint');
    if (hint && !hint.classList.contains('hidden')) {
      hint.textContent = t.emptyHint;
    }

    // HTML and Body lang
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }
});
