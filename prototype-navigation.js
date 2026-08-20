(() => {
  const routes = {
    applyCenter: '申请中心原型.html',
    officeApproval: '审批列表原型.html',
    applyForm: '报销申请页-AI审单优化原型.html',
    todo: '财务待办页-AI影子审批原型.html',
    financeApproval: '财务审批页-AI影子审单原型.html',
    approvalDetail: '审批详情页-AI影子审批原型.html',
    paymentTask: '付款申请页-任务卡交互对比原型.html',
    flow: '审批流配置页-AI影子审批原型.html',
    audit: '审计查询页-AI影子审批原型.html',
    dashboard: '影子审批评估看板原型.html'
  };
  const menuRoutes = [['办公管理', 'applyCenter'], ['审批', 'officeApproval'], ['流程', 'flow'], ['审批流程', 'flow'], ['财务管理', 'audit'], ['审批确认', 'todo'], ['AI审单记录', 'audit'], ['统计分析', 'dashboard'], ['影子审批评估', 'dashboard']];
  const hiddenSidebarRoutes = new Set(['flow', 'dashboard']);
  const currentFile = decodeURIComponent(window.location.pathname).split('/').pop();
  const detectedRoute = Object.entries(routes).find(([, file]) => file === currentFile)?.[0];
  const currentRoute = detectedRoute || 'applyCenter';
  const searchParams = new URLSearchParams(window.location.search);
  const isEmbedded = new URLSearchParams(window.location.search).has('embedded');
  const isReimbursementDocument = searchParams.get('documentType') === 'reimbursement';
  if (isEmbedded) return;
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  function renderUnifiedTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    topbar.innerHTML = '<div class="brand"><span class="brand-mark"><span>博</span></span>博商管理</div><div class="top-actions"><span>▦ 应用中心</span><span>▧ 帮助手册</span><span>▣ 日程</span><span>◈ 模块</span><span class="user"><i class="avatar">财</i>财务专员⌄</span></div>';
  }

  function renderUnifiedSidebar() {
    const active = route => route === currentRoute ? ' active' : '';
    const current = route => route === currentRoute ? ' current' : '';
    sidebar.innerHTML = `
      <div class="side-title"><span>⌂ 办公管理</span><span>⌄</span></div>
      <div class="nav-section">
        <div class="nav-item${active('applyCenter') || active('applyForm') || active('paymentTask') || active('officeApproval')}" data-nav-target="applyCenter">▣ <span>办公管理</span></div>
        <div class="nav-sub${current('applyCenter')}" data-nav-target="applyCenter">申请</div>
        <div class="nav-sub${current('officeApproval')}" data-nav-target="officeApproval">审批</div>
      </div>
      <div class="nav-section${hiddenSidebarRoutes.has('flow') ? ' nav-section-hidden' : ''}">
        <div class="nav-item${active('flow')}" data-nav-target="flow">⌘ <span>流程</span></div>
        <div class="nav-sub${current('flow')}" data-nav-target="flow">审批流程</div>
      </div>
      <div class="nav-section">
        <div class="nav-item${active('audit') || active('todo') || active('financeApproval') || active('approvalDetail')}" data-nav-target="audit">◉ <span>财务管理</span></div>
        <div class="nav-sub${current('todo')}" data-nav-target="todo">审批确认</div>
        <div class="nav-sub${current('audit')}" data-nav-target="audit">AI审单记录</div>
      </div>
      <div class="nav-section${hiddenSidebarRoutes.has('dashboard') ? ' nav-section-hidden' : ''}">
        <div class="nav-item${active('dashboard')}" data-nav-target="dashboard">◌ <span>统计分析</span></div>
        <div class="nav-sub${current('dashboard')}" data-nav-target="dashboard">影子审批评估</div>
      </div>
      `;
  }

  function bindNavigation() {
    sidebar.querySelectorAll('[data-nav-target]').forEach(item => {
      const route = item.dataset.navTarget;
      const navigate = () => { if (route !== currentRoute) window.location.href = routes[route]; };
      item.setAttribute('role', 'link');
      item.tabIndex = 0;
      item.addEventListener('click', navigate);
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate(); }
      });
    });
  }

  function renderUnifiedWorkspaceTabs() {
    const workspace = document.querySelector('main.workspace');
    if (!workspace) return;

    const isApplicationCenter = currentRoute === 'applyCenter';
    const applicationTabs = isApplicationCenter ? workspace.querySelector(':scope > .tabs') : null;
    if (applicationTabs) {
      applicationTabs.classList.add('system-workspace-tabs');
      return;
    }

    workspace.querySelectorAll(':scope > .workspace-tabs, :scope > .work-tabs').forEach(tabBar => tabBar.remove());
    const tabBar = document.createElement('nav');
    tabBar.className = 'system-workspace-tabs';
    tabBar.setAttribute('aria-label', '已打开页签');
    const coreTabs = [
      { label: '首页', route: 'applyCenter', closable: false },
      { label: '申请', route: 'applyCenter', closable: true },
      { label: '审批', route: 'officeApproval', closable: true },
      { label: '审批确认', route: 'todo', closable: true }
    ];
    const pageTabs = {
      applyForm: { label: '付款申请', closeRoute: '申请中心原型.html' },
      financeApproval: { label: isReimbursementDocument ? '报销审批' : '付款审批', closeRoute: '财务待办页-AI影子审批原型.html' },
      approvalDetail: { label: isReimbursementDocument ? '报销详情' : '单据详情', closeRoute: '财务待办页-AI影子审批原型.html' },
      paymentTask: { label: '付款申请', closeRoute: '申请中心原型.html' },
      flow: { label: '审批流程', closeRoute: '申请中心原型.html' },
      audit: { label: 'AI审单记录', closeRoute: '财务待办页-AI影子审批原型.html' },
      dashboard: { label: '影子审批评估', closeRoute: '申请中心原型.html' }
    };
    const tabs = [...coreTabs];
    const currentTab = pageTabs[currentRoute];
    if (currentTab) tabs.push({ ...currentTab, route: currentRoute, closable: true });

    tabBar.innerHTML = tabs.map(tab => {
      const active = tab.route === currentRoute ? ' active' : '';
      const close = tab.closable ? `<span class="system-tab-close" role="button" aria-label="关闭${tab.label}页签" data-close-workspace-route="${tab.closeRoute || routes.applyCenter}">×</span>` : '';
      return `<button class="system-workspace-tab${active}" type="button" data-workspace-route="${tab.route}">${tab.label}${close}</button>`;
    }).join('');
    workspace.insertBefore(tabBar, workspace.firstChild);

    tabBar.addEventListener('click', event => {
      const close = event.target.closest('[data-close-workspace-route]');
      if (close) {
        closeWorkspaceTab(close.closest('[data-workspace-route]'), event);
        return;
      }
      const tab = event.target.closest('[data-workspace-route]');
      if (tab) openWorkspaceTab(tab);
    });
  }

  function openWorkspaceTab(tab) {
    const route = tab.dataset.workspaceRoute;
    if (route && route !== currentRoute) window.location.href = routes[route];
  }

  function closeWorkspaceTab(tab, event) {
    event.stopPropagation();
    const wasActive = tab.classList.contains('active');
    const fallback = tab.querySelector('[data-close-workspace-route]')?.dataset.closeWorkspaceRoute || routes.applyCenter;
    tab.remove();
    if (wasActive) window.location.href = fallback;
  }

  function applyUnifiedSidebarStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .topbar{position:fixed!important;z-index:10!important;top:0!important;right:0!important;left:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;height:62px!important;padding:0 25px 0 22px!important;color:#273959!important;background:#fff!important;border-bottom:1px solid #e3e9f2!important}.topbar .brand{position:static!important;z-index:auto!important;display:flex!important;width:auto!important;height:auto!important;padding:0!important;gap:11px!important;align-items:center!important;color:#273959!important;background:transparent!important;font-size:18px!important;font-weight:700!important}.topbar .brand-mark{display:grid!important;width:25px!important;height:25px!important;place-items:center!important;color:#fff!important;background:#e75159!important;border-radius:7px 12px 7px 12px!important;transform:rotate(45deg)!important}.topbar .brand-mark span{font-size:13px!important;transform:rotate(-45deg)!important}.topbar .top-actions{display:flex!important;gap:19px!important;align-items:center!important;color:#6d7a91!important;font-size:12px!important}.topbar .user{display:flex!important;gap:8px!important;align-items:center!important}.topbar .avatar{display:grid!important;width:29px!important;height:29px!important;place-items:center!important;color:#fff!important;background:#e05358!important;border-radius:50%!important;font-style:normal!important}
      .sidebar{top:62px!important;width:204px!important;padding:16px 12px!important;overflow:auto!important;color:#cbd5e7!important;background:#1f3156!important}.workspace{min-height:calc(100vh - 62px)!important;margin-top:62px!important}
      .sidebar .side-title{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:5px 11px 13px!important;color:#fff!important;font-size:13px!important;font-weight:700!important}
      .sidebar .nav-section{margin:0 0 7px!important}.sidebar .nav-section-hidden{display:none!important}.sidebar .nav-item{display:flex!important;align-items:center!important;gap:10px!important;min-height:37px!important;margin:0!important;padding:0 12px!important;color:#c2cde0!important;background:transparent!important;border:0!important;border-radius:6px!important;font-size:13px!important;line-height:37px!important;text-decoration:none!important}
      .sidebar .nav-item[data-nav-target],.sidebar .nav-sub[data-nav-target]{cursor:pointer!important}.sidebar .nav-item.active{color:#fff!important;background:#2c4472!important;font-weight:700!important}.sidebar .nav-sub{display:block!important;margin:3px 0 4px 37px!important;padding:7px 0!important;color:#81a9fa!important;background:transparent!important;border:0!important;font-size:13px!important;line-height:1.35!important}.sidebar .nav-sub.current{color:#fff!important;font-weight:700!important}.sidebar .nav-divider{height:1px!important;margin:12px 8px!important;background:rgba(203,213,231,.16)!important}.sidebar .nav-static{color:#aebbd0!important}.sidebar [data-nav-target]:hover{filter:brightness(1.12)}.sidebar [data-nav-target]:focus-visible{outline:2px solid #8cb2ff!important;outline-offset:-2px!important}
    `;
    document.head.append(style);
  }

  function applyUnifiedWorkspaceTabStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .system-workspace-tabs{display:flex!important;align-items:flex-end!important;min-height:40px!important;margin:0!important;padding:7px 12px 0!important;background:#fff!important;border-bottom:8px solid #f2f4f8!important;overflow-x:auto!important;white-space:nowrap!important}
      .system-workspace-tab,.system-workspace-tabs .tab{position:relative!important;display:inline-flex!important;align-items:center!important;min-height:32px!important;margin:0 0 0 4px!important;padding:0 13px!important;color:#4e6583!important;background:#fff!important;border:1px solid #dde3eb!important;border-bottom:0!important;border-radius:0!important;font:13px/32px "Microsoft YaHei","PingFang SC",Arial,sans-serif!important;cursor:pointer!important}
      .system-workspace-tab:first-child,.system-workspace-tabs .tab:first-child{margin-left:0!important}.system-workspace-tab.active,.system-workspace-tabs .tab.active{z-index:1!important;color:#34445e!important;background:#fff!important;border-top:3px solid #f26b6b!important;font-weight:700!important}
      .system-tab-close,.system-workspace-tabs .tab-close{display:inline-grid!important;width:17px!important;height:17px!important;margin-left:5px!important;place-items:center!important;color:#5779a3!important;border-radius:3px!important;font-size:15px!important;font-weight:700!important;line-height:1!important;vertical-align:middle!important}.system-tab-close:hover,.system-workspace-tabs .tab-close:hover{color:#fff!important;background:#7b8ba4!important}.system-workspace-tab:focus-visible,.system-workspace-tabs .tab:focus-visible{outline:2px solid #8cb2ff!important;outline-offset:-2px!important}
    `;
    document.head.append(style);
  }

  renderUnifiedTopbar();
  renderUnifiedSidebar();
  bindNavigation();
  renderUnifiedWorkspaceTabs();
  applyUnifiedSidebarStyles();
  applyUnifiedWorkspaceTabStyles();
  void menuRoutes;
})();
