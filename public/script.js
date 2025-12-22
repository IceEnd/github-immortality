document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const usernameInput = document.getElementById('username-input');
  const generateBtn = document.getElementById('generate-btn');
  const statsCard = document.getElementById('stats-card');
  const loadingSpinner = document.getElementById('loading-spinner');
  const errorMessage = document.getElementById('error-message');
  const copySection = document.getElementById('copy-section');
  const codeOutput = document.getElementById('code-output');
  const copyBtn = document.getElementById('copy-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const langToggleBtn = document.getElementById('lang-toggle');

  // State
  let currentUsername = 'IceEnd';
  let currentFormat = 'markdown';
  let currentLang = 'zh';

  // Translations
  const translations = {
    zh: {
      title: 'GitHub Immortality',
      tagline: '你的 GitHub 旅程，化作一场修仙之途',
      placeholder: '输入 GitHub 用户名...',
      generate: '修炼',
      error: '无法获取该道友的修为，请检查用户名是否正确。',
      copy: '复制',
      copied: '已复制到识海！',
      github: 'GitHub 仓库'
    },
    en: {
      title: 'GitHub Immortality',
      tagline: 'Your GitHub Journey, Visualized as a Cultivation Path',
      placeholder: 'Enter GitHub username...',
      generate: 'Cultivate',
      error: 'Failed to fetch cultivation level. Please check the username.',
      copy: 'Copy',
      copied: 'Copied to Mind!',
      github: 'GitHub Repo'
    }
  };

  // Initialize
  initLanguage();
  updateCodeOutput();

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

  copyBtn.addEventListener('click', copyToClipboard);

  // Functions
  function generateCard() {
    const username = usernameInput.value.trim();
    if (!username) return;

    currentUsername = username;
    showLoading();

    // Update card image
    const cardUrl = `/api?username=${username}`;
    statsCard.src = cardUrl;

    statsCard.onload = () => {
      hideLoading();
      statsCard.classList.remove('hidden');
      copySection.classList.remove('hidden');
      updateCodeOutput();
    };

    statsCard.onerror = () => {
      hideLoading();
      errorMessage.classList.remove('hidden');
      copySection.classList.add('hidden');
    };
  }

  function showLoading() {
    loadingSpinner.classList.remove('hidden');
    statsCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
  }

  function hideLoading() {
    loadingSpinner.classList.add('hidden');
  }

  function updateCodeOutput() {
    const baseUrl = window.location.origin;
    const cardUrl = `${baseUrl}/api?username=${currentUsername}`;
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

    // HTML and Body lang
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }
});
