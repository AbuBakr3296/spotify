export function secToMin(val){
  let time = Math.round(val);
  let sec;
  let min;

  if(time<60){
    sec = time;
    min = 0;
  } else {
    sec = time % 60
    min = Math.floor(time/60);
  }
  if(sec < 10){
    sec = `0${sec}`;
  }
  if(min <10){
    min = `0${min}`;
  }

  return `${min}:${sec}`;
}
