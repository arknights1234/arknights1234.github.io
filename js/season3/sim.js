// sim.js
export function initSim(app) {
  document.getElementById('sim-clear').addEventListener('click', () => {
    app.clearSim();
    updateSimInfo(app);
    renderSim(app);
  });
  renderSim(app);
  updateSimInfo(app);
}

export function renderSim(app) {
  if (!app) return;
  const simOaths = document.getElementById('sim-oaths');
  const simOpsContainer = document.getElementById('sim-operators');
  simOaths.innerHTML = '';
  simOpsContainer.innerHTML = '';

  // Oath별 operator 표시
  const oathsSet = new Set(app.data.oaths.map(o => o.name));
  oathsSet.forEach(oathName => {
    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    div.innerHTML = `<h4>${oathName}</h4>`;
    app.data.operators.filter(op => op.oaths.includes(oathName)).forEach(op => {
      const img = document.createElement('img');
      img.src = op.img;
      img.alt = op.name;
      img.title = op.name;
      img.style.marginRight = '6px';
      const isBanned = app.simState.banned.includes(op.id);
      const isSelected = app.simState.operators.includes(op.id);
      img.style.border = isBanned ? '2px solid red' : isSelected ? '2px solid green' : '2px solid transparent';
      img.style.opacity = isBanned ? '0.4' : '1';
      img.className = (isBanned ? 'banned ' : '') + (isSelected ? 'selected' : '');
      img.addEventListener('click', () => {
        if (isBanned) return;
        const idx = app.simState.operators.indexOf(op.id);
        if (idx !== -1) {
          app.simState.operators.splice(idx, 1);
        } else if (app.simState.operators.length < 10) {
          app.simState.operators.push(op.id);
        }
        updateSimInfo(app);
        renderSim(app);
      });
      img.addEventListener('contextmenu', e => {
        e.preventDefault();
        app.toggleBanOperator(op.id);
        updateSimInfo(app);
        renderSim(app);
      });
      div.appendChild(img);
    });
    simOaths.appendChild(div);
  });

  // 선택된 operators
  [...new Set(app.simState.operators)].forEach(opId => {
    const op = app.data.operators.find(o => o.id === opId);
    if (op) {
      const img = document.createElement('img');
      img.src = op.img;
      img.alt = op.name;
      img.title = op.name;
      img.className = 'selected';
      img.addEventListener('click', () => {
        app.simState.operators = app.simState.operators.filter(id => id !== opId);
        updateSimInfo(app);
        renderSim(app);
      });
      simOpsContainer.appendChild(img);
    }
  });
}

export function updateSimInfo(app) {
  if (!app) return;
  document.getElementById('sim-selected-count').textContent = app.simState.operators.length;
  renderSimOathStatus(app);
}

export function renderSimOathStatus(app) {
  if (!app) return;
  const container = document.getElementById('sim-oath-status');
  container.innerHTML = '';
  const activeOathsMap = app.getActiveOathsMap();
  const displayedOaths = app.data.oaths.filter(oath => activeOathsMap.has(oath.name));
  // 정렬 로직 생략
  displayedOaths.forEach(oath => {
    const count = activeOathsMap.get(oath.name) || 0;
    const isActive = count >= oath.needCount;
    const card = document.createElement('div');
    card.style.cssText = `
      display: flex; flex-direction: column; align-items: center; 
      font-size: 14px; color: ${isActive ? 'blue' : '#555'};
      ${isActive ? 'font-weight: bold;' : ''}
    `;
    const img = document.createElement('img');
    img.src = oath.img;
    img.style.cssText = 'width: 40px; height: 40px; margin-bottom: 4px;';
    const span = document.createElement('span');
    span.textContent = `${count}/${oath.needCount}`;
    card.appendChild(img);
    card.appendChild(span);
    container.appendChild(card);
  });
  container.style.cssText = 'display: flex; gap: 15px; flex-wrap: wrap; margin-top: 10px;';
}
