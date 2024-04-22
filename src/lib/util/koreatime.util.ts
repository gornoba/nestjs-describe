export function currentTime(value?: Date) {
  // 날짜와 시간을 UTC 기준으로 파싱
  const utcDate = value ? new Date(value) : new Date();
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  // Intl.DateTimeFormat을 사용하여 서울 시간대로 포맷팅
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');
  const seconds = String(kstDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(kstDate.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
