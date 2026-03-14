// app.js
export class Season3App {
  constructor(data) {
    this.data = data;
    this.simState = { operators: [], banned: [] };
  }

  clearSim() {
    this.simState.operators = [];
    this.simState.banned = [];
  }

  toggleSelectOperator(opId, max = 10) {
    const list = this.simState.operators;
    const idx = list.indexOf(opId);
    if (idx !== -1) {
      list.splice(idx, 1);
    } else if (list.length < max) {
      list.push(opId);
    }
    return true;
  }

  toggleBanOperator(opId) {
    const b = this.simState.banned;
    if (b.includes(opId)) {
      this.simState.banned = b.filter(id => id !== opId);
    } else {
      this.simState.banned.push(opId);
    }
    // 선택 해제
    this.simState.operators = this.simState.operators.filter(id => id !== opId);
  }

  getActiveOathsMap() {
    const map = new Map();
    this.simState.operators.forEach(id => {
      const op = this.data.operators.find(o => o.id === id);
      if (op) {
        op.oaths.forEach(name => {
          map.set(name, (map.get(name) || 0) + 1);
        });
      }
    });
    return map;
  }
}
