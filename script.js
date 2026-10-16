'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navMenu=document.querySelector('#nav-menu');
function closeMenu(){navMenu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','打开导航菜单');}
menuButton.addEventListener('click',()=>{const open=navMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'关闭导航菜单':'打开导航菜单');});
navMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!event.target.closest('.navigation'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});

const particles=document.querySelector('.particles');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const atmosphereButton=document.querySelector('.atmosphere-button');
let particlesEnabled=!reduceMotion.matches;
for(let i=0;i<30;i++){const flake=document.createElement('span');flake.className='snowflake';flake.style.left=`${Math.random()*100}%`;flake.style.animationDuration=`${9+Math.random()*13}s`;flake.style.animationDelay=`${-Math.random()*22}s`;particles.append(flake);}
function updateParticles(){particles.hidden=!particlesEnabled;atmosphereButton.setAttribute('aria-pressed',String(particlesEnabled));atmosphereButton.setAttribute('aria-label',particlesEnabled?'关闭粒子效果':'开启粒子效果');}
atmosphereButton.addEventListener('click',()=>{particlesEnabled=!particlesEnabled;updateParticles();});
reduceMotion.addEventListener('change',event=>{if(event.matches){particlesEnabled=false;updateParticles();}});
updateParticles();

const hero=document.querySelector('.hero');
const heroTrack=document.querySelector('.hero-track');
const heroSlides=[...heroTrack.querySelectorAll('.hero-image')];
const heroDots=[...document.querySelectorAll('[data-hero-slide]')];
const heroPrevious=document.querySelector('.hero-previous');
const heroNext=document.querySelector('.hero-next');
const heroPlay=document.querySelector('.hero-play-toggle');
const HERO_INTERVAL=6000;
let heroIndex=0,heroPosition=1,heroAnimating=false,heroPlaying=!reduceMotion.matches,heroHovered=false,heroFocused=false,heroExplicitPlay=false,heroVisible=true,heroTimer=null,heroTransitionTimer=null;
function edgeClone(image){const clone=image.cloneNode(true);clone.dataset.heroClone='true';clone.removeAttribute('fetchpriority');return clone;}
heroTrack.prepend(edgeClone(heroSlides[heroSlides.length-1]));
heroTrack.append(edgeClone(heroSlides[0]));
heroTrack.style.transform='translateX(-100%)';
void heroTrack.offsetWidth;
heroTrack.classList.add('is-ready');
[heroPrevious,heroNext,document.querySelector('.hero-carousel-controls')].forEach(c=>{c.hidden=false;});
function updateHeroControls(){
  heroSlides.forEach((image,index)=>image.setAttribute('aria-hidden',String(index!==heroIndex)));
  heroDots.forEach((dot,index)=>{dot.setAttribute('aria-pressed',String(index===heroIndex));dot.setAttribute('aria-disabled',String(heroAnimating));});
  heroPrevious.setAttribute('aria-disabled',String(heroAnimating));
  heroNext.setAttribute('aria-disabled',String(heroAnimating));
  document.querySelector('.hero-slide-count').textContent=`${String(heroIndex+1).padStart(2,'0')} / ${String(heroSlides.length).padStart(2,'0')}`;
  heroPlay.setAttribute('aria-label',heroPlaying?'暂停自动轮播':'开启自动轮播');
  heroPlay.setAttribute('aria-pressed',String(!heroPlaying));
  heroPlay.querySelector('span').textContent=heroPlaying?'Ⅱ':'▷';
}
function scheduleHero(){clearTimeout(heroTimer);heroTimer=null;if(!heroPlaying||heroAnimating||document.hidden||!heroVisible||((heroHovered||heroFocused)&&!heroExplicitPlay))return;heroTimer=setTimeout(()=>moveHero(1,false),HERO_INTERVAL);}
function finishHeroTransition(){if(!heroAnimating)return;clearTimeout(heroTransitionTimer);if(heroPosition===0||heroPosition===heroSlides.length+1){heroPosition=heroPosition===0?heroSlides.length:1;heroTrack.classList.remove('is-ready');heroTrack.style.transform=`translateX(-${heroPosition*100}%)`;void heroTrack.offsetWidth;heroTrack.classList.add('is-ready');}heroAnimating=false;updateHeroControls();scheduleHero();}
function showHero(index,position,manual){if(heroAnimating||index===heroIndex)return;clearTimeout(heroTimer);heroIndex=index;heroPosition=position;heroAnimating=true;if(manual){heroExplicitPlay=false;document.querySelector('#hero-slide-status').textContent=`第 ${heroIndex+1} 张，共 ${heroSlides.length} 张。${heroSlides[heroIndex].dataset.label||''}`;}updateHeroControls();heroTrack.style.transform=`translateX(-${heroPosition*100}%)`;if(reduceMotion.matches)finishHeroTransition();else heroTransitionTimer=setTimeout(finishHeroTransition,950);}
function moveHero(direction,manual=true){showHero((heroIndex+direction+heroSlides.length)%heroSlides.length,heroPosition+direction,manual);}
heroTrack.addEventListener('transitionend',event=>{if(event.target===heroTrack&&event.propertyName==='transform')finishHeroTransition();});
heroPrevious.addEventListener('click',()=>moveHero(-1));
heroNext.addEventListener('click',()=>moveHero(1));
heroDots.forEach(dot=>dot.addEventListener('click',()=>{const index=Number(dot.dataset.heroSlide);let position=index+1;if(heroIndex===heroSlides.length-1&&index===0)position=heroSlides.length+1;if(heroIndex===0&&index===heroSlides.length-1)position=0;showHero(index,position,true);}));
heroPlay.addEventListener('click',()=>{heroPlaying=!heroPlaying;heroExplicitPlay=heroPlaying;updateHeroControls();scheduleHero();});
hero.addEventListener('mouseenter',()=>{heroHovered=true;heroExplicitPlay=false;scheduleHero();});
hero.addEventListener('mouseleave',()=>{heroHovered=false;scheduleHero();});
hero.addEventListener('focusin',()=>{heroFocused=true;scheduleHero();});
hero.addEventListener('focusout',()=>{queueMicrotask(()=>{heroFocused=hero.contains(document.activeElement);if(!heroFocused)heroExplicitPlay=false;scheduleHero();});});
hero.addEventListener('keydown',event=>{if(event.target.closest('.hero-carousel-controls, .hero-arrow')&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();moveHero(event.key==='ArrowLeft'?-1:1);}});
document.addEventListener('visibilitychange',scheduleHero);
reduceMotion.addEventListener('change',event=>{if(event.matches){heroPlaying=false;finishHeroTransition();updateHeroControls();scheduleHero();}});
if('IntersectionObserver'in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;scheduleHero();},{threshold:0.1}).observe(hero);}
updateHeroControls();scheduleHero();

const abilities={"passive": {"label": "被动 · PASSIVE", "name": "烟火四射！", "text": "佐伊在施放一次技能后的下次普攻会造成额外魔法伤害。"}, "q": {"label": "Q · 秘术", "name": "飞星乱入！", "text": "佐伊发射一个可在飞行途中由她重新导向的飞弹。飞弹在直线上飞行的路程越远，造成的伤害就会越高。"}, "w": {"label": "W · 秘术", "name": "窃法巧手", "text": "佐伊可以拾取敌方在施放召唤师技能和主动型装备时产生的法术碎片，从而让她自己能够施放一次性的相应技能或效果。在她施放一次召唤师技能的同时，她会获得3颗飞弹来射向距她最近的目标。"}, "e": {"label": "E · 秘术", "name": "催眠气泡", "text": "困倦使目标进入困倦状态，然后陷入昏睡。在昏睡状态下，目标的魔抗会被降低。打醒目标的第一个伤害来源会造成双倍伤害，但有封顶值。"}, "r": {"label": "R · 终极秘法", "name": "折返跃迁", "text": "闪烁到附近的一个位置1秒。然后闪烁回去。"}};
const abilityTabs=[...document.querySelectorAll('[data-ability]')];
function activateAbility(tab,focus=false){abilityTabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});const data=abilities[tab.dataset.ability];document.querySelector('#ability-label').textContent=data.label;document.querySelector('#ability-name').textContent=data.name;document.querySelector('#ability-description').textContent=data.text;document.querySelector('#ability-content').setAttribute('aria-labelledby',tab.id);if(focus)tab.focus();}
abilityTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateAbility(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%abilityTabs.length;if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+abilityTabs.length)%abilityTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=abilityTabs.length-1;if(next!==undefined){event.preventDefault();activateAbility(abilityTabs[next],true);}});});

const galleryItems=[...document.querySelectorAll('.gallery-item')];
const filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(filter=>filter.addEventListener('click',()=>{filters.forEach(item=>{const selected=item===filter;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));});galleryItems.forEach(item=>{item.hidden=filter.dataset.filter!=='all'&&item.dataset.category!==filter.dataset.filter;});}));

const galleryDialog=document.querySelector('#gallery-dialog');
const lightboxImage=document.querySelector('#lightbox-image');
let visibleScenes=[],sceneIndex=0,previousFocus=null;
function openDialog(dialog){previousFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}
function renderScene(){const scene=visibleScenes[sceneIndex];const title=scene.querySelector('strong').textContent;lightboxImage.className=`lightbox-image scene-${scene.dataset.scene}`;lightboxImage.setAttribute('aria-label',title);document.querySelector('#lightbox-title').textContent=title;document.querySelector('#lightbox-counter').textContent=`${String(sceneIndex+1).padStart(2,'0')} / ${String(visibleScenes.length).padStart(2,'0')}`;}
function moveScene(amount){sceneIndex=(sceneIndex+amount+visibleScenes.length)%visibleScenes.length;renderScene();}
galleryItems.forEach(item=>item.addEventListener('click',()=>{visibleScenes=galleryItems.filter(scene=>!scene.hidden);sceneIndex=visibleScenes.indexOf(item);renderScene();openDialog(galleryDialog);}));
document.querySelector('#gallery-prev').addEventListener('click',()=>moveScene(-1));
document.querySelector('#gallery-next').addEventListener('click',()=>moveScene(1));
galleryDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();moveScene(-1);}if(event.key==='ArrowRight'){event.preventDefault();moveScene(1);}});

const articles=[{"title": "如果粉色的星屑也有声音", "scene": 1, "paragraphs": ["当星界边缘的梦境云端的梦境时分完全沉下来，星尘的闪烁才显出另一种轮廓。白日的锋利被夜色揉软，只有一道光，在云朵上上方舒展开来。", "我试着听它。风掠过星尘的闪烁，远处有什么轻轻踏过梦的边界。星尘本身并不言语，却把这些都收进了夜色。", "一只星尘停在我身旁。它的轮廓几乎透明，像染上了粉色的星屑。我没有问它从何而来，只往旁边挪了挪，让它也能看见天。", "那一晚，我们待了很久。星尘的闪烁一遍遍流转，而云朵上并不催促谁赶路。", "手记 / 这是一篇受佐伊与星界边缘的梦境云端视觉意象启发的同人随笔。"]}, {"title": "和星尘做朋友", "scene": 3, "paragraphs": ["第一条经验是，不要着急。你向前走一步，它就可能退后两步；你静静坐下来，它反而会想知道，你为什么忽然不走了。", "它像光，又比光更有自己的脾气。有一只喜欢绕着星尘的闪烁跑，另一只总是在我打算出发时，把自己团成一小团。我分不清那是不是休息，但我决定尊重它的安排。", "我没有准备什么宏大的见面仪式。只是把梦的边界上的脚步放轻，给那一点点粉色的星屑留出位置。有时，我会讲讲今天看见的东西。", "它未必明白每个字。不过，当一双耳朵向你转过来，你就知道，有什么正在认真听。", "手记 / 星尘与相遇情节为同人创作，非官方角色剧情。"]}, {"title": "晨星尽头，有一盏灯", "scene": 6, "paragraphs": ["从夜色里看见那扇窗的时候，我先闻到了暖意的气味。光是温柔的琥珀色，把窗沿积着的霜照得像糖。门前只有几枚脚印，旁边还有几行更小的。", "屋子里没有什么了不起的宝物。一张桌子，一把有些旧的椅子，炉火边放着一只水壶。却正好够我把斗篷晾开，把星尘的闪烁摊在桌上，让赶了一天路的手指慢慢暖起来。", "窗外，星界边缘的梦境云端依旧流动。风把梦的边界上的碎屑吹过来，又吹走。炉火噼啪响了一声，我抬起头，看见一只小小的星尘在门边试探着探出影子。", "于是我又添了一把柴，把另一把椅子向炉火挪了挪。明天的路还很长，但今晚，先留在这里吧。", "手记 / 旅途片段为本站的幻想随笔，非官方角色剧情。"]}];
const articleDialog=document.querySelector('#article-dialog');
document.querySelectorAll('[data-article]').forEach(button=>button.addEventListener('click',()=>{const article=articles[Number(button.dataset.article)];document.querySelector('#article-title').textContent=article.title;document.querySelector('#article-cover').className=`article-cover scene-${article.scene}`;const content=document.querySelector('#article-content');content.replaceChildren(...article.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));openDialog(articleDialog);articleDialog.scrollTop=0;}));
[galleryDialog,articleDialog].forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(previousFocus)previousFocus.focus({preventScroll:true});});});

document.querySelector('#copyright-year').textContent=new Date().getFullYear();
const navLinks=[...navMenu.querySelectorAll('a')];
if('IntersectionObserver'in window){const sections=[document.querySelector('#home'),document.querySelector('#story-detail'),document.querySelector('#ability-detail'),document.querySelector('#gallery'),document.querySelector('#contact')];const targets=['#home','#story-detail','#ability-detail','#gallery','#contact'];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const target=targets[sections.indexOf(entry.target)];navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===target));}});},{rootMargin:'-15% 0px -55% 0px',threshold:0});sections.forEach(section=>observer.observe(section));}