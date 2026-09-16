const STORAGE_KEY='cpns_tryout_v1';
let QUESTIONS_ALL=[];
let QUESTIONS=[];
let answers=[];
let doubts=[];
let cur=0;

function pickRandom(arr,n){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a.slice(0,n); }
function buildBank(){ 
  const twk=QUESTIONS_ALL.filter(q=>q.cat==='TWK');
  const tiu=QUESTIONS_ALL.filter(q=>q.cat==='TIU');
  const tkp=QUESTIONS_ALL.filter(q=>q.cat==='TKP');
  QUESTIONS=[...pickRandom(twk,30),...pickRandom(tiu,35),...pickRandom(tkp,45)];
  // shuffle within? keep cat groups order TWK->TIU->TKP for UX
  for(let i=QUESTIONS.length-1;i>0;i--){} // no full shuffle, keep grouping
}

let timerSec=100*60;
let timerId=null;
let startSec=null;
let finished=false;

const $=s=>document.querySelector(s);
const home=$('#home'), quiz=$('#quiz'), result=$('#result');
const qCat=$('#qCat'), qProgress=$('#qProgress'), qText=$('#qText'), choicesEl=$('#choices');
const timerEl=$('#timer'), navGrid=$('#navGrid'), gridPanel=$('#gridPanel');

function saveState(){
  const state={answers,doubts,cur,timerSec,finished,startSec};
  try{localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}catch(e){}
}
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(s && Array.isArray(s.answers) && s.answers.length===110) return s;
  }catch(e){}
  return null;
}
function clearState(){ localStorage.removeItem(STORAGE_KEY); }

async function loadQuestions(){
  const res = await fetch('content/questions.json');
  QUESTIONS_ALL = await res.json();
  buildBank();
  answers = Array(QUESTIONS.length).fill(null);
  doubts = Array(QUESTIONS.length).fill(false);
}

function showScreen(name){
  home.classList.remove('active'); quiz.classList.remove('active'); result.classList.remove('active');
  if(name==='home') home.classList.add('active');
  if(name==='quiz') quiz.classList.add('active');
  if(name==='result') result.classList.add('active');
  window.scrollTo(0,0);
}

function formatTime(s){
  const m=Math.floor(s/60).toString().padStart(2,'0');
  const ss=(s%60).toString().padStart(2,'0');
  return m+':'+ss;
}

function startTimer(){
  if(timerId) clearInterval(timerId);
  timerEl.textContent=formatTime(timerSec);
  timerEl.classList.toggle('warn', timerSec<=10*60);
  timerId=setInterval(()=>{
    timerSec--;
    timerEl.textContent=formatTime(timerSec);
    timerEl.classList.toggle('warn', timerSec<=10*60);
    if(timerSec<=0){ clearInterval(timerId); finishQuiz(true); }
    if(timerSec%5===0) saveState();
  },1000);
}

function renderQuestion(){
  const q=QUESTIONS[cur];
  qCat.textContent=q.cat;
  qProgress.textContent=(cur+1)+' / '+QUESTIONS.length;
  qText.textContent=(cur+1)+'. '+q.prompt;
  choicesEl.innerHTML='';
  const letters=['A','B','C','D'];
  q.choices.forEach((c,i)=>{
    const div=document.createElement('div');
    div.className='choice'+(answers[cur]===i?' sel':'');
    div.onclick=()=>{ answers[cur]=i; saveState(); renderQuestion(); renderGrid(); };
    div.innerHTML='<div class="bullet">'+letters[i]+'</div><div style="flex:1;font-size:14px">'+c+'</div>';
    choicesEl.appendChild(div);
  });
  $('#chkDoubt').checked=!!doubts[cur];
  renderGridHighlight();
  $('#btnPrev').disabled=cur===0;
  $('#btnNext').textContent=cur===QUESTIONS.length-1?'Ke Hasil ›':'Selanjutnya ›';
}

function renderGrid(){
  navGrid.innerHTML='';
  QUESTIONS.forEach((q,i)=>{
    const b=document.createElement('div');
    b.className='navbtn'+(answers[i]!==null?' done':'')+(i===cur?' current':'');
    b.textContent=i+1;
    if(doubts[i]) b.textContent+='*';
    b.onclick=()=>{ cur=i; renderQuestion(); };
    navGrid.appendChild(b);
  });
}
function renderGridHighlight(){
  [...navGrid.children].forEach((el,i)=>{
    el.classList.toggle('current', i===cur);
    el.classList.toggle('done', answers[i]!==null);
  });
}

function calcScore(){
  let twk=0, tiu=0, tkp=0;
  let correctCount=0;
  QUESTIONS.forEach((q,i)=>{
    const ans=answers[i];
    if(ans===null) return;
    if(q.cat==='TKP'){
      // TKP: 5 poin jika benar, 3/2/1 jika salah (simulasi)
      if(ans===q.correct){ tkp+=5; correctCount++; }
      else {
        // beri 1-3 poin tergantung jarak
        const dist = Math.abs(ans - q.correct);
        if(dist===1) tkp+=3;
        else if(dist===2) tkp+=2;
        else tkp+=1;
      }
    } else {
      if(ans===q.correct){ 
        if(q.cat==='TWK') twk+=5; else tiu+=5;
        correctCount++;
      }
    }
  });
  const total=twk+tiu+tkp;
  return {twk,tiu,tkp,total,correctCount};
}

function finishQuiz(auto=false){
  finished=true;
  if(timerId) clearInterval(timerId);
  const {twk,tiu,tkp,total,correctCount}=calcScore();
  const elapsed = (100*60 - timerSec);
  // show result screen
  showScreen('result');
  $('#scoreTWK').textContent=twk;
  $('#scoreTIU').textContent=tiu;
  $('#scoreTKP').textContent=tkp;
  $('#barTWK').style.width=(twk/150*100)+'%';
  $('#barTIU').style.width=(tiu/175*100)+'%';
  $('#barTKP').style.width=(tkp/225*100)+'%';
  $('#totalScore').textContent=total;
  $('#totalCorrect').textContent=correctCount+'/110';
  $('#totalTime').textContent=formatTime(elapsed);
  const passTWK=65, passTIU=80, passTKP=166, passTotal=311;
  $('#passTWK').textContent = twk>=passTWK ? '✅ Lulus TWK' : '❌ Belum ('+passTWK+')';
  $('#passTIU').textContent = tiu>=passTIU ? '✅ Lulus TIU' : '❌ Belum ('+passTIU+')';
  $('#passTKP').textContent = tkp>=passTKP ? '✅ Lulus TKP' : '❌ Belum ('+passTKP+')';
  const allPass = twk>=passTWK && tiu>=passTIU && tkp>=passTKP && total>=passTotal;
  $('#passOverall').textContent = allPass ? '🎉 SELAMAT — LULUS PASSING GRADE!' : '💪 BELUM LULUS — ulang lagi, kejar TWK 65 / TIU 80 / TKP 166';
  $('#passOverall').style.color = allPass ? '#06D6A0' : '#EF476F';
  $('#resultSummary').textContent = (auto?'Waktu habis — ':'') + 'Skor dihitung 5 poin/benar (TKP salah tetap 1-3 poin). Passing grade acuan SKD 2024.';
  saveState();
  renderReview();
}

function renderReview(){
  const list=$('#reviewList');
  list.innerHTML='';
  QUESTIONS.forEach((q,i)=>{
    const ans=answers[i];
    const letters=['A','B','C','D'];
    const ok = ans===q.correct;
    // TKP: ok = ans===correct (5 poin), else tetap dianggap belum sempurna
    const status = ans===null ? '⬜ Belum dijawab' : (ok ? '✅ Benar' : '❌ Salah');
    const div=document.createElement('div');
    div.className='review';
    const ansText = ans===null ? '-' : letters[ans]+'. '+q.choices[ans];
    const correctText = letters[q.correct]+'. '+q.choices[q.correct];
    div.innerHTML='<h4>'+(i+1)+'. ['+q.cat+'] '+status+'</h4>'
      +'<div style="font-size:13px;margin-top:4px"><b>Soal:</b> '+q.prompt+'</div>'
      +'<div style="font-size:12px;margin-top:4px"><b>Jawabanmu:</b> '+ansText+'</div>'
      +'<div style="font-size:12px"><b>Kunci:</b> '+correctText+'</div>'
      +'<div class="exp"><b>Pembahasan:</b> '+q.explanation+'</div>';
    // color hint
    div.style.borderColor = ans===null ? '#B0BEC5' : (ok ? '#06D6A0' : '#EF476F');
    list.appendChild(div);
  });
}

function resetQuiz(){
  buildBank();
  answers=Array(QUESTIONS.length).fill(null);
  doubts=Array(QUESTIONS.length).fill(false);
  cur=0; timerSec=100*60; finished=false; startSec=Date.now();
  clearState(); saveState();
  renderGrid();
}

// events
$('#btnStart').onclick=async()=>{
  if(QUESTIONS_ALL.length===0) await loadQuestions();
  resetQuiz();
  showScreen('quiz');
  renderQuestion();
  startTimer();
};
$('#btnContinue').onclick=()=>{
  const s=loadState();
  if(!s) return;
  answers=s.answers; doubts=s.doubts; cur=s.cur; timerSec=s.timerSec; finished=s.finished;
  showScreen('quiz');
  renderGrid();
  renderQuestion();
  if(!finished) startTimer();
  else finishQuiz(false);
};
$('#btnPrev').onclick=()=>{ if(cur>0){cur--; saveState(); renderQuestion();} };
$('#btnNext').onclick=()=>{
  if(cur<QUESTIONS.length-1){ cur++; saveState(); renderQuestion(); }
  else { if(confirm('Kumpulkan jawaban dan lihat hasil?')) finishQuiz(false); }
};
$('#btnClear').onclick=()=>{ answers[cur]=null; doubts[cur]=false; saveState(); renderQuestion(); renderGrid(); };
$('#btnSubmit').onclick=()=>{
  const unanswered = answers.filter(a=>a===null).length;
  const msg = unanswered>0 ? 'Masih '+unanswered+' belum dijawab. Tetap kumpulkan?' : 'Kumpulkan jawaban sekarang?';
  if(confirm(msg)) finishQuiz(false);
};
$('#btnGrid').onclick=()=>{ gridPanel.style.display = gridPanel.style.display==='none'?'block':'none'; };
$('#chkDoubt').onchange=(e)=>{ doubts[cur]=e.target.checked; saveState(); renderGrid(); };
$('#btnRetry').onclick=()=>{ resetQuiz(); showScreen('quiz'); renderQuestion(); startTimer(); };
$('#btnHome').onclick=()=>{ showScreen('home'); if(timerId) clearInterval(timerId); };
$('#btnReview').onclick=()=>{ document.getElementById('reviewList').scrollIntoView({behavior:'smooth'}); };

// init
(async()=>{
  await loadQuestions();
  const s=loadState();
  if(s && !s.finished && s.timerSec>0){
    $('#btnContinue').style.display='block';
    $('#btnContinue').textContent='↻ LANJUTKAN ('+(s.answers.filter(a=>a!==null).length)+'/110)';
  }
  // if finished, allow continue to result
  if(s && s.finished){
    $('#btnContinue').style.display='block';
    $('#btnContinue').textContent='↻ LIHAT HASIL TERAKHIR';
  }
})();
