import React from 'react';
import {
  LayoutDashboard, Users, Scissors, UserRound, Wallet, Receipt,
  BarChart3, Settings, Menu, Search, Bell, Plus, ArrowUpRight,
  Clock3, CircleDollarSign, TrendingUp
} from 'lucide-react';

const menu = [
  ['لوحة التحكم', LayoutDashboard],
  ['العمال', Users],
  ['الخدمات والأسعار', Scissors],
  ['الزبائن', UserRound],
  ['المصاريف', Receipt],
  ['الرواتب والدفعات', Wallet],
  ['التقارير', BarChart3],
  ['الإعدادات', Settings],
];

const workers = [
  { name: 'أحمد محمد', services: 14, revenue: 850 },
  { name: 'علي سامي', services: 11, revenue: 650 },
  { name: 'حسن خالد', services: 9, revenue: 500 },
  { name: 'سعيد محمد', services: 7, revenue: 450 },
];

const services = [
  { name: 'قص شعر', count: 18, value: 900 },
  { name: 'لحية', count: 8, value: 240 },
  { name: 'قص + لحية', count: 7, value: 350 },
  { name: 'تنظيف بشرة', count: 5, value: 250 },
];

function StatCard({ icon: Icon, title, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={21} /></div>
      <div className="stat-text">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Scissors size={23} /></div>
          <div>
            <strong>محل الحلاقة</strong>
            <span>نظام الإدارة والمحاسبة</span>
          </div>
        </div>

        <nav>
          {menu.map(([label, Icon], index) => (
            <button className={`nav-item ${index === 0 ? 'active' : ''}`} key={label}>
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot"></div>
          <div>
            <strong>النظام يعمل</strong>
            <span>آخر مزامنة الآن</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu"><Menu size={22} /></button>
          <div>
            <h1>لوحة التحكم</h1>
            <p>نظرة سريعة على أداء المحل اليوم</p>
          </div>
          <div className="top-actions">
            <button className="icon-button"><Search size={19} /></button>
            <button className="icon-button notification"><Bell size={19} /><i /></button>
            <button className="profile">خ</button>
          </div>
        </header>

        <section className="content">
          <div className="welcome-row">
            <div>
              <h2>أهلاً بك 👋</h2>
              <p>هذه نظرة عامة على حركة المحل.</p>
            </div>
            <button className="primary-button"><Plus size={18} /> تسجيل خدمة</button>
          </div>

          <div className="stats-grid">
            <StatCard icon={CircleDollarSign} title="إيرادات اليوم" value="$2,450" note="+12.5% عن أمس" />
            <StatCard icon={Scissors} title="الخدمات اليوم" value="38" note="4 خدمات أكثر من أمس" />
            <StatCard icon={Users} title="الزبائن اليوم" value="27" note="8 زبائن جدد" />
            <StatCard icon={TrendingUp} title="صافي الربح" value="$1,850" note="بعد المصاريف" />
          </div>

          <div className="dashboard-grid">
            <section className="panel chart-panel">
              <div className="panel-head">
                <div><h3>الإيرادات</h3><span>آخر 7 أيام</span></div>
                <button className="select">هذا الأسبوع⌄</button>
              </div>
              <div className="chart">
                <div className="grid-line l1"></div><div className="grid-line l2"></div>
                <div className="grid-line l3"></div><div className="grid-line l4"></div>
                <svg viewBox="0 0 700 260" preserveAspectRatio="none" aria-label="Revenue chart">
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d99a3d" stopOpacity=".32"/>
                      <stop offset="100%" stopColor="#d99a3d" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0 205 L105 170 L210 185 L315 115 L420 140 L525 65 L630 85 L700 25 L700 260 L0 260 Z" fill="url(#area)"/>
                  <path d="M0 205 L105 170 L210 185 L315 115 L420 140 L525 65 L630 85 L700 25" fill="none" stroke="#d99a3d" strokeWidth="4"/>
                  <g fill="#d99a3d">
                    <circle cx="0" cy="205" r="5"/><circle cx="105" cy="170" r="5"/><circle cx="210" cy="185" r="5"/>
                    <circle cx="315" cy="115" r="5"/><circle cx="420" cy="140" r="5"/><circle cx="525" cy="65" r="5"/>
                    <circle cx="630" cy="85" r="5"/><circle cx="700" cy="25" r="5"/>
                  </g>
                </svg>
                <div className="chart-labels"><span>السبت</span><span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span></div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div><h3>الإيرادات حسب الخدمة</h3><span>هذا الشهر</span></div>
              </div>
              <div className="service-list">
                {services.map((s) => (
                  <div className="service-row" key={s.name}>
                    <div className="service-info"><span>{s.name}</span><small>{s.count} خدمات</small></div>
                    <strong>${s.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lower-grid">
            <section className="panel">
              <div className="panel-head">
                <div><h3>أداء العمال اليوم</h3><span>حسب الإيرادات</span></div>
                <button className="text-button">عرض الكل</button>
              </div>
              <div className="worker-table">
                <div className="table-head"><span>العامل</span><span>الخدمات</span><span>الإيرادات</span></div>
                {workers.map(w => (
                  <div className="worker-row" key={w.name}>
                    <div className="worker-name"><div>{w.name.slice(0,1)}</div><span>{w.name}</span></div>
                    <span>{w.services}</span>
                    <strong>${w.revenue}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel quick-panel">
              <div className="panel-head"><div><h3>اختصارات سريعة</h3><span>أكثر العمليات استخداماً</span></div></div>
              <button><Plus size={18}/><span><strong>إضافة خدمة</strong><small>تسجيل خدمة لزبون</small></span></button>
              <button><Receipt size={18}/><span><strong>إضافة مصروف</strong><small>تسجيل مصروف جديد</small></span></button>
              <button><Wallet size={18}/><span><strong>تسجيل دفعة</strong><small>دفعة للعامل</small></span></button>
              <button><BarChart3 size={18}/><span><strong>عرض التقارير</strong><small>التقارير المالية</small></span></button>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}