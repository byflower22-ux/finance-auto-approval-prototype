(function organiseAuditReport() {
  const header = document.querySelector('table thead tr:first-child');
  const rows = [...document.querySelectorAll('#reportRows tr')];
  if (!header) return;

  const typeOptions = [{ value:'付款单', label:'付款申请' }, { value:'报销单', label:'报销申请' }];
  const headerFilterOptions = {
    单据类型: { type:typeOptions },
    AI审批建议: { suggestion:['建议通过','建议驳回','建议复核'] },
    AI反馈结果: { feedback:['判断准确','判断不准确','未反馈'] }
  };
  const headerText = (cell) => cell?.textContent.replace(/[⌄]/g, '').trim() || '';

  function createHeaderFilter(cell, key, options) {
    if (!cell || cell.querySelector('.header-filter-trigger')) return;
    cell.classList.add('has-header-filter');
    const label = headerText(cell);
    cell.textContent = '';
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'header-filter-trigger'; trigger.textContent = label;
    const menu = document.createElement('div');
    menu.className = 'header-filter-menu'; menu.hidden = true;
    options.forEach((option) => {
      const value = typeof option === 'string' ? option : option.value;
      const optionLabel = typeof option === 'string' ? option : option.label;
      const labelNode = document.createElement('label'); labelNode.className = 'header-filter-option';
      const input = document.createElement('input'); input.type = 'checkbox'; input.value = value;
      input.addEventListener('change', () => {
        const values = window.auditHeaderFilters[key];
        input.checked ? values.add(value) : values.delete(value);
        trigger.classList.toggle('active', values.size > 0); applyAuditFilters();
      });
      labelNode.append(input, document.createTextNode(optionLabel)); menu.appendChild(labelNode);
    });
    const actions = document.createElement('div'); actions.className = 'header-filter-actions';
    const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = '清空';
    clear.addEventListener('click', () => { window.auditHeaderFilters[key].clear(); menu.querySelectorAll('input').forEach((input) => { input.checked = false; }); trigger.classList.remove('active'); applyAuditFilters(); });
    const close = document.createElement('button'); close.type = 'button'; close.textContent = '完成'; close.addEventListener('click', () => { menu.hidden = true; });
    actions.append(clear, close); menu.appendChild(actions);
    trigger.addEventListener('click', (event) => { event.stopPropagation(); document.querySelectorAll('.header-filter-menu').forEach((other) => { if (other !== menu) other.hidden = true; }); menu.hidden = !menu.hidden; });
    menu.addEventListener('click', (event) => event.stopPropagation()); cell.append(trigger, menu);
  }

  document.addEventListener('click', () => document.querySelectorAll('.header-filter-menu').forEach((menu) => { menu.hidden = true; }));
  rows.forEach((row) => {
    const code = row.dataset.doc || '';
    const suggestionCell = row.querySelector('.audit-suggestion');
    const feedbackCell = row.querySelector('.audit-feedback-result');
    row.dataset.auditType = code.startsWith('EXP') ? '报销单' : '付款单';
    row.dataset.auditSuggestion = row.dataset.ai || suggestionCell?.textContent.trim() || '';
    row.dataset.auditFeedback = feedbackCell?.textContent.trim() || '未反馈';
    const typeCell = row.querySelector('[data-field="type"]');
    if (typeCell) typeCell.textContent = row.dataset.auditType === '报销单' ? '报销申请' : '付款申请';
  });

  createHeaderFilter([...header.children].find((cell) => headerText(cell) === '单据类型'), 'type', headerFilterOptions.单据类型.type);
  createHeaderFilter([...header.children].find((cell) => headerText(cell) === 'AI 审批建议'), 'suggestion', headerFilterOptions.AI审批建议.suggestion);
  createHeaderFilter([...header.children].find((cell) => headerText(cell) === 'AI 反馈结果'), 'feedback', headerFilterOptions.AI反馈结果.feedback);
  const fieldCount = document.querySelector('.footer span:last-child');
  if (fieldCount) fieldCount.textContent = '共 24 个审计字段';
}());
