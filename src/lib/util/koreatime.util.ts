export function currentTime() {
  // 날짜와 시간을 UTC 기준으로 파싱
  const date = new Date();

  // Intl.DateTimeFormat을 사용하여 서울 시간대로 포맷팅
  const seoulTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Seoul',
  }).format(date);

  return seoulTime;
}
