// ローカルストレージから過去データ取得
let diary = JSON.parse(localStorage.getItem("diary")) || [];

// 過去データを表示
function renderDiary() {
  const list = document.getElementById("diary-list");
  list.innerHTML = "";
  diary.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} : ${entry.weather}`;
    list.appendChild(li);
  });
}

// 今日の記録を保存
function saveToday(weather) {
  const today = new Date().toLocaleDateString();
  // 同じ日付があれば上書き
  const index = diary.findIndex(e => e.date === today);
  if(index >= 0){
    diary[index].weather = weather;
  } else {
    diary.push({ date: today, weather });
  }
  localStorage.setItem("diary", JSON.stringify(diary));
  document.getElementById("today-result").textContent = `今日の気分: ${weather}`;
  renderDiary();
}

// ボタンにイベント追加
document.querySelectorAll("#weather-buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const weather = button.getAttribute("data-weather");
    saveToday(weather);
  });
});

// 初期表示
renderDiary();
