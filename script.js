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

// カレンダー描画
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
    div.textContent = diary[dateStr] || "";
    div.title = dateStr;
    calendar.appendChild(div);
  }
}

// 今日の記録を保存
function saveToday(weather) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  diary[dateStr] = weather;
  localStorage.setItem("diary", JSON.stringify(diary));
  document.getElementById("today-result").textContent = `今日の気分: ${weather}`;
  renderCalendar();
}

// 天気ボタンイベント
document.querySelectorAll("#weather-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const weather = button.getAttribute("data-weather");
    saveToday(weather);
  });
});

// 初期描画
renderCalendar();
