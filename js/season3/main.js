// main.js
import { data } from './data.js';
import { Season3App } from './app.js';
import * as UI from './ui.js';
import * as Sim from './sim.js';

function init() {
  UI.initTabs();
  const app = new Season3App(data);
  UI.bindApp(app);

  UI.renderAbilities(app);
  UI.renderOaths(app);

  // 필터 버튼 완전 생성
  const coreOaths = app.data.oaths.filter(o => o.type === 'core').map(o => o.name);
  const supportOaths = app.data.oaths.filter(o => o.type === 'support').map(o => o.name);
  const stages = [1,2,3,4,5,6].map(s => s.toString());
  const traits = [...new Set(app.data.operators.map(op => op.trait))];

  UI.createToggleButtons('core-oath-filters', coreOaths);
  UI.createToggleButtons('support-oath-filters', supportOaths);
  UI.createToggleButtons('stage-filters', stages);
  UI.createToggleButtons('trait-filters', traits);

  UI.deselectAllFilters();

  document.getElementById('deselect-all').addEventListener('click', () => {
    UI.deselectAllFilters();
    UI.renderOperators(app);
  });

  UI.renderOperators(app);
  UI.renderTools(app);
  Sim.initSim(app);
  UI.initComboPreview();
}

document.addEventListener('DOMContentLoaded', init);
