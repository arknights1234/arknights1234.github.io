let appRef = null;

export function bindApp(app) {
  appRef = app;
}

export function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', evt => {
      const tabName = evt.target.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      evt.target.classList.add('active');
      document.querySelectorAll('main section').forEach(sec => {
        sec.classList.toggle('active', sec.id === tabName);
      });
    });
  });
}

export function renderAbilities(app) {
  if (!app) return;
  const container = document.getElementById('ability-list');
  container.innerHTML = '';
  app.data.abilities.forEach(a => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${a.img}" alt="${a.name}">
      <h3>${a.name}</h3>
      <p>${a.effect}</p>
      <p>HP: ${a.hp}</p>
    `;
    container.appendChild(card);
  });
}

export function renderOaths(app) {
  if (!app) return;
  const coreContainer = document.getElementById('core-oath-list');
  const supportContainer = document.getElementById('support-oath-list');
  coreContainer.innerHTML = '';
  supportContainer.innerHTML = '';
  app.data.oaths.forEach(oath => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${oath.img}" alt="${oath.name}">
      <h3>${oath.name}</h3>
      <p>${oath.effect}</p>
      <p>필요: ${oath.needCount}</p>
    `;
    if (oath.type === 'core') coreContainer.appendChild(card);
    else if (oath.type === 'support') supportContainer.appendChild(card);
  });
}

export function createToggleButtons(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const button = document.createElement('button');
    button.textContent = item;
    button.classList.add('active');
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      renderOperators(appRef);  // appRef는 bindApp에서 설정됨
    });
    container.appendChild(button);
  });
}

// 단계별 그리드 스타일 적용
function applyStageGrid(container) {
  Object.assign(container.style, {
    display: 'grid',
    'grid-template-columns': 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
    padding: '10px'
  });
}

export function renderOperators(app) {
  if (!app) return;
  
  // 필터 상태
  const coreOathFilter = Array.from(document.querySelectorAll('#core-oath-filters button.active')).map(b => b.textContent);
  const supportOathFilter = Array.from(document.querySelectorAll('#support-oath-filters button.active')).map(b => b.textContent);
  const stageFilter = Array.from(document.querySelectorAll('#stage-filters button.active')).map(b => b.textContent);
  const traitFilter = Array.from(document.querySelectorAll('#trait-filters button.active')).map(b => b.textContent);
  
  // 1. 전체 오퍼레이터 필터링 (모든 필터 적용)
  const filteredOperators = app.data.operators.filter(op => {
    const opOaths = Array.isArray(op.oaths) ? op.oaths : [op.oaths];
    
    // 맹약 필터
    if (coreOathFilter.length > 0 && !opOaths.some(oath => coreOathFilter.includes(oath))) return false;
    if (supportOathFilter.length > 0 && !opOaths.some(oath => supportOathFilter.includes(oath))) return false;
    
    // 특성 필터
    if (traitFilter.length > 0 && !op.trait.includes(traitFilter[0])) return false;
    
    // 단계 필터
    if (stageFilter.length > 0 && !stageFilter.includes(op.stage.toString())) return false;
    
    return true;
  });
  
  // 2. 단계별 그룹화
  const stagesMap = {};
  filteredOperators.forEach(op => {
    const stage = op.stage;
    if (!stagesMap[stage]) stagesMap[stage] = [];
    stagesMap[stage].push(op);
  });
  
  // 3. 모든 단계 컨테이너 업데이트
  for (let stage = 1; stage <= 6; stage++) {
    const container = document.getElementById(`operator-stage-${stage}`);
    const section = container?.closest('.stage-section');
    if (!container || !section) continue;
    
    const stageOps = stagesMap[stage] || [];
    
    if (stageOps.length === 0) {
      section.style.display = 'none';  // 빈 단계 완전 숨김
      continue;
    }
    
    container.innerHTML = '';
    applyStageGrid(container);
    
    stageOps.forEach(op => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${op.img}" alt="${op.name}">
        <h3>${op.name}</h3>
        <p>${op.oaths}</p>
        <p>${op.traitDescription}</p>
      `;
      container.appendChild(card);
    });
    
    section.style.display = '';  // 표시
  }
}


export function renderTools(app) {
  if (!app?.data.tools) return;
  
  for (let stage = 1; stage <= 6; stage++) {
    const container = document.getElementById(`tools-stage-${stage}`);
    const section = container?.closest('.stage-section');
    if (!container || !section) continue;
    
    container.innerHTML = '';
    applyStageGrid(container);
    
    const stageTools = app.data.tools.filter(tool => tool.stage === stage);
    stageTools.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${tool.img}" alt="${tool.name}">
        <h3>${tool.name}</h3>
        <p>${tool.effect}</p>
      `;
      container.appendChild(card);
    });
    
    section.classList.toggle('hidden', container.children.length === 0);
  }
}

export function deselectAllFilters() {
  document.querySelectorAll('.filter-toggle-group button').forEach(button => {
    button.classList.remove('active');
  });
  if (appRef) {
    renderOperators(appRef);
  }
}

// 조합법 이미지 클릭 이벤트
export function initComboPreview() {
  const comboPreview = document.getElementById('combo-preview');
  const comboLargeContainer = document.getElementById('combo-large-container');
  const comboLargeImg = document.getElementById('combo-large-img');
  
  comboPreview.addEventListener('click', () => {
    if (comboLargeContainer.style.display === 'block') {
      comboLargeContainer.style.display = 'none';
    } else {
      comboLargeImg.src = 'images/조합법2.png';  // 큰 이미지 경로
      comboLargeContainer.style.display = 'block';
    }
  });
}