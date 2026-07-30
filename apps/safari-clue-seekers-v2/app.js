(() => {
  'use strict';
  const animals = [
    {id:'lion',name:'Lion',emoji:'🦁',clue:'I live in a social group called a pride and adult males often have a mane.',fact:'Lions are the only cats that live in social groups called prides.'},
    {id:'giraffe',name:'Giraffe',emoji:'🦒',clue:'My very long neck helps me reach leaves high in trees.',fact:'Giraffes are the tallest living land animals.'},
    {id:'zebra',name:'Zebra',emoji:'🦓',clue:'My coat has a stripe pattern that is unique to me.',fact:'A zebra’s stripe pattern is unique, much like a fingerprint.'},
    {id:'elephant',name:'Elephant',emoji:'🐘',clue:'I am a very large land animal and use a trunk to breathe, smell, and pick things up.',fact:'An elephant’s trunk is a powerful, flexible tool used for breathing, smelling, and grasping.'},
    {id:'cheetah',name:'Cheetah',emoji:'🐆',clue:'I am built for short, very fast sprints across open ground.',fact:'Cheetahs are the fastest land animals over short distances.'},
    {id:'hippo',name:'Hippo',emoji:'🦛',clue:'I spend much of the day in water and come out to feed on land.',fact:'Hippos spend much of the day in water and are strong swimmers.'},
    {id:'flamingo',name:'Flamingo',emoji:'🦩',clue:'I am a wading bird that often stands on one leg.',fact:'A flamingo’s pink color comes from pigments in the foods it eats.'},
    {id:'rhino',name:'Rhinoceros',emoji:'🦏',clue:'I have thick skin and one or two horns on my nose.',fact:'Rhinoceroses rely strongly on hearing and smell.'},
    {id:'antelope',name:'Antelope',emoji:'🦌',clue:'I am a hoofed herbivore; many of my relatives live and travel in herds.',fact:'“Antelope” describes many different hoofed mammals, including several savanna species.'},
    {id:'ostrich',name:'Ostrich',emoji:'🪶',clue:'I am a large flightless bird that can run very quickly.',fact:'Ostriches are the largest living birds and cannot fly.'},
    {id:'hyena',name:'Hyena',emoji:'🐕',clue:'My family group is called a clan, and I have a very powerful bite.',fact:'Spotted hyenas are skilled hunters as well as scavengers.'},
    {id:'wildebeest',name:'Wildebeest',emoji:'🐂',clue:'I travel in large herds, and some of my herds migrate across East Africa.',fact:'Wildebeest migrations involve very large herds traveling in search of grass and water.'},
    {id:'secretary-bird',name:'Secretary Bird',emoji:'🦅',clue:'I am a tall bird of prey that hunts on the ground with strong legs.',fact:'Secretary birds are known for hunting on foot across grasslands.'},
    {id:'meerkat',name:'Meerkat',emoji:'🦦',clue:'I live in a group and may stand upright to look out for danger.',fact:'Meerkats take turns watching for danger while other group members forage.'},
    {id:'warthog',name:'Warthog',emoji:'🐗',clue:'I am a wild pig with curved tusks and I often use burrows for shelter.',fact:'Warthogs are wild pigs that often shelter in burrows.'}
  ];
  const KEY='safariClueSeekers.v2';
  const $=id=>document.getElementById(id);
  const elements={grid:$('animalGrid'),clue:$('clueText'),status:$('status'),score:$('score'),found:$('found'),best:$('bestScore'),fill:$('progressFill'),newGame:$('newGame'),next:$('nextClue'),reset:$('resetProgress'),fact:$('factDialog'),factTitle:$('factTitle'),factText:$('factText'),factResult:$('factResult')};
  const defaults={best:0,level:'easy',score:0,found:[],current:null,active:false,choices:[]};
  let state=load();
  function load(){try{const saved=JSON.parse(localStorage.getItem(KEY));return {...defaults,...saved,found:Array.isArray(saved?.found)?saved.found:[]};}catch{return {...defaults};}}
  function save(){localStorage.setItem(KEY,JSON.stringify({best:state.best,level:state.level,score:state.score,found:state.found,current:state.current,active:state.active,choices:state.choices}));}
  function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
  function choiceCount(){return state.level==='easy'?3:state.level==='medium'?6:animals.length;}
  function currentAnimal(){return animals.find(a=>a.id===state.current);}
  function remaining(){return animals.filter(a=>!state.found.includes(a.id));}
  function startNew(){state.score=0;state.found=[];state.active=true;nextRound();elements.status.textContent='New safari started. Choose the animal that matches the clue.';save();render();}
  function nextRound(){const pool=remaining();if(pool.length===0){finish();return;}const target=pool[Math.floor(Math.random()*pool.length)];const distractors=shuffle(animals.filter(a=>a.id!==target.id)).slice(0,choiceCount()-1);state.current=target.id;state.choices=shuffle([target,...distractors]).map(a=>a.id);}
  function finish(){state.active=false;state.current=null;state.choices=[];state.best=Math.max(state.best,state.score);save();elements.status.textContent=`Safari complete! You found all ${animals.length} animals and earned ${state.score} points.`;}
  function select(id){if(!state.active||!state.current)return;const target=currentAnimal();if(id===target.id){const points=state.level==='easy'?10:state.level==='medium'?15:20;state.found.push(id);state.score+=points;state.best=Math.max(state.best,state.score);state.active=false;openFact('Correct!',target,`${target.fact} You earned ${points} points.`);elements.status.textContent=`Correct—${target.name} found. Continue when you are ready.`;save();render();}else{elements.status.textContent='Not quite. Read the clue again and try another animal.';const button=elements.grid.querySelector(`[data-animal="${CSS.escape(id)}"]`);if(button){button.classList.add('incorrect');button.disabled=true;}}}
  function continueRound(){if(elements.fact.open)elements.fact.close();if(state.found.length===animals.length){finish();}else{state.active=true;nextRound();elements.status.textContent='Here is your next clue.';save();render();}}
  function openFact(result,animal,text){elements.factResult.textContent=result;elements.factTitle.textContent=`${animal.emoji} ${animal.name}`;elements.factText.textContent=text;elements.fact.showModal();}
  function render(){document.querySelectorAll('.difficulty').forEach(button=>{const chosen=button.dataset.level===state.level;button.classList.toggle('selected',chosen);button.setAttribute('aria-checked',String(chosen));});elements.score.textContent=String(state.score);elements.found.textContent=`${state.found.length} / ${animals.length}`;elements.best.textContent=String(state.best);elements.fill.style.width=`${(state.found.length/animals.length)*100}%`;elements.next.disabled=!state.active;elements.grid.replaceChildren();if(!state.active&&!state.current){elements.clue.textContent=state.found.length===animals.length?'You completed this safari. Start another anytime.':'Press “Start a new safari” to begin.';return;}const target=currentAnimal();elements.clue.textContent=target?.clue||'Choose the next clue.';state.choices.map(id=>animals.find(a=>a.id===id)).filter(Boolean).forEach(animal=>{const b=document.createElement('button');b.type='button';b.className='animal';b.dataset.animal=animal.id;b.setAttribute('aria-label',`Choose ${animal.name}`);b.innerHTML=`<span class="emoji" aria-hidden="true">${animal.emoji}</span><span class="label">${animal.name}</span>`;b.addEventListener('click',()=>select(animal.id));elements.grid.appendChild(b);});}
  elements.newGame.addEventListener('click',startNew);elements.next.addEventListener('click',()=>{if(state.active)nextRound();save();render();});elements.reset.addEventListener('click',()=>{if(confirm('Clear the saved score and progress from this browser?')){localStorage.removeItem(KEY);state={...defaults};elements.status.textContent='Saved progress was cleared from this browser.';render();}});
  document.querySelectorAll('.difficulty').forEach(button=>button.addEventListener('click',()=>{state.level=button.dataset.level;save();render();}));
  $('howToPlay').addEventListener('click',()=>$('infoDialog').showModal());
  document.querySelectorAll('.close-dialog').forEach(button=>button.addEventListener('click',()=>{const dialog=button.closest('dialog');if(dialog===elements.fact&&state.current)continueRound();else dialog.close();}));
  $('infoDialog').addEventListener('click',event=>{if(event.target===$('infoDialog'))$('infoDialog').close();});
  // A completed answer must continue through the explicit button so progress cannot become stranded.
  elements.fact.addEventListener('cancel',event=>event.preventDefault());
  elements.fact.addEventListener('click',event=>{if(event.target===elements.fact)event.preventDefault();});
  render();
})();
