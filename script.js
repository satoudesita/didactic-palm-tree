// ローカルストレージからデータ取得
let diary = JSON.parse(localStorage.getItem("diary")) || {};

// タブ切り替え
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");

    button.classList.add("active");
    document.getElementById(button.dataset.tab).style.display = "block";
  });
});

// 日記保存・表示
function saveTodayDiary(text) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  if (!diary[dateStr]) diary[dateStr] = "";
  // 天気マークだけの場合はオブジェクトに変換
  if (typeof diary[dateStr] === "string") {
    diary[dateStr] = { weather: diary[dateStr], text: "" };
  }
  diary[dateStr].text = text;
  localStorage.setItem("diary", JSON.stringify(diary));
  showTodayDiary();
  renderCalendar();
}

function showTodayDiary() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const diaryData = diary[dateStr];
  let text = "";
  if (diaryData && typeof diaryData === "object" && diaryData.text) {
    text = diaryData.text;
  }
  document.getElementById("today-diary").textContent = text ? `今日の日記: ${text}` : "";
}

// 日記フォームイベント
document.addEventListener('DOMContentLoaded', () => {
  const diaryForm = document.getElementById('diary-form');
  const diaryInput = document.getElementById('diary-input');
  if (diaryForm) {
    diaryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = diaryInput.value.trim();
      if (text) {
        saveTodayDiary(text);
        diaryInput.value = '';
      }
    });
    showTodayDiary();
  }
});

// 天気保存もオブジェクト対応
function saveToday(weather) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // 既存データがオブジェクトならweatherだけ更新
  if (diary[dateStr] && typeof diary[dateStr] === "object") {
    diary[dateStr].weather = weather;
  } else {
    diary[dateStr] = { weather: weather, text: "" };
  }
  localStorage.setItem("diary", JSON.stringify(diary));
  document.getElementById("today-result").textContent = `今日の気分: ${weather}`;
  showTodayDiary();
  renderCalendar();
}

// カレンダー描画も日記対応
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month + 1}-${day}`;
    const div = document.createElement("div");
    div.className = "day";
    let weather = "";
    let hasDiary = false;
    if (diary[dateStr]) {
      if (typeof diary[dateStr] === "object") {
        weather = diary[dateStr].weather || "";
        hasDiary = !!diary[dateStr].text;
      } else {
        weather = diary[dateStr];
      }
    }
    div.textContent = weather;
    if (hasDiary) {
      div.title = `${dateStr}\n${diary[dateStr].text}`;
      div.style.border = "2px solid #4caf50";
    } else {
      div.title = dateStr;
    }

    // クリックでその日の日記と天気を表示
    div.addEventListener('click', () => {
      showSelectedDiary(dateStr);
    });

    calendar.appendChild(div);
  }
}

// 選択した日の日記と天気を表示
function showSelectedDiary(dateStr) {
  const diaryData = diary[dateStr];
  let weather = "";
  let text = "";
  if (diaryData) {
    if (typeof diaryData === "object") {
      weather = diaryData.weather || "";
      text = diaryData.text || "";
    } else {
      weather = diaryData;
    }
  }
  // 表示用のエリアがなければ作成
  let selectedDiaryDiv = document.getElementById("selected-diary");
  if (!selectedDiaryDiv) {
    selectedDiaryDiv = document.createElement("div");
    selectedDiaryDiv.id = "selected-diary";
    selectedDiaryDiv.style.marginTop = "1em";
    const calendarTab = document.getElementById("calendar-tab");
    calendarTab.appendChild(selectedDiaryDiv);
  }
  selectedDiaryDiv.innerHTML = `<strong>${dateStr}</strong><br>
    メンタル天気: ${weather ? weather : "未記入"}<br>
    日記: ${text ? text : "未記入"}`;
}

// カレンダー初期描画
renderCalendar();

// ユーザーネーム・アイコン変更処理
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('username-form');
  const input = document.getElementById('username-input');
  const nameSpan = document.getElementById('user-name-text');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = input.value.trim();
      if (newName) {
        nameSpan.textContent = '@' + newName;
        input.value = '';
      }
    });
  }

  // アイコン画像変更
  const iconForm = document.getElementById('icon-form');
  const iconInput = document.getElementById('icon-input');
  const iconImg = document.getElementById('user-icon-img');

  if (iconForm) {
    iconForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = iconInput.value.trim();
      if (url) {
        iconImg.src = url;
        iconInput.value = '';
      }
    });
  }

  // 画像ファイルからアイコン設定
  const iconFileInput = document.getElementById('icon-file-input');

  if (iconFileInput) {
    iconFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          iconImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
