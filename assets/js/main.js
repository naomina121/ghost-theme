
// グローバル変数
let mobileMenuOpen = false;
const toggleButton = document.getElementById('theme-toggle')
const toggleButton2 = document.getElementById('theme-toggle2')
const currentMode = localStorage.getItem('theme') || 'light'

/**
 * モバイルメニューの開閉を切り替える関数
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-navigation");
  const hamburgerButton = document.getElementById("hamburger-button");

  mobileMenuOpen = !mobileMenuOpen;

  if (mobileMenuOpen) {
    mobileMenu.classList.add("active");
    hamburgerButton.classList.add("active");
    hamburgerButton.setAttribute("aria-expanded", "true");
    hamburgerButton.setAttribute("aria-label", "メニューを閉じる");

    // フォーカストラップのため、最初のメニュー項目にフォーカス
    const firstMenuItem = mobileMenu.querySelector("a");
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
  const mobileMenu = document.getElementById("mobile-navigation");
  const hamburgerButton = document.getElementById("hamburger-button");

  mobileMenuOpen = false;
  mobileMenu.classList.remove("active");
  hamburgerButton.classList.remove("active");
  hamburgerButton.setAttribute("aria-expanded", "false");
  hamburgerButton.setAttribute("aria-label", "メニューを開く");
}

/**
 * キーボードイベントの処理
 */
function handleKeyboardEvents(event) {
  // ESCキーでメニューを閉じる
  if (event.key === "Escape" && mobileMenuOpen) {
    closeMobileMenu();
    document.getElementById("hamburger-button").focus();
    return;
  }

  // フォーカストラップ（Tab キーでのナビゲーション制御）
  if (mobileMenuOpen && event.key === "Tab") {
    const mobileMenu = document.getElementById("mobile-navigation");
    const focusableElements = mobileMenu.querySelectorAll("a");
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
  const mobileMenu = document.getElementById("mobile-navigation");
  const hamburgerButton = document.getElementById("hamburger-button");

  if (mobileMenuOpen &&
      !mobileMenu.contains(event.target) &&
      !hamburgerButton.contains(event.target)) {
    closeMobileMenu();
  }
}

/**
 * DOMが読み込まれた後に実行される初期化関数
 */
function initializeMenu() {
  // イベントリスナーの追加
  document.addEventListener("keydown", handleKeyboardEvents);
  document.addEventListener("click", handleClickEvents);

  console.log("ハンバーガーメニューが初期化されました");
}

// DOMContentLoadedイベントで初期化
document.addEventListener("DOMContentLoaded", initializeMenu);

// 初期テーマを設定
document.body.setAttribute('data-theme', currentMode)
toggleButton.textContent = currentMode === 'dark' ? '☀️' : '🌙'
toggleButton2.textContent = currentMode === 'dark' ? '☀️' : '🌙'

toggleButton.addEventListener('click', () => {
  // 現在のテーマを取得
  const currentTheme = document.body.getAttribute('data-theme')

  // テーマを切り替え
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

  // DOMとローカルストレージを更新
  document.body.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)

  // ボタンのテキストを更新
  toggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙'
})

toggleButton2.addEventListener('click', () => {
  // 現在のテーマを取得
  const currentTheme = document.body.getAttribute('data-theme')

  // テーマを切り替え
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

  // DOMとローカルストレージを更新
  document.body.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)

  // ボタンのテキストを更新
  toggleButton2.textContent = newTheme === 'dark' ? '☀️' : '🌙'
})

// ページネーションのリンクを生成する関数
function pathnameParser(pathname) {
  if (!/page/.test(pathname)) {
    return pathname
  }

  return pathname.split('page')[0]
}

// ページネーションのナビゲーションボタンを生成する関数
function navButtonFormatter(nextOrPrevEl, nextOrPrevName, paginationEl) {
  const icon = nextOrPrevName === 'previous' ? '前へ' : '次へ'
  const className = nextOrPrevName === 'previous' ? 'sm-prev' : 'sm-next'

  const navButton = nextOrPrevEl
    ? document.createElement('a')
    : document.createElement('span')
  navButton.innerHTML = `<button class='px-3 py-2 bg-gray-900 text-white rounded'>${icon}</button>`
  navButton.classList.add('sm-circle-icon-button', className)

  if (nextOrPrevEl) {
    navButton.setAttribute('aria-label', `${nextOrPrevName} posts`)
    navButton.setAttribute('href', nextOrPrevEl)
  } else {
    navButton.classList.add('hidden', 'sm-circle-icon-button', 'sm-nav-disabled')
  }

  paginationEl.append(navButton)
}

// ページネーションを生成する関数
function generatePagination() {
  const pagination = document.querySelector('.sm-pagination')

  if (!pagination) return
  pagination.setAttribute('aria-label', 'page selector')
  const pathname = pathnameParser(window.location.pathname)
  const { page, prev, next, pages } = pagination.dataset

  navButtonFormatter(prev, 'previous', pagination)

  const paginationStart = page - 2 > 0 ? page - 2 : 1

  for (
    let index = paginationStart - 1;
    index < Math.min(paginationStart + 4, +pages);
    index += 1
  ) {
    if (index >= +pages) break

    let urlPath

    if (index === 0 && pathname === '/') {
      urlPath = `${window.location}`
    } else if (index === 0 && pathname !== '/') {
      urlPath = pathname
    } else {
      urlPath = `${window.location.origin}/${pathname}page/${index + 1}/`
    }

    const button = document.createElement('a')
    button.classList.add('sm-pagination-item', 'px-3', 'border-solid-2', 'border-gray-200', 'py-2', 'rounded')
    button.setAttribute('aria-label', `Go to page ${index + 1}`)
    button.textContent = index + 1
    if (index === 0 && pathname === '/') {
      button.setAttribute('href', '/')
    } else if (index === 0 && pathname !== '/') {
      button.setAttribute('href', pathname)
    } else {
      button.setAttribute('href', `${window.location.origin}${pathname}page/${index + 1}/`)
    }

    if (+page === index + 1) {
      button.classList.add('sm-current')
    }
    pagination.append(button)
  }

  navButtonFormatter(next, 'next', pagination)
}

document.addEventListener('DOMContentLoaded', () => {
  generatePagination()
})

// 目次のアクティブ状態を更新
function updateTOC() {
  const sections = document.querySelectorAll(
    '.article-content h2, .article-content h3, #comments'
  );
  const tocItems = document.querySelectorAll('.toc-item')

  let currentSection = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom > 100) {
      currentSection = section.id;
    }
  });

  tocItems.forEach((item) => {
    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}

window.addEventListener('scroll', updateTOC)
updateTOC()

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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            emailType: 'subscribe'
          })
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            emailType: 'subscribe'
          })
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
})

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
  const videoId = document.getElementById('player').getAttribute('data-id')

  if(!videoId){
    return;
  }
// frontmatterElが存在するか確認
  const ytVideo = document.getElementById('player');
  if(!ytVideo){
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
                'onReady': onPlayerReady,
                // 必要であれば他のイベントも追加
                // 'onStateChange': onPlayerStateChange
            }
        });
        console.log('YT.Player object created.'); // ログ追加
    } catch (error) {
        console.error('Error creating YT.Player:', error); // エラーハンドリング
    }
}

// ============================================
// プレーヤー準備完了時の処理
// ============================================
// YT.Playerの準備ができたら呼び出される関数
function onPlayerReady(event) {
    console.log('Player is ready.'); // ログ追加: プレーヤー準備完了を確認
    // プレーヤーが準備できてからクリックイベントを設定
    setupChapterClickEvents();
}

// ============================================
// チャプターリスト関連
// ============================================

// 時間文字列 (HH:MM:SS or MM:SS) を秒に変換する関数
function timeToSeconds(timeString) {
  const parts = timeString.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 3) { // HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) { // MM:SS
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

    const lines = text.split('\n').filter(line => line.trim() !== ''); // テキストを行ごとに分割
    const chapters = [];

    // 正規表現でタイムスタンプとタイトルを抽出
    const regex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;

    lines.forEach(line => {
        const match = line.trim().match(regex);
        if (match) {
            const time = match[1]; // 時間文字列 (例: '1:15')
            const title = match[2]; // タイトル (例: 'トピックA')
            const seconds = timeToSeconds(time); // 秒に変換 (例: 75)
            chapters.push({ time, title, seconds });
        }
    });

    if (chapters.length === 0) {
        chapterListElement.innerHTML = '<p>チャプター情報が見つかりませんでした。</p>';
        return;
    }

    // 目次リストのHTMLを生成
    const ul = document.createElement('ul');
    chapters.forEach(chapter => {
        const li = document.createElement('li');
        li.textContent = `${chapter.time} ${chapter.title}`;
        li.setAttribute('data-seconds', chapter.seconds); // 秒数をdata属性として保持
        // 既存のイベントリスナーを削除（複数回呼ばれた場合の重複防止）
        // ※ より堅牢にするなら、関数自体を渡して削除する
        // chapter.removeEventListener('click', handleChapterClick);

        // 新しいイベントリスナーを追加
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
        console.warn('Clicked item is missing data-seconds attribute:', chapter.textContent);
        return;
    }

    console.log(`Chapter clicked: ${chapter.textContent.trim()}, seeking to ${seconds}s`); // ログ追加

    // playerオブジェクトとseekToメソッドの存在を確認
    if (player && typeof player.seekTo === 'function') {
        player.seekTo(seconds, true); // 指定秒数に移動し、再生を開始
    } else {
        console.error('Player is not ready or seekTo function is unavailable when clicking chapter.');
    }
}
