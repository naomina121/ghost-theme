// グローバル変数
let mobileMenuOpen = false;
const toggleButton = document.getElementById('theme-toggle');
const toggleButton2 = document.getElementById('theme-toggle2');
const currentMode = localStorage.getItem('theme') || 'light';

/**
 * モバイルメニューの開閉を切り替える関数
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-navigation');
  const hamburgerButton = document.getElementById('hamburger-button');

  mobileMenuOpen = !mobileMenuOpen;

  if (mobileMenuOpen) {
    mobileMenu.classList.add('active');
    hamburgerButton.classList.add('active');
    hamburgerButton.setAttribute('aria-expanded', 'true');
    hamburgerButton.setAttribute('aria-label', 'メニューを閉じる');

    // フォーカストラップのため、最初のメニュー項目にフォーカス
    const firstMenuItem = mobileMenu.querySelector('a');
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  } else {
    closeMobileMenu();
  }
}

/**
 * モバイルメニューを閉じる関数
 */
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-navigation');
  const hamburgerButton = document.getElementById('hamburger-button');

  mobileMenuOpen = false;
  mobileMenu.classList.remove('active');
  hamburgerButton.classList.remove('active');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'メニューを開く');
}

/**
 * キーボードイベントの処理
 */
function handleKeyboardEvents(event) {
  // ESCキーでメニューを閉じる
  if (event.key === 'Escape' && mobileMenuOpen) {
    closeMobileMenu();
    document.getElementById('hamburger-button').focus();
    return;
  }

  // フォーカストラップ（Tab キーでのナビゲーション制御）
  if (mobileMenuOpen && event.key === 'Tab') {
    const mobileMenu = document.getElementById('mobile-navigation');
    const focusableElements = mobileMenu.querySelectorAll('a');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * クリックイベントの処理（メニュー外クリックでメニューを閉じる）
 */
function handleClickEvents(event) {
  const mobileMenu = document.getElementById('mobile-navigation');
  const hamburgerButton = document.getElementById('hamburger-button');

  if (
    mobileMenuOpen &&
    !mobileMenu.contains(event.target) &&
    !hamburgerButton.contains(event.target)
  ) {
    closeMobileMenu();
  }
}

/**
 * DOMが読み込まれた後に実行される初期化関数
 */
function initializeMenu() {
  // イベントリスナーの追加
  document.addEventListener('keydown', handleKeyboardEvents);
  document.addEventListener('click', handleClickEvents);

  console.log('ハンバーガーメニューが初期化されました');
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', initializeMenu);

// 初期テーマを設定
document.body.setAttribute('data-theme', currentMode);
toggleButton.textContent = currentMode === 'dark' ? '☀️' : '🌙';
toggleButton2.textContent = currentMode === 'dark' ? '☀️' : '🌙';

toggleButton.addEventListener('click', () => {
  // 現在のテーマを取得
  const currentTheme = document.body.getAttribute('data-theme');

  // テーマを切り替え
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // DOMとローカルストレージを更新
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // ボタンのテキストを更新
  toggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

toggleButton2.addEventListener('click', () => {
  // 現在のテーマを取得
  const currentTheme = document.body.getAttribute('data-theme');

  // テーマを切り替え
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // DOMとローカルストレージを更新
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // ボタンのテキストを更新
  toggleButton2.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// ページネーションのリンクを生成する関数
function pathnameParser(pathname) {
  if (!/page/.test(pathname)) {
    return pathname;
  }

  return pathname.split('page')[0];
}

// ページネーションのナビゲーションボタンを生成する関数
function navButtonFormatter(nextOrPrevEl, nextOrPrevName, paginationEl) {
  const icon = nextOrPrevName === 'previous' ? '前へ' : '次へ';
  const className = nextOrPrevName === 'previous' ? 'sm-prev' : 'sm-next';

  const navButton = nextOrPrevEl
    ? document.createElement('a')
    : document.createElement('span');
  navButton.innerHTML = `<button class='px-3 py-2 bg-gray-900 text-white rounded'>${icon}</button>`;
  navButton.classList.add('sm-circle-icon-button', className);

  if (nextOrPrevEl) {
    navButton.setAttribute('aria-label', `${nextOrPrevName} posts`);
    navButton.setAttribute('href', nextOrPrevEl);
  } else {
    navButton.classList.add(
      'hidden',
      'sm-circle-icon-button',
      'sm-nav-disabled'
    );
  }

  paginationEl.append(navButton);
}

// ページネーションを生成する関数
function generatePagination() {
  const pagination = document.querySelector('.sm-pagination');

  if (!pagination) return;
  pagination.setAttribute('aria-label', 'page selector');
  const pathname = pathnameParser(window.location.pathname);
  const { page, prev, next, pages } = pagination.dataset;

  navButtonFormatter(prev, 'previous', pagination);

  const paginationStart = page - 2 > 0 ? page - 2 : 1;

  for (
    let index = paginationStart - 1;
    index < Math.min(paginationStart + 4, +pages);
    index += 1
  ) {
    if (index >= +pages) break;

    let urlPath;

    if (index === 0 && pathname === '/') {
      urlPath = `${window.location}`;
    } else if (index === 0 && pathname !== '/') {
      urlPath = pathname;
    } else {
      urlPath = `${window.location.origin}/${pathname}page/${index + 1}/`;
    }

    const button = document.createElement('a');
    button.classList.add(
      'sm-pagination-item',
      'px-3',
      'border-solid-2',
      'border-gray-200',
      'py-2',
      'rounded'
    );
    button.setAttribute('aria-label', `Go to page ${index + 1}`);
    button.textContent = index + 1;
    if (index === 0 && pathname === '/') {
      button.setAttribute('href', '/');
    } else if (index === 0 && pathname !== '/') {
      button.setAttribute('href', pathname);
    } else {
      button.setAttribute(
        'href',
        `${window.location.origin}${pathname}page/${index + 1}/`
      );
    }

    if (+page === index + 1) {
      button.classList.add('sm-current');
    }
    pagination.append(button);
  }

  navButtonFormatter(next, 'next', pagination);
}

document.addEventListener('DOMContentLoaded', () => {
  generatePagination();
});

// 目次のアクティブ状態を更新
function updateTOC() {
  const sections = document.querySelectorAll(
    '.article-content h2, .article-content h3, #comments'
  );
  const tocItems = document.querySelectorAll('.toc-item');

  let currentSection = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom > 100) {
      currentSection = section.id;
    }
  });

  tocItems.forEach((item) => {
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateTOC);
updateTOC();

// Ghostのメンバー機能を初期化
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('[data-members-form=["subscribe"]');
  const successMessage = document.querySelector('.message-success');
  const errorMessage = document.querySelector('.message-error');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = form.querySelector('input[name="email"]').value;

      try {
        const response = await fetch('/members/api/send-magic-link/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            emailType: 'subscribe',
          }),
        });

        if (response.ok) {
          successMessage.style.display = 'block';
          errorMessage.style.display = 'none';
          form.reset();
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      }
    });
  }
});
// Ghostを登録初期化
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('[data-members-form=["signup"]');
  const successMessage = document.querySelector('.message-success');
  const errorMessage = document.querySelector('.message-error');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = form.querySelector('input[name="email"]').value;

      try {
        const response = await fetch('/members/api/send-magic-link/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            emailType: 'subscribe',
          }),
        });

        if (response.ok) {
          successMessage.style.display = 'block';
          errorMessage.style.display = 'none';
          form.reset();
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      }
    });
  }
});

// input[type="submit"]のクリックをしたら、5秒間そうしんできないようにする
document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.querySelector('input[type="submit"]');
  if (submitButton) {
    submitButton.addEventListener('click', function () {
      submitButton.disabled = true;
      setTimeout(() => {
        submitButton.disabled = false;
      }, 5000);
    });
  }
});

// ============================================
// グローバル変数
// ============================================
let player; // YouTubeプレーヤーオブジェクト
let transcriptData = []; // トランスクリプトデータを格納
let currentTranscriptIndex = 0; // 現在のトランスクリプトインデックス
let timeUpdateInterval = null; // 時間更新用のインターバル

// ============================================
// YOUTUBEAPI
// ============================================
let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// ============================================
// API準備完了時の処理
// ============================================
function onYouTubeIframeAPIReady() {
  // YouTubeの動画IDを取得
  const videoId = document.getElementById('player').getAttribute('data-id');

  if (!videoId) {
    return;
  }
  // frontmatterElが存在するか確認
  const ytVideo = document.getElementById('player');
  if (!ytVideo) {
    return;
  }

  console.log(`Initializing player for video ID: ${videoId}`); // ログ追加

  try {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: videoId,
      events: {
        // 'onReady'イベントハンドラを追加
        onReady: onPlayerReady,
        // 状態変更イベントを追加
        onStateChange: onPlayerStateChange,
      },
    });
    console.log('YT.Player object created.'); // ログ追加
  } catch (error) {
    console.error('Error creating YT.Player:', error); // エラーハンドリング
  }
}

// ============================================
// プレーヤー準備完了時の処理
// ============================================
function onPlayerReady(event) {
  console.log('Player is ready.'); // ログ追加: プレーヤー準備完了を確認
  // プレーヤーが準備できてからクリックイベントを設定
  setupChapterClickEvents();
  // トランスクリプトの初期化
  initializeTranscript();
  // アコーディオンの監視を開始
  observeAccordion();
}

// ============================================
// プレーヤー状態変更時の処理
// ============================================
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    // 再生開始時にトランスクリプトの更新を開始
    startTranscriptTracking();
  } else {
    // 再生停止時にトランスクリプトの更新を停止
    stopTranscriptTracking();
  }
}

// ============================================
// トランスクリプト関連
// ============================================

// トランスクリプトデータの初期化
function initializeTranscript() {
  // HTMLからトランスクリプトデータを取得
  const transcriptSource = document.getElementById('transcript-source');

  if (!transcriptSource) {
    console.warn('Transcript source element not found');
    return;
  }

  // 複数の形式に対応
  const transcriptItems = transcriptSource.querySelectorAll(
    '.transcript-segment, [data-timestamp]'
  );

  if (transcriptItems.length > 0) {
    // データ属性形式の場合
    transcriptItems.forEach((item) => {
      const timestamp = item.getAttribute('data-timestamp');
      const text = item.textContent.trim();

      if (timestamp && text) {
        const seconds = timeToSeconds(timestamp);
        transcriptData.push({ time: timestamp, text, seconds });
      }
    });
  } else {
    // プレーンテキスト形式の場合（後方互換性のため）
    const transcriptText = transcriptSource.textContent;
    const regex = /\((\d{2}:\d{2})\)\s*(.*?)(?=\(\d{2}:\d{2}\)|$)/gs;
    let match;

    while ((match = regex.exec(transcriptText)) !== null) {
      const time = match[1];
      const text = match[2].trim();
      const seconds = timeToSeconds(time);
      transcriptData.push({ time, text, seconds });
    }
  }

  console.log('Transcript data initialized:', transcriptData);
}

// トランスクリプトコンテナの作成
function createTranscriptContainer() {
  // 既存のコンテナがあれば削除
  const existingContainer = document.getElementById('transcript-container');
  if (existingContainer) {
    existingContainer.remove();
  }

  // HTMLを作成
  const html = `
    <div id="transcript-container" style="display: none;">
      <div id="transcript-box">
        <div id="transcript-content"></div>
      </div>
    </div>
  `;

  // アコーディオンの後に挿入
  const accordion = document.querySelector('.transcript-accordion');
  if (accordion) {
    accordion.insertAdjacentHTML('afterend', html);
  }

  // トランスクリプトの内容を生成
  const contentDiv = document.getElementById('transcript-content');
  transcriptData.forEach((item, index) => {
    const p = document.createElement('p');
    p.className = 'transcript-item';
    p.setAttribute('data-index', index);
    p.setAttribute('data-seconds', item.seconds);
    p.innerHTML = `<span class="transcript-time">${item.time}</span> ${item.text}`;

    // クリックで該当箇所にシーク
    p.addEventListener('click', () => {
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(item.seconds, true);
      }
    });

    contentDiv.appendChild(p);
  });
}

// アコーディオンの開閉を監視
function observeAccordion() {
  // アコーディオンのdetails要素を取得
  const detailsElement = document.querySelector('.transcript-accordion');
  if (!detailsElement) {
    console.warn('Accordion element not found');
    return;
  }

  // toggleイベントを使用（より確実）
  detailsElement.addEventListener('toggle', (event) => {
    const isOpen = event.target.open;
    console.log('Accordion toggled:', isOpen);
    handleAccordionToggle(isOpen);
  });

  // 初期状態をチェック
  if (detailsElement.hasAttribute('open')) {
    handleAccordionToggle(true);
  }
}

// アコーディオンの開閉時の処理
function handleAccordionToggle(isOpen) {
  console.log('handleAccordionToggle called with:', isOpen);

  const container = document.getElementById('transcript-container');

  if (isOpen) {
    console.log('Opening accordion...');
    // コンテナがなければ作成
    if (!container) {
      console.log('Creating transcript container...');
      createTranscriptContainer();
      // 作成後、表示を確実にする
      setTimeout(() => {
        const newContainer = document.getElementById('transcript-container');
        if (newContainer) {
          newContainer.style.display = 'block';
        }
      }, 100);
    } else {
      console.log('Showing existing container...');
      container.style.display = 'block';
    }

    // 現在の再生位置に合わせてスクロール
    if (player && typeof player.getCurrentTime === 'function') {
      const currentTime = player.getCurrentTime();
      scrollToCurrentTime(currentTime);
    }

    // 再生中であればトラッキングを開始
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
      startTranscriptTracking();
    }
  } else {
    console.log('Closing accordion...');
    // アコーディオンを閉じたときはコンテナを非表示
    if (container) {
      container.style.display = 'none';
    }
    stopTranscriptTracking();
  }
}

// トランスクリプトの追跡を開始
function startTranscriptTracking() {
  // 既存のインターバルがあればクリア
  stopTranscriptTracking();

  // 100ミリ秒ごとに現在時間をチェック
  timeUpdateInterval = setInterval(() => {
    if (player && typeof player.getCurrentTime === 'function') {
      const currentTime = player.getCurrentTime();
      updateTranscriptHighlight(currentTime);
    }
  }, 100);
}

// トランスクリプトの追跡を停止
function stopTranscriptTracking() {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }
}

// トランスクリプトのハイライトを更新
function updateTranscriptHighlight(currentTime) {
  // 現在の時間に対応するトランスクリプトアイテムを探す
  let activeIndex = -1;
  for (let i = transcriptData.length - 1; i >= 0; i--) {
    if (currentTime >= transcriptData[i].seconds) {
      activeIndex = i;
      break;
    }
  }

  // アクティブなアイテムが変わった場合のみ更新
  if (activeIndex !== currentTranscriptIndex && activeIndex !== -1) {
    currentTranscriptIndex = activeIndex;
    highlightTranscriptItem(activeIndex);
    scrollToTranscriptItem(activeIndex);
  }
}

// トランスクリプトアイテムをハイライト
function highlightTranscriptItem(index) {
  // すべてのハイライトを削除
  document.querySelectorAll('.transcript-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 指定されたアイテムをハイライト
  const activeItem = document.querySelector(
    `.transcript-item[data-index="${index}"]`
  );
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

// トランスクリプトアイテムまでスクロール
function scrollToTranscriptItem(index) {
  const activeItem = document.querySelector(
    `.transcript-item[data-index="${index}"]`
  );
  const container = document.getElementById('transcript-box');

  if (activeItem && container) {
    // スムーズスクロール
    const itemTop = activeItem.offsetTop;
    const containerHeight = container.clientHeight;
    const itemHeight = activeItem.clientHeight;

    // アイテムを中央に配置
    const scrollPosition = itemTop - containerHeight / 2 + itemHeight / 2;

    container.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  }
}

// 指定時間に対応する位置にスクロール
function scrollToCurrentTime(seconds) {
  for (let i = transcriptData.length - 1; i >= 0; i--) {
    if (seconds >= transcriptData[i].seconds) {
      highlightTranscriptItem(i);
      scrollToTranscriptItem(i);
      currentTranscriptIndex = i;
      break;
    }
  }
}

// ============================================
// チャプターリスト関連（既存のコード）
// ============================================

// 時間文字列 (HH:MM:SS or MM:SS) を秒に変換する関数
function timeToSeconds(timeString) {
  const parts = timeString.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    // HH:MM:SS
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    seconds = parts[0] * 60 + parts[1];
  }
  return seconds;
}

// チャプターリストのクリックイベントを設定する関数
function setupChapterClickEvents() {
  console.log('Setting up chapter click events.'); // ログ追加
  const chapterListElement = document.getElementById('chapter-list');
  let text = chapterListElement.innerHTML;

  if (!chapterListElement) {
    console.warn('Element with id "chapter-list" not found.');
    return;
  }

  const lines = text.split('\n').filter((line) => line.trim() !== ''); // テキストを行ごとに分割
  const chapters = [];

  // 正規表現でタイムスタンプとタイトルを抽出
  const regex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;

  lines.forEach((line) => {
    const match = line.trim().match(regex);
    if (match) {
      const time = match[1]; // 時間文字列 (例: '1:15')
      const title = match[2]; // タイトル (例: 'トピックA')
      const seconds = timeToSeconds(time); // 秒に変換 (例: 75)
      chapters.push({ time, title, seconds });
    }
  });

  if (chapters.length === 0) {
    chapterListElement.innerHTML =
      '<p>チャプター情報が見つかりませんでした。</p>';
    return;
  }

  // 目次リストのHTMLを生成
  const ul = document.createElement('ul');
  chapters.forEach((chapter) => {
    const li = document.createElement('li');
    li.textContent = `${chapter.time} ${chapter.title}`;
    li.setAttribute('data-seconds', chapter.seconds); // 秒数をdata属性として保持
    li.addEventListener('click', handleChapterClick);
    ul.appendChild(li);
  });
  chapterListElement.innerHTML = ''; // 古い内容をクリア
  chapterListElement.appendChild(ul); // 生成したリストを追加
}

// クリックイベントのハンドラ関数
function handleChapterClick(event) {
  const chapter = event.currentTarget; // クリックされたli要素
  const seconds = chapter.getAttribute('data-seconds');

  if (seconds === null) {
    console.warn(
      'Clicked item is missing data-seconds attribute:',
      chapter.textContent
    );
    return;
  }

  console.log(
    `Chapter clicked: ${chapter.textContent.trim()}, seeking to ${seconds}s`
  ); // ログ追加

  // playerオブジェクトとseekToメソッドの存在を確認
  if (player && typeof player.seekTo === 'function') {
    player.seekTo(seconds, true); // 指定秒数に移動し、再生を開始

    // トランスクリプトも同期
    scrollToCurrentTime(seconds);
  } else {
    console.error(
      'Player is not ready or seekTo function is unavailable when clicking chapter.'
    );
  }
}

// ============================================
// CSS スタイルの追加
// ============================================
const style = document.createElement('style');
style.textContent = `
  #transcript-container {
    margin-top: 20px;
  }

  #transcript-box {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    position: relative;
  }

  .transcript-item {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    line-height: 1.6;
    cursor: pointer;
  }

  .transcript-item:hover {
  }

  .transcript-item.active {;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .transcript-time {
    color: #666;
    font-size: 0.9em;
    margin-right: 10px;
    font-weight: normal;
  }

  .transcript-accordion {
    margin-top: 20px;
  }

  .transcript-accordion summary {
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
    font-weight: bold;
  }

  .transcript-accordion summary:hover {
    opacity: 0.8;
  }

  /* トランスクリプトソースを非表示にする */
  #transcript-source {
    display: none;
  }
`;
document.head.appendChild(style);
