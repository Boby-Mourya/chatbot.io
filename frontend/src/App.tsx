import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Activity, ArrowRight, BarChart3, Bot, BookOpen, Check, CheckCircle2, ChevronRight,
  CircleHelp, Code2, Copy, FileText, Globe, LayoutDashboard, LogOut, Menu, MessageSquare,
  MoreHorizontal, Palette, Plug, Plus, Search, Send, Settings, ShieldCheck, Sparkles,
  Trash2, Upload, UserRound, Users, WandSparkles, X, Zap
} from 'lucide-react';

type Agent = {
  id: string; name: string; description: string; instructions: string; tone: string;
  greeting: string; primaryColor: string; position: 'left' | 'right'; publicId: string;
  status: 'draft' | 'live'; createdAt: string;
};
type User = { id: string; name: string; email: string; workspaceId: string };
type ApiError = Error & { status?: number };

const api = async <T = any,>(path: string, init: RequestInit = {}) => {
  const response = await fetch(path, {
    credentials: 'include', ...init,
    headers: { ...(init.body instanceof FormData ? {} : { 'content-type': 'application/json' }), ...(init.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed') as ApiError;
    error.status = response.status;
    throw error;
  }
  return data as T;
};
const fmt = (date: string) => new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link className={`brand ${compact ? 'compact' : ''}`} to="/"><span className="brand-mark"><Sparkles size={17} /></span>{!compact && <b>Chatbot<span>.io</span></b>}</Link>;
}

const featureCards = [
  [BookOpen, 'Train with your knowledge', 'Add websites, text, PDF, DOCX, TXT and Markdown so your assistant answers from approved information.'],
  [Bot, 'Shape every answer', 'Control instructions, tone, greeting and brand appearance before your chatbot ever meets a customer.'],
  [MessageSquare, 'See every conversation', 'Review real visitor conversations and discover the questions your customers ask most often.'],
  [Users, 'Capture qualified leads', 'Collect contact details directly from the chat experience and keep leads tied to the right agent.'],
  [BarChart3, 'Measure what matters', 'Track conversations, messages, leads and knowledge activity in one simple workspace.'],
  [Code2, 'Deploy in one snippet', 'Publish your assistant and add it to any website with a lightweight JavaScript embed.']
] as const;

function Landing() {
  return <div className="marketing-site">
    <div className="announcement"><span>New</span> Build a helpful AI agent from your own business knowledge <ArrowRight size={13} /></div>
    <header className="marketing-nav">
      <Brand />
      <nav><a href="#product">Product</a><a href="#how">How it works</a><a href="#deploy">Deploy</a></nav>
      <div className="nav-actions"><Link className="text-button" to="/login">Log in</Link><Link className="primary-button small" to="/signup">Get started <ArrowRight size={15} /></Link></div>
    </header>

    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="pill"><WandSparkles size={14} /> AI support, grounded in your knowledge</div>
          <h1>Turn what you know into <span>answers customers trust.</span></h1>
          <p>Create an AI chatbot for your website, train it on approved content, customize the experience, test every flow and publish it when you are ready.</p>
          <div className="hero-buttons"><Link className="primary-button" to="/signup">Build your chatbot <ArrowRight size={17} /></Link><a className="secondary-button" href="#how">See how it works</a></div>
          <div className="hero-trust"><div className="avatar-stack"><i>A</i><i>M</i><i>S</i><i>R</i></div><span><b>Built for customer-facing teams</b><small>No-code setup. Your content stays in control.</small></span></div>
        </div>

        <div className="hero-visual" aria-label="Chatbot workspace preview">
          <div className="glow glow-one" /><div className="glow glow-two" />
          <div className="product-window">
            <div className="window-bar"><div className="dots"><i /><i /><i /></div><span>app.chatbot.io</span><div /></div>
            <div className="window-body">
              <aside className="preview-sidebar"><Brand compact /><i className="active"><LayoutDashboard size={16} /></i><i><Bot size={16} /></i><i><BookOpen size={16} /></i><i><MessageSquare size={16} /></i><i><BarChart3 size={16} /></i></aside>
              <section className="preview-dashboard">
                <div className="preview-title"><div><small>Overview</small><strong>Good morning, Alex</strong></div><button><Plus size={12} /> New agent</button></div>
                <div className="preview-stats"><article><small>Conversations</small><strong>1,284</strong><span>+18.4%</span></article><article><small>Leads</small><strong>326</strong><span>+11.8%</span></article><article><small>Resolution</small><strong>82%</strong><span>+4.2%</span></article></div>
                <div className="preview-chart"><div><b>Conversation activity</b><small>Last 14 days</small></div><section>{[35,48,41,62,54,68,61,79,72,88,67,93,83,96].map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</section></div>
              </section>
              <div className="preview-chat">
                <div className="preview-chat-head"><span className="assistant-avatar"><Sparkles size={14} /></span><div><b>Acme Assistant</b><small><i /> Online</small></div><MoreHorizontal size={16} /></div>
                <div className="preview-chat-body"><p className="bot-bubble">Hi! 👋 How can I help you today?</p><p className="user-bubble">Can I connect this to my website?</p><p className="bot-bubble">Absolutely. Publish your agent, copy the embed snippet and add it before the closing body tag.</p></div>
                <div className="preview-input"><span>Ask a question...</span><button><Send size={14} /></button></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip"><span>One focused workflow for</span><div><b>Support</b><b>Sales</b><b>Onboarding</b><b>Product</b><b>Customer success</b></div></section>

      <section className="marketing-section feature-section" id="product">
        <div className="section-heading"><div className="pill muted"><Sparkles size={14} /> Everything in one place</div><h2>A complete chatbot workspace without the clutter.</h2><p>Everything needed to create, train, test, publish and improve a customer-facing assistant.</p></div>
        <div className="marketing-features">{featureCards.map(([Icon, title, text]) => <article key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{text}</p><a href="#how">Learn more <ChevronRight size={14} /></a></article>)}</div>
      </section>

      <section className="marketing-section process-section" id="how">
        <div className="process-copy"><div className="pill muted"><Zap size={14} /> From knowledge to live chat</div><h2>Launch in four clear steps.</h2><p>Each step is designed to keep you in control of what your assistant knows and how it behaves.</p></div>
        <div className="process-list">
          {[['01', 'Create your agent', 'Give it a name, purpose and instructions.'], ['02', 'Add trusted knowledge', 'Upload files, paste text or connect a public webpage.'], ['03', 'Test and customize', 'Try real questions, tune tone and match your brand.'], ['04', 'Publish and deploy', 'Go live and install the widget with one snippet.']].map(([n, t, d]) => <article key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div><Check size={18} /></article>)}
        </div>
      </section>

      <section className="marketing-section knowledge-showcase">
        <div className="knowledge-card"><div className="mini-window"><div className="mini-head"><BookOpen size={17} /><b>Knowledge</b><button><Plus size={13} /> Add source</button></div>{[['Website', 'help.acme.com', Globe], ['Returns policy', 'returns-policy.pdf', FileText], ['Product FAQ', '42 knowledge chunks', BookOpen]].map(([type, name, Icon]: any) => <div className="source-row" key={name}><span><Icon size={15} /></span><div><b>{name}</b><small>{type}</small></div><em><CheckCircle2 size={13} /> Ready</em></div>)}</div></div>
        <div className="knowledge-copy"><div className="pill muted"><ShieldCheck size={14} /> Grounded by design</div><h2>Your assistant answers from the information you approve.</h2><p>Knowledge is chunked and searched before an answer is generated. That keeps the experience focused on your content instead of unrelated information.</p><ul><li><CheckCircle2 size={17} /> Test answers before publishing</li><li><CheckCircle2 size={17} /> Keep each agent's knowledge separate</li><li><CheckCircle2 size={17} /> Remove outdated sources anytime</li></ul></div>
      </section>

      <section className="launch-cta" id="deploy"><span className="cta-orb orb-a" /><span className="cta-orb orb-b" /><div className="pill light"><Sparkles size={14} /> Ready to launch?</div><h2>Your next customer question is already on the way.</h2><p>Give them a better answer with an assistant trained on your business.</p><Link className="light-button" to="/signup">Create your chatbot <ArrowRight size={17} /></Link></section>
    </main>

    <footer className="marketing-footer"><div><Brand /><p>AI support built around the knowledge you choose.</p></div><div><a href="#product">Product</a><a href="#how">How it works</a><Link to="/login">Log in</Link></div><small>© {new Date().getFullYear()} Chatbot.io</small></footer>
  </div>;
}

function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setError(''); setBusy(true); try { await api(`/api/auth/${mode}`, { method: 'POST', body: JSON.stringify({ name, email, password }) }); navigate('/app'); } catch (err: any) { setError(err.message); } finally { setBusy(false); } }
  return <div className="auth-page">
    <section className="auth-showcase"><Brand /><div className="auth-copy"><div className="pill light"><Sparkles size={14} /> Customer support, reimagined</div><h1>Give every visitor a helpful answer, instantly.</h1><p>Train an assistant on your own knowledge and turn your website into a conversation.</p><div className="auth-quote"><span>“</span><p>Everything from training to deployment lives in one focused workspace.</p></div></div><small>Secure workspace · Grounded knowledge · Easy deployment</small></section>
    <section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="auth-mobile-brand"><Brand /></div><div><h2>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2><p>{mode === 'login' ? 'Log in to continue managing your assistants.' : 'Start building your first AI assistant in minutes.'}</p></div>{mode === 'signup' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" minLength={2} required /></label>}<label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} minLength={mode === 'signup' ? 8 : 1} required /></label>{error && <div className="form-error">{error}</div>}<button className="primary-button full" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={16} /></button><div className="auth-switch">{mode === 'login' ? <>New to Chatbot.io? <Link to="/signup">Create an account</Link></> : <>Already have an account? <Link to="/login">Log in</Link></>}</div></form></section>
  </div>;
}

const navItems = [[LayoutDashboard, 'Overview', '/app'], [Bot, 'Agents', '/app/agents'], [BookOpen, 'Knowledge', '/app/knowledge'], [MessageSquare, 'Conversations', '/app/conversations'], [Users, 'Leads', '/app/leads'], [BarChart3, 'Analytics', '/app/analytics'], [Plug, 'Integrations', '/app/integrations'], [Code2, 'Deploy', '/app/deploy'], [Settings, 'Settings', '/app/settings']] as const;

function Shell({ user, setUser }: { user: User; setUser: (user: User | null) => void }) {
  const [open, setOpen] = useState(false); const navigate = useNavigate(); const location = useLocation();
  const current = navItems.find(([, , path]) => path === location.pathname)?.[1] || (location.pathname.includes('/agents/') ? 'Agent editor' : 'Workspace');
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setUser(null); navigate('/'); }
  return <div className="app-shell">
    <aside className={`app-sidebar ${open ? 'open' : ''}`}><div className="sidebar-head"><Brand /><button className="icon-button mobile-only" onClick={() => setOpen(false)}><X size={18} /></button></div><div className="workspace-switch"><span>W</span><div><b>{user.name}'s workspace</b><small>Customer workspace</small></div><ChevronRight size={14} /></div><nav className="sidebar-nav">{navItems.map(([Icon, label, path]) => <NavLink end={path === '/app'} onClick={() => setOpen(false)} key={path} to={path}><Icon size={17} /><span>{label}</span></NavLink>)}</nav><div className="sidebar-help"><CircleHelp size={17} /><span><b>Need help?</b><small>Review your setup</small></span></div><div className="sidebar-user"><span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span><div><b>{user.name}</b><small>{user.email}</small></div><button className="icon-button" onClick={logout} title="Log out"><LogOut size={16} /></button></div></aside>
    {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />}
    <section className="app-main"><header className="app-topbar"><button className="icon-button mobile-menu" onClick={() => setOpen(true)}><Menu size={20} /></button><div><span>Workspace</span><ChevronRight size={13} /><b>{current}</b></div><div className="topbar-actions"><Link to="/app/agents" className="secondary-button compact"><Bot size={15} /> Agents</Link><span className="top-avatar">{user.name.charAt(0).toUpperCase()}</span></div></header><Routes><Route index element={<Overview />} /><Route path="agents" element={<Agents />} /><Route path="agents/:id" element={<AgentEditor />} /><Route path="knowledge" element={<Knowledge />} /><Route path="conversations" element={<Conversations />} /><Route path="leads" element={<Leads />} /><Route path="analytics" element={<Analytics />} /><Route path="integrations" element={<Integrations />} /><Route path="deploy" element={<Deploy />} /><Route path="settings" element={<WorkspaceSettings />} /></Routes></section>
  </div>;
}

function Page({ title, sub, actions, children }: { title: string; sub: string; actions?: ReactNode; children: ReactNode }) { return <main className="app-page"><header className="page-header"><div><h1>{title}</h1><p>{sub}</p></div>{actions && <div className="page-actions">{actions}</div>}</header>{children}</main>; }
function Empty({ icon: Icon = Sparkles, title, text }: { icon?: any; title: string; text: string }) { return <div className="empty-state"><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></div>; }
function Loading() { return <div className="loading-state"><span /><p>Loading workspace...</p></div>; }
function useOverview() { const [data, setData] = useState<any>(null); useEffect(() => { api('/api/analytics/overview').then(setData).catch(() => setData({})); }, []); return data; }

function Overview() {
  const data = useOverview(); const stats = [[MessageSquare, 'Conversations', data?.conversations || 0, 'Visitor chats'], [Users, 'Leads', data?.leads || 0, 'Captured contacts'], [Bot, 'Agents', data?.agents || 0, 'Created assistants'], [BookOpen, 'Knowledge', data?.sources || 0, 'Active sources']];
  return <Page title="Overview" sub="See how your AI assistants are performing." actions={<Link className="primary-button small" to="/app/agents"><Plus size={15} /> New agent</Link>}><div className="metric-grid">{stats.map(([Icon, label, value, helper]: any) => <article className="metric-card" key={label}><div className="metric-top"><span><Icon size={18} /></span><em><Activity size={12} /> Live</em></div><strong>{value}</strong><b>{label}</b><small>{helper}</small></article>)}</div><div className="dashboard-grid"><section className="surface chart-surface"><div className="surface-heading"><div><h3>Conversation activity</h3><p>Daily conversations over the last 14 days</p></div><span className="quiet-chip">Last 14 days</span></div><Bars daily={data?.daily || []} /></section><section className="surface quick-start"><div className="surface-heading"><div><h3>Launch checklist</h3><p>Get your assistant ready for customers.</p></div></div>{[['Create an agent', data?.agents > 0], ['Add knowledge', data?.sources > 0], ['Test your answers', false], ['Publish & deploy', false]].map(([label, done]: any, index) => <div className="check-row" key={label}><span className={done ? 'done' : ''}>{done ? <Check size={13} /> : index + 1}</span><div><b>{label}</b><small>{done ? 'Completed' : 'Continue setup'}</small></div><ChevronRight size={15} /></div>)}</section></div></Page>;
}
function Bars({ daily }: { daily: any[] }) { const max = Math.max(1, ...daily.map(x => x.conversations)); return <div className="bar-chart">{daily.length ? daily.map((x: any) => <div key={x.day}><span className="bar-track"><i style={{ height: `${Math.max(5, x.conversations / max * 100)}%` }} /></span><small>{x.day.slice(5)}</small></div>) : Array.from({ length: 14 }).map((_, i) => <div key={i}><span className="bar-track"><i style={{ height: `${[16, 25, 19, 33, 27, 38, 31, 44, 34, 48, 39, 52, 45, 58][i]}%` }} /></span><small>--</small></div>)}</div>; }

function Agents() {
  const [list, setList] = useState<Agent[]>([]); const [name, setName] = useState(''); const [busy, setBusy] = useState(false); const navigate = useNavigate();
  useEffect(() => { api<any>('/api/agents').then(d => setList(d.agents)); }, []);
  async function create(e: FormEvent) { e.preventDefault(); if (!name.trim()) return; setBusy(true); try { const d = await api<any>('/api/agents', { method: 'POST', body: JSON.stringify({ name }) }); navigate(`/app/agents/${d.agent.id}`); } finally { setBusy(false); } }
  return <Page title="Agents" sub="Create, train and publish the assistants your customers interact with." actions={<form className="inline-create" onSubmit={create}><input placeholder="Agent name" value={name} onChange={e => setName(e.target.value)} minLength={2} required /><button className="primary-button small" disabled={busy}><Plus size={15} /> Create</button></form>}><div className="agent-grid">{list.map(agent => <Link className="agent-card" to={`/app/agents/${agent.id}`} key={agent.id}><div className="agent-card-top"><span className="agent-card-icon" style={{ background: agent.primaryColor }}><Sparkles size={18} /></span><span className={`status-badge ${agent.status}`}><i />{agent.status === 'live' ? 'Live' : 'Draft'}</span></div><h3>{agent.name}</h3><p>{agent.description || 'Configure this agent with instructions and knowledge.'}</p><div className="agent-card-footer"><small>Created {new Date(agent.createdAt).toLocaleDateString()}</small><span>Open <ArrowRight size={14} /></span></div></Link>)}<button className="agent-card create-card" onClick={() => document.querySelector<HTMLInputElement>('.inline-create input')?.focus()}><span><Plus size={20} /></span><h3>Create another agent</h3><p>Start with a blank assistant and customize it for your use case.</p></button></div>{!list.length && <Empty icon={Bot} title="No agents yet" text="Create your first assistant to get started." />}</Page>;
}

function AgentEditor() {
  const { id } = useParams(); const [agent, setAgent] = useState<Agent | null>(null); const [message, setMessage] = useState(''); const [chat, setChat] = useState<any[]>([]); const [busy, setBusy] = useState(false); const [saved, setSaved] = useState(true);
  useEffect(() => { api<any>(`/api/agents/${id}`).then(d => setAgent(d.agent)); }, [id]);
  async function save(patch: Partial<Agent>) { setSaved(false); try { const d = await api<any>(`/api/agents/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); setAgent(d.agent); setSaved(true); } catch { setSaved(false); } }
  async function send(e: FormEvent) { e.preventDefault(); if (!message.trim()) return; const text = message.trim(); setChat(v => [...v, { role: 'user', content: text }]); setMessage(''); setBusy(true); try { const d = await api<any>(`/api/agents/${id}/test-chat`, { method: 'POST', body: JSON.stringify({ message: text }) }); setChat(v => [...v, d.message]); } catch (err: any) { setChat(v => [...v, { role: 'assistant', content: err.message }]); } finally { setBusy(false); } }
  if (!agent) return <Loading />;
  return <Page title={agent.name} sub="Configure behavior, appearance and publishing state." actions={<><span className={`save-state ${saved ? 'saved' : ''}`}><CheckCircle2 size={14} />{saved ? 'Saved' : 'Unsaved'}</span><button className={agent.status === 'live' ? 'secondary-button compact' : 'primary-button small'} onClick={() => save({ status: agent.status === 'live' ? 'draft' : 'live' })}>{agent.status === 'live' ? 'Unpublish' : 'Publish agent'}</button></>}><div className="builder-layout"><section className="builder-settings surface"><div className="builder-tabs"><button className="active"><Bot size={15} />Behavior</button><button><Palette size={15} />Appearance</button></div><div className="builder-form"><label>Agent name<input value={agent.name} onChange={e => setAgent({ ...agent, name: e.target.value })} onBlur={() => save({ name: agent.name })} /></label><label>Description<textarea rows={3} value={agent.description} placeholder="What should this assistant help with?" onChange={e => setAgent({ ...agent, description: e.target.value })} onBlur={() => save({ description: agent.description })} /></label><label>Instructions<span className="label-hint">Tell the agent how it should answer.</span><textarea rows={7} value={agent.instructions} placeholder="Answer only from the provided knowledge. Be concise and helpful..." onChange={e => setAgent({ ...agent, instructions: e.target.value })} onBlur={() => save({ instructions: agent.instructions })} /></label><div className="field-grid"><label>Tone<input value={agent.tone} placeholder="Helpful and professional" onChange={e => setAgent({ ...agent, tone: e.target.value })} onBlur={() => save({ tone: agent.tone })} /></label><label>Widget side<select value={agent.position} onChange={e => { const position = e.target.value as 'left' | 'right'; setAgent({ ...agent, position }); save({ position }); }}><option value="right">Right</option><option value="left">Left</option></select></label></div><label>Greeting<textarea rows={3} value={agent.greeting} onChange={e => setAgent({ ...agent, greeting: e.target.value })} onBlur={() => save({ greeting: agent.greeting })} /></label><label>Brand color<div className="color-field"><input type="color" value={agent.primaryColor} onChange={e => { setAgent({ ...agent, primaryColor: e.target.value }); save({ primaryColor: e.target.value }); }} /><code>{agent.primaryColor}</code></div></label><div className="publish-box"><span className={agent.status === 'live' ? 'live-dot' : 'draft-dot'} /><div><b>{agent.status === 'live' ? 'Agent is live' : 'Agent is in draft'}</b><small>Public ID: {agent.publicId}</small></div></div></div></section><section className="preview-column"><div className="preview-column-head"><div><span>Live preview</span><small>Test responses before publishing.</small></div><span className="device-switch"><b>Desktop</b></span></div><div className="chat-preview-shell"><div className="chat-preview" style={{ '--agent-color': agent.primaryColor } as any}><div className="chat-preview-head"><span><Sparkles size={16} /></span><div><b>{agent.name}</b><small><i /> AI assistant</small></div><MoreHorizontal size={18} /></div><div className="chat-preview-messages"><div className="assistant-message">{agent.greeting}</div>{chat.map((m, i) => <div className={m.role === 'user' ? 'visitor-message' : 'assistant-message'} key={i}>{m.content}</div>)}{busy && <div className="assistant-message typing"><i /><i /><i /></div>}</div><form className="chat-preview-input" onSubmit={send}><input placeholder="Ask your agent a question..." value={message} onChange={e => setMessage(e.target.value)} /><button><Send size={15} /></button></form><small className="powered">Powered by <b>Chatbot.io</b></small></div></div></section></div></Page>;
}

function Knowledge() {
  const [agents, setAgents] = useState<Agent[]>([]); const [agentId, setAgentId] = useState(''); const [sources, setSources] = useState<any[]>([]); const [tab, setTab] = useState<'text' | 'url' | 'file'>('text'); const [name, setName] = useState('Product knowledge'); const [text, setText] = useState(''); const [url, setUrl] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { api<any>('/api/agents').then(d => { setAgents(d.agents); if (d.agents[0]) setAgentId(d.agents[0].id); }); }, []); useEffect(() => { if (agentId) reload(); }, [agentId]);
  async function reload() { const d = await api<any>(`/api/agents/${agentId}/knowledge`); setSources(d.sources); }
  async function run(action: () => Promise<any>) { setError(''); setBusy(true); try { await action(); await reload(); } catch (err: any) { setError(err.message); } finally { setBusy(false); } }
  async function addText(e: FormEvent) { e.preventDefault(); await run(() => api(`/api/agents/${agentId}/knowledge/text`, { method: 'POST', body: JSON.stringify({ name, text }) })); setText(''); }
  async function addUrl(e: FormEvent) { e.preventDefault(); await run(() => api(`/api/agents/${agentId}/knowledge/url`, { method: 'POST', body: JSON.stringify({ url }) })); setUrl(''); }
  async function addFile(file?: File) { if (!file) return; const form = new FormData(); form.append('file', file); await run(() => api(`/api/agents/${agentId}/knowledge/file`, { method: 'POST', body: form })); }
  async function remove(sourceId: string) { await run(() => api(`/api/agents/${agentId}/knowledge/${sourceId}`, { method: 'DELETE' })); }
  return <Page title="Knowledge" sub="Give each agent the trusted information it can use." actions={<select className="agent-select" value={agentId} onChange={e => setAgentId(e.target.value)}>{agents.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}</select>}><div className="knowledge-layout"><section className="surface add-knowledge"><div className="tab-row"><button className={tab === 'text' ? 'active' : ''} onClick={() => setTab('text')}><FileText size={15} /> Text</button><button className={tab === 'url' ? 'active' : ''} onClick={() => setTab('url')}><Globe size={15} /> Website</button><button className={tab === 'file' ? 'active' : ''} onClick={() => setTab('file')}><Upload size={15} /> File</button></div>{tab === 'text' && <form onSubmit={addText} className="knowledge-form"><h3>Add text knowledge</h3><p>Paste product information, policies, FAQs or any approved content.</p><label>Source name<input value={name} onChange={e => setName(e.target.value)} minLength={2} required /></label><label>Content<textarea rows={10} value={text} onChange={e => setText(e.target.value)} minLength={20} placeholder="Paste your knowledge here..." required /></label><button className="primary-button small" disabled={busy}>Add knowledge</button></form>}{tab === 'url' && <form onSubmit={addUrl} className="knowledge-form"><h3>Import a webpage</h3><p>We'll read usable text from a public webpage and add it to this agent.</p><label>Public URL<input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/help" required /></label><button className="primary-button small" disabled={busy}><Globe size={15} /> Import website</button></form>}{tab === 'file' && <div className="knowledge-form"><h3>Upload a document</h3><p>Supported formats: PDF, DOCX, TXT and Markdown. Maximum 7 MB.</p><label className="upload-zone"><Upload size={24} /><b>Choose a document</b><small>PDF, DOCX, TXT or MD</small><input type="file" accept=".pdf,.docx,.txt,.md" onChange={e => addFile(e.target.files?.[0])} /></label></div>}{error && <div className="form-error">{error}</div>}</section><section className="surface source-list"><div className="surface-heading"><div><h3>Knowledge sources</h3><p>{sources.length} source{sources.length === 1 ? '' : 's'} connected to this agent.</p></div></div>{sources.map(source => <div className="knowledge-source" key={source.id}><span className="source-icon">{source.kind === 'url' ? <Globe size={17} /> : source.kind === 'file' ? <FileText size={17} /> : <BookOpen size={17} />}</span><div><b>{source.name}</b><small>{source.kind} · Added {new Date(source.createdAt).toLocaleDateString()}</small></div><em><CheckCircle2 size={13} /> Ready</em><button className="icon-button danger" onClick={() => remove(source.id)}><Trash2 size={16} /></button></div>)}{!sources.length && <Empty icon={BookOpen} title="No knowledge yet" text="Add text, a webpage or a document to train this agent." />}</section></div></Page>;
}

function Conversations() {
  const [rows, setRows] = useState<any[]>([]); const [selected, setSelected] = useState<string>(''); const [messages, setMessages] = useState<any[]>([]); const [query, setQuery] = useState('');
  useEffect(() => { api<any>('/api/conversations').then(d => { setRows(d.conversations); if (d.conversations[0]) setSelected(d.conversations[0].id); }); }, []); useEffect(() => { if (selected) api<any>(`/api/conversations/${selected}/messages`).then(d => setMessages(d.messages)); }, [selected]);
  const filtered = rows.filter(r => `${r.visitorLabel || ''} ${r.agentName}`.toLowerCase().includes(query.toLowerCase())); const current = rows.find(r => r.id === selected);
  return <Page title="Conversations" sub="Review the questions visitors are asking your assistants."><div className="conversation-layout surface"><section className="conversation-list"><div className="conversation-search"><Search size={16} /><input placeholder="Search conversations" value={query} onChange={e => setQuery(e.target.value)} /></div><div className="conversation-scroll">{filtered.map(row => <button className={selected === row.id ? 'active' : ''} key={row.id} onClick={() => setSelected(row.id)}><span className="conversation-avatar"><UserRound size={16} /></span><div><b>{row.visitorLabel || 'Website visitor'}</b><p>{row.agentName} · {row.messageCount} messages</p><small>{fmt(row.lastMessageAt)}</small></div></button>)}{!rows.length && <Empty icon={MessageSquare} title="No conversations yet" text="Chats will appear here after visitors message a live agent." />}</div></section><section className="conversation-thread">{current ? <><header><div><b>{current.visitorLabel || 'Website visitor'}</b><small>Chatting with {current.agentName}</small></div><span className="status-badge live"><i />Conversation</span></header><div className="thread-body">{messages.map(m => <div className={m.role === 'user' ? 'thread-message user' : 'thread-message assistant'} key={m.id}><span>{m.content}</span><small>{fmt(m.createdAt)}</small></div>)}</div></> : <Empty icon={MessageSquare} title="Select a conversation" text="Choose a visitor chat to review its messages." />}</section></div></Page>;
}

function Leads() {
  const [leads, setLeads] = useState<any[]>([]); useEffect(() => { api<any>('/api/leads').then(d => setLeads(d.leads)); }, []);
  return <Page title="Leads" sub="Contacts captured through your published chatbot."><section className="surface table-surface"><div className="surface-heading"><div><h3>Captured leads</h3><p>{leads.length} contact{leads.length === 1 ? '' : 's'} collected.</p></div></div>{leads.length ? <div className="data-table"><div className="table-row table-head"><span>Contact</span><span>Agent</span><span>Phone</span><span>Captured</span></div>{leads.map(lead => <div className="table-row" key={lead.id}><span className="contact-cell"><i>{lead.name.charAt(0).toUpperCase()}</i><span><b>{lead.name}</b><small>{lead.email}</small></span></span><span>{lead.agentName}</span><span>{lead.phone || '—'}</span><span>{fmt(lead.createdAt)}</span></div>)}</div> : <Empty icon={Users} title="No leads yet" text="Captured visitor details will show up here." />}</section></Page>;
}

function Analytics() {
  const data = useOverview(); const total = Math.max(1, data?.conversations || 0); const leadRate = Math.round(((data?.leads || 0) / total) * 100);
  return <Page title="Analytics" sub="Understand how visitors use your assistants."><div className="metric-grid analytics-metrics"><article className="metric-card"><div className="metric-top"><span><MessageSquare size={18} /></span></div><strong>{data?.conversations || 0}</strong><b>Total conversations</b><small>Across all published agents</small></article><article className="metric-card"><div className="metric-top"><span><Activity size={18} /></span></div><strong>{data?.messages || 0}</strong><b>Total messages</b><small>User and assistant messages</small></article><article className="metric-card"><div className="metric-top"><span><Users size={18} /></span></div><strong>{leadRate}%</strong><b>Lead conversion</b><small>Leads per conversation</small></article><article className="metric-card"><div className="metric-top"><span><BookOpen size={18} /></span></div><strong>{data?.sources || 0}</strong><b>Knowledge sources</b><small>Available across agents</small></article></div><section className="surface chart-surface analytics-chart"><div className="surface-heading"><div><h3>Conversation trend</h3><p>See daily assistant usage over the last 14 days.</p></div><span className="quiet-chip">14 days</span></div><Bars daily={data?.daily || []} /></section></Page>;
}

function Integrations() {
  const [items, setItems] = useState<any[]>([]); useEffect(() => { api<any>('/api/integrations').then(d => setItems(d.integrations)); }, []);
  async function toggle(provider: string, enabled: boolean) { await api(`/api/integrations/${provider}`, { method: 'PUT', body: JSON.stringify({ enabled }) }); setItems(v => v.map(x => x.provider === provider ? { ...x, enabled } : x)); }
  const meta: Record<string, { letter: string; desc: string }> = { whatsapp: { letter: 'W', desc: 'Connect your WhatsApp Business channel to the workspace.' }, zoho: { letter: 'Z', desc: 'Keep chatbot leads ready for your Zoho CRM workflow.' }, webhook: { letter: '{}', desc: 'Connect your backend workflow with webhook delivery.' } };
  return <Page title="Integrations" sub="Connect your chatbot workflow to the tools you already use."><div className="integration-grid">{items.map(item => <article className="surface integration-card" key={item.provider}><div className={`integration-logo ${item.provider}`}>{meta[item.provider]?.letter}</div><div><h3>{item.label}</h3><p>{meta[item.provider]?.desc}</p></div><label className="toggle"><input type="checkbox" checked={item.enabled} onChange={e => toggle(item.provider, e.target.checked)} /><span /></label><div className="integration-status"><i className={item.enabled ? 'connected' : ''} />{item.enabled ? 'Enabled' : 'Not connected'}</div></article>)}</div></Page>;
}

function Deploy() {
  const [agents, setAgents] = useState<Agent[]>([]); const [agentId, setAgentId] = useState(''); const [copied, setCopied] = useState(false); useEffect(() => { api<any>('/api/agents').then(d => { setAgents(d.agents); if (d.agents[0]) setAgentId(d.agents[0].id); }); }, []); const agent = agents.find(a => a.id === agentId); const snippet = agent ? `<script src="${window.location.origin}/widget.js" data-agent="${agent.publicId}" async></script>` : '';
  async function copy() { if (!snippet) return; await navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1600); }
  return <Page title="Deploy" sub="Publish your agent and add it to your website." actions={<select className="agent-select" value={agentId} onChange={e => setAgentId(e.target.value)}>{agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>}><div className="deploy-layout"><section className="surface deploy-steps"><div className="deploy-step"><span>1</span><div><h3>Publish your agent</h3><p>Your widget only works while the selected agent is live.</p>{agent && <span className={`status-badge ${agent.status}`}><i />{agent.status === 'live' ? 'Live' : 'Draft'}</span>}</div></div><div className="deploy-step"><span>2</span><div><h3>Copy the install snippet</h3><p>Paste this code before the closing <code>&lt;/body&gt;</code> tag on your website.</p><div className="code-block"><code>{snippet || 'Create an agent first to generate a snippet.'}</code><button className="icon-button" onClick={copy} disabled={!snippet}>{copied ? <Check size={16} /> : <Copy size={16} />}</button></div></div></div><div className="deploy-step"><span>3</span><div><h3>Test on your website</h3><p>Open the page, click the floating chatbot button and send a test message.</p></div></div></section><aside className="surface deploy-preview"><span className="preview-label">Widget preview</span><div className="browser-preview"><div className="browser-bar"><i /><i /><i /><span>yourwebsite.com</span></div><div className="browser-content"><div className="skeleton"><b /><b /><b /><i /><i /><i /></div>{agent && <button className="floating-preview" style={{ background: agent.primaryColor }}><Sparkles size={20} /></button>}</div></div><p>The widget automatically uses your selected brand color and position.</p></aside></div></Page>;
}

function WorkspaceSettings() {
  const [form, setForm] = useState({ name: '', supportEmail: '', timezone: 'UTC' }); const [saved, setSaved] = useState(false); const [error, setError] = useState(''); useEffect(() => { api<any>('/api/workspace/settings').then(d => setForm(d.settings)); }, []);
  async function save(e: FormEvent) { e.preventDefault(); setError(''); try { const d = await api<any>('/api/workspace/settings', { method: 'PUT', body: JSON.stringify(form) }); setForm(d.settings); setSaved(true); setTimeout(() => setSaved(false), 1600); } catch (err: any) { setError(err.message); } }
  return <Page title="Settings" sub="Manage your workspace details and support identity."><form className="surface settings-form" onSubmit={save}><div className="settings-section"><div><h3>Workspace details</h3><p>These settings help identify your chatbot workspace.</p></div><div className="settings-fields"><label>Workspace name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} minLength={2} required /></label><label>Support email<input type="email" value={form.supportEmail} onChange={e => setForm({ ...form, supportEmail: e.target.value })} placeholder="support@company.com" /></label><label>Timezone<select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}><option value="UTC">UTC</option><option value="Asia/Kolkata">Asia/Kolkata</option><option value="America/New_York">America/New_York</option><option value="Europe/London">Europe/London</option><option value="Asia/Singapore">Asia/Singapore</option></select></label></div></div>{error && <div className="form-error">{error}</div>}<div className="settings-actions"><button className="primary-button small">{saved ? <><Check size={15} /> Saved</> : 'Save changes'}</button></div></form></Page>;
}

function Widget() {
  const { publicId } = useParams(); const [agent, setAgent] = useState<any>(null); const [messages, setMessages] = useState<any[]>([]); const [message, setMessage] = useState(''); const [conversationId, setConversationId] = useState<string | undefined>(); const [busy, setBusy] = useState(false); const [leadOpen, setLeadOpen] = useState(false); const [lead, setLead] = useState({ name: '', email: '', phone: '' }); const [leadSent, setLeadSent] = useState(false);
  useEffect(() => { api<any>(`/api/public/agents/${publicId}`).then(d => setAgent(d.agent)).catch(() => setAgent(false)); }, [publicId]);
  async function send(e: FormEvent) { e.preventDefault(); if (!message.trim() || busy) return; const text = message.trim(); setMessages(v => [...v, { role: 'user', content: text }]); setMessage(''); setBusy(true); try { const d = await api<any>(`/api/public/chat/${publicId}`, { method: 'POST', body: JSON.stringify({ conversationId, message: text }) }); setConversationId(d.conversationId); setMessages(v => [...v, d.message]); } catch (err: any) { setMessages(v => [...v, { role: 'assistant', content: err.message }]); } finally { setBusy(false); } }
  async function sendLead(e: FormEvent) { e.preventDefault(); await api(`/api/public/leads/${publicId}`, { method: 'POST', body: JSON.stringify(lead) }); setLeadSent(true); }
  if (agent === null) return <Loading />; if (agent === false) return <div className="widget-unavailable"><Bot size={28} /><b>Chatbot unavailable</b><p>This assistant is not currently live.</p></div>;
  return <div className="widget-page" style={{ '--agent-color': agent.primaryColor } as any}><header><span><Sparkles size={17} /></span><div><b>{agent.name}</b><small><i /> Online</small></div><button className="icon-button" onClick={() => setLeadOpen(v => !v)}><UserRound size={17} /></button></header>{leadOpen ? <div className="widget-lead">{leadSent ? <div className="lead-success"><CheckCircle2 size={28} /><h3>Thanks!</h3><p>Your details have been received.</p><button className="secondary-button compact" onClick={() => setLeadOpen(false)}>Back to chat</button></div> : <form onSubmit={sendLead}><h3>Share your details</h3><p>Leave your contact information and the team can follow up.</p><label>Name<input value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} required minLength={2} /></label><label>Email<input type="email" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} required /></label><label>Phone <small>(optional)</small><input value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} /></label><button className="primary-button full">Send details</button></form>}</div> : <><main><div className="assistant-message">{agent.greeting}</div>{messages.map((m, i) => <div key={i} className={m.role === 'user' ? 'visitor-message' : 'assistant-message'}>{m.content}</div>)}{busy && <div className="assistant-message typing"><i /><i /><i /></div>}</main><form className="widget-input" onSubmit={send}><input placeholder="Type your message..." value={message} onChange={e => setMessage(e.target.value)} /><button disabled={busy}><Send size={16} /></button></form><small className="powered">Powered by <b>Chatbot.io</b></small></>}</div>;
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined); const location = useLocation();
  useEffect(() => { if (location.pathname.startsWith('/widget/')) { setUser(null); return; } api<any>('/api/auth/me').then(d => setUser(d.user)).catch(() => setUser(null)); }, [location.pathname.startsWith('/widget/')]);
  if (location.pathname.startsWith('/widget/')) return <Routes><Route path="/widget/:publicId" element={<Widget />} /></Routes>;
  if (user === undefined) return <div className="app-loading"><Brand /><span /></div>;
  return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={user ? <Navigate to="/app" replace /> : <Auth mode="login" />} /><Route path="/signup" element={user ? <Navigate to="/app" replace /> : <Auth mode="signup" />} /><Route path="/app/*" element={user ? <Shell user={user} setUser={setUser} /> : <Navigate to="/login" replace />} /><Route path="*" element={<Navigate to={user ? '/app' : '/'} replace />} /></Routes>;
}
