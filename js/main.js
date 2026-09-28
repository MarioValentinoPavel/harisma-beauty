/* Harisma Beauty — cilindro de esferas 3D (endosfera) y web ES / РУС */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- cilindro de esferas ---------- */
(function spheres() {
  if (!window.THREE) return;
  const cv = $('#spheres');
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 100); cam.position.set(0, 0, 14);
  scene.add(new THREE.HemisphereLight(0xfff0e0, 0x2a1508, .8));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 8); scene.add(key);
  const rim = new THREE.PointLight(0xffa25a, 1.6, 30); rim.position.set(-6, -3, 4); scene.add(rim);
  const ROWS = 11, COLS = 14, R = 1.55, LEN = 7.2, r = .42;
  const count = ROWS * COLS;
  const geo = new THREE.SphereGeometry(r, 28, 20);
  const mat = new THREE.MeshStandardMaterial({ roughness: .22, metalness: .15 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const group = new THREE.Group(); group.add(mesh); scene.add(group);
  const targets = [], starts = [];
  const cA = new THREE.Color(0xd4692a), cB = new THREE.Color(0x1d1a18), cC = new THREE.Color(0xf0a45a);
  let k = 0;
  for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) {
    const a = (j + (i % 2) * .5) / COLS * Math.PI * 2;
    targets.push(new THREE.Vector3(-LEN / 2 + i / (ROWS - 1) * LEN, Math.cos(a) * R, Math.sin(a) * R));
    starts.push(new THREE.Vector3((Math.random() - .5) * 30, (Math.random() - .5) * 20, (Math.random() - .5) * 10 - 4));
    mesh.setColorAt(k++, (i + j) % 5 === 0 ? cC : (i % 2 ? cB : cA));
  }
  mesh.instanceColor.needsUpdate = true;
  const dummy = new THREE.Object3D(), st = { p: 0 };
  gsap.to(st, { p: 1, duration: 2.6, ease: 'expo.out', delay: .2 });
  function size() {
    const w = cv.clientWidth, h = cv.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const wide = w > 860;
    group.position.set(wide ? 3.3 : 0, wide ? -.2 : 1.5, 0);
    group.scale.setScalar(wide ? .74 : .44);
  }
  size(); addEventListener('resize', size);
  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; });
  let vis = true; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(cv);
  gsap.ticker.add(t => {
    if (!vis) return;
    for (let i = 0; i < count; i++) {
      dummy.position.lerpVectors(starts[i], targets[i], st.p);
      dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.x = t * .55; // rueda como el rodillo
    group.rotation.z = -.35 + mouse.x * .4;
    group.rotation.y = -.5 + mouse.x * .6;
    group.rotation.x = .25 + mouse.y * .3;
    renderer.render(scene, cam);
  });
})();

/* ---------- idiomas ---------- */
const RU = {
  book: 'Записаться', k1: 'Студия красоты · Бланес', lead: 'Сферы, которые катятся, дренируют и моделируют. Эндосфера, массаж и красота в руках Марины.',
  cta1: 'Что такое эндосфера', k2: 'Звезда нашего салона', h2a: 'Что такое эндосфера?',
  p2: 'Цилиндр со сферами, который благодаря компрессионной микровибрации прорабатывает ткани в глубину: активирует кровообращение, выводит лишнюю жидкость и тонизирует. И, конечно, прекрасно расслабляет.',
  q1: '«Массаж с эндосферой — это что-то невероятное. Марина — просто прелесть, очень добрая. Рекомендую на 100%.»',
  b1: 'Дренаж', b2: 'Целлюлит', b3: 'Тонус', b4: 'Релакс', k3: 'Услуги', h2b: 'Всё вращается вокруг тебя',
  s1: 'Эндосфера', s1t: 'Тело и лицо', s2: 'Массаж', s2t: 'Расслабляющий и лечебный', s3: 'Эпиляция', s3t: 'Быстро и бережно', s4: 'Маникюр', s4t: 'Руки и ноги', s5: 'Блонд', s5t: 'Окрашивание и укладка', s6: 'Косметология', s6t: 'Пилинги и уход за лицом',
  k4: 'А ещё — в кресле стилиста', h2c: 'Блонд с харизмой', q2: '«В Harisma Beauty всегда замечательный сервис и прекрасная атмосфера. Мастера — лучшие!»',
  k5: 'Ждём вас', d1: 'Понедельник', d2: 'Вторник – пятница', d3: 'Суббота', d4: 'Воскресенье', closed: 'Выходной', langs: 'Говорим по-испански и по-русски.', map: 'Как добраться'
};
const ES = {};
$$('[data-i]').forEach(n => { ES[n.dataset.i] = n.innerHTML; });
function setLang(l) {
  const D = l === 'ru' ? RU : ES;
  $$('[data-i]').forEach(n => { if (D[n.dataset.i]) n.innerHTML = D[n.dataset.i]; });
  document.documentElement.lang = l;
  $$('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.l === l));
  try { localStorage.setItem('hb-lang', l); } catch (e) {}
}
$$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
let saved = null; try { saved = localStorage.getItem('hb-lang'); } catch (e) {}
if (saved === 'ru' || (!saved && (navigator.language || '').startsWith('ru'))) setLang('ru');

/* ---------- nav clara fuera del hero ---------- */
ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70px', onEnter: () => $('.nav').classList.add('is-light'), onLeaveBack: () => $('.nav').classList.remove('is-light') });

/* ---------- apariciones ---------- */
gsap.from('.hero__txt > *', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, delay: .8 });
$$('.endo__txt, .benefits li, .head, .blonde__row img, .rev, .visit > *').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 90%' } }));
gsap.from('.ball', { scale: 0, rotation: -180, duration: 1.2, ease: 'back.out(1.6)', stagger: .08, scrollTrigger: { trigger: '.balls', start: 'top 85%' } });
