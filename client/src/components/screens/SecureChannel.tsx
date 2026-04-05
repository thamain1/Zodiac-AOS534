import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { ChannelRecord } from '../../types';
import { TruthBadge } from '../shared/TruthBadge';

const STATUS_STYLES: Record<ChannelRecord['status'], { dot: string; text: string; bg: string; border: string }> = {
  healthy:   { dot: 'bg-verified',  text: 'text-verified', bg: 'bg-verified/10',  border: 'border-verified/20' },
  degraded:  { dot: 'bg-warning',   text: 'text-warning',  bg: 'bg-warning/10',   border: 'border-warning/20'  },
  expired:   { dot: 'bg-critical',  text: 'text-critical', bg: 'bg-critical/10',  border: 'border-critical/20' },
  untrusted: { dot: 'bg-critical',  text: 'text-critical', bg: 'bg-critical/10',  border: 'border-critical/20' },
  plaintext: { dot: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-700/20', border: 'border-slate-600/20' },
};

const PROTOCOL_COLORS: Record<string, string> = {
  mTLS:       'text-teal-400   bg-teal-400/10   border-teal-400/20',
  TLS:        'text-blue-400   bg-blue-400/10   border-blue-400/20',
  plaintext:  'text-red-400    bg-red-400/10    border-red-400/20',
};

const TRUST_COLORS: Record<string, string> = {
  trusted:   'text-verified',
  partial:   'text-warning',
  untrusted: 'text-critical',
  unknown:   'text-slate-400',
};

function daysUntilExpiry(expiry?: string): number | null {
  if (!expiry) return null;
  return Math.round((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function CertExpiryBadge({ expiry }: { expiry?: string }) {
  const days = daysUntilExpiry(expiry);
  if (days === null) return <span className="text-[9px] text-slate-600">No cert</span>;
  const color = days < 30 ? 'text-critical' : days < 60 ? 'text-warning' : 'text-verified';
  return <span className={`text-[9px] font-mono ${color}`}>{days}d</span>;
}

function SpiffeIdDisplay({ id, label }: { id?: string; label: string }) {
  if (!id) return (
    <div>
      <div className="text-[9px] text-slate-500 mb-0.5">{label}</div>
      <span className="text-[9px] text-slate-600 italic">Not attested</span>
    </div>
  );
  const parts = id.split('/');
  return (
    <div>
      <div className="text-[9px] text-slate-500 mb-0.5">{label}</div>
      <div className="text-[9px] font-mono text-teal-300 bg-teal-500/10 px-2 py-1 rounded break-all leading-relaxed">
        {id}
      </div>
      <div className="text-[9px] text-slate-500 mt-0.5">SA: {parts[parts.length - 1]}</div>
    </div>
  );
}

function TrustChain({ channel }: { channel: ChannelRecord }) {
  const steps = [
    { label: 'Protocol',       value: channel.protocol,       ok: channel.protocol === 'mTLS' },
    { label: 'TLS Version',    value: channel.tls_version ?? 'N/A', ok: channel.tls_version === 'TLS 1.3' },
    { label: 'SPIRE Attested', value: channel.spire_attested ? 'Yes' : 'No', ok: channel.spire_attested },
    { label: 'SPIFFE Source',  value: channel.spiffe_id_source ? 'Present' : 'Absent', ok: !!channel.spiffe_id_source },
    { label: 'SPIFFE Dest',    value: channel.spiffe_id_dest   ? 'Present' : 'Absent', ok: !!channel.spiffe_id_dest },
    { label: 'Cert Valid',     value: channel.cert_expiry ? `${daysUntilExpiry(channel.cert_expiry)}d` : 'No cert', ok: (daysUntilExpiry(channel.cert_expiry) ?? 0) > 7 },
    { label: 'PQC Ready',      value: channel.pqc_ready ? 'Yes' : 'No', ok: channel.pqc_ready, roadmap: !channel.pqc_ready },
  ];

  return (
    <div className="rounded border border-navy-700 bg-navy-800/60 p-3">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Trust Chain Validation</div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${
              step.roadmap ? 'bg-purple-500/20 text-purple-400' :
              step.ok ? 'bg-verified/20 text-verified' : 'bg-critical/20 text-critical'
            }`}>
              {step.roadmap ? 'R' : step.ok ? '✓' : '✗'}
            </div>
            <span className="text-[10px] text-slate-400 w-28 flex-shrink-0">{step.label}</span>
            <span className={`text-[10px] font-mono ${
              step.roadmap ? 'text-purple-400' :
              step.ok ? 'text-verified' : 'text-critical'
            }`}>
              {step.value}
            </span>
            {step.roadmap && <TruthBadge label="roadmap" />}
          </div>
        ))}
      </div>
    </div>
  );
}

type FilterMode = 'all' | 'healthy' | 'degraded' | 'plaintext';

export function SecureChannel() {
  const [channels, setChannels] = useState<ChannelRecord[]>([]);
  const [selected, setSelected] = useState<ChannelRecord | null>(null);
  const [filter,   setFilter]   = useState<FilterMode>('all');

  const load = useCallback(async () => {
    try {
      const res = await api.channels.list();
      setChannels(res.data);
      setSelected(res.data.find(c => c.status !== 'healthy') ?? res.data[0]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = channels.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'healthy')   return c.status === 'healthy';
    if (filter === 'degraded')  return c.status === 'degraded' || c.status === 'expired' || c.status === 'untrusted';
    if (filter === 'plaintext') return c.status === 'plaintext';
    return true;
  });

  const mtlsCount     = channels.filter(c => c.protocol === 'mTLS').length;
  const spireCount    = channels.filter(c => c.spire_attested).length;
  const plaintextCount = channels.filter(c => c.protocol === 'plaintext').length;
  const degradedCount  = channels.filter(c => c.status !== 'healthy').length;
  const expiringCount  = channels.filter(c => {
    const d = daysUntilExpiry(c.cert_expiry);
    return d !== null && d < 30;
  }).length;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Channel List ────────────────────────────────────────────── */}
      <div className="w-72 border-r border-navy-700 flex flex-col">
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">Secure Channel Visibility</span>
            <span className="sim-badge">Simulated</span>
          </div>
          <div className="text-[10px] text-slate-500">
            mTLS · PQC · SPIFFE / SPIRE — {channels.length} channels
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-navy-700">
          {[
            { label: 'mTLS',      value: mtlsCount,      color: 'text-teal-400' },
            { label: 'SPIRE',     value: spireCount,     color: 'text-teal-400' },
            { label: 'Plaintext', value: plaintextCount, color: plaintextCount > 0 ? 'text-critical' : 'text-verified' },
          ].map(m => (
            <div key={m.label} className="p-2 text-center border-r border-navy-700 last:border-0">
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Alerts strip */}
        {(degradedCount > 0 || expiringCount > 0) && (
          <div className="flex gap-2 p-2 border-b border-navy-700">
            {degradedCount > 0 && (
              <div className="flex-1 rounded bg-warning/10 border border-warning/20 px-2 py-1 text-center">
                <div className="text-[11px] font-bold text-warning">{degradedCount}</div>
                <div className="text-[8px] text-slate-500">Degraded</div>
              </div>
            )}
            {expiringCount > 0 && (
              <div className="flex-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-center">
                <div className="text-[11px] font-bold text-amber-400">{expiringCount}</div>
                <div className="text-[8px] text-slate-500">Expiring &lt;30d</div>
              </div>
            )}
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-1 p-2 border-b border-navy-700">
          {(['all', 'healthy', 'degraded', 'plaintext'] as FilterMode[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 text-[9px] py-1 rounded capitalize transition-colors ${
                filter === f ? 'bg-teal-600 text-white font-semibold' : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >{f}</button>
          ))}
        </div>

        {/* Channel list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(ch => {
            const st = STATUS_STYLES[ch.status];
            const isSelected = selected?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => setSelected(ch)}
                className={`p-3 border-b border-navy-800 cursor-pointer transition-colors ${
                  isSelected ? 'bg-navy-700 border-l-2 border-l-teal-500' : 'hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                  <span className="text-[10px] font-semibold text-white truncate">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${PROTOCOL_COLORS[ch.protocol]}`}>
                    {ch.protocol}
                  </span>
                  <span className={`text-[9px] ${TRUST_COLORS[ch.trust_level]}`}>{ch.trust_level}</span>
                  {ch.pqc_ready && <span className="text-[8px] text-purple-400 border border-purple-400/30 px-1 py-0.5 rounded">PQC</span>}
                </div>
                <div className="flex items-center gap-3 text-[9px] text-slate-500">
                  <span>Cert: <CertExpiryBadge expiry={ch.cert_expiry} /></span>
                  <span>SPIRE: <span className={ch.spire_attested ? 'text-verified' : 'text-slate-600'}>{ch.spire_attested ? '✓' : '✗'}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: Channel Detail ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-bold text-white mb-1">{selected.name}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${PROTOCOL_COLORS[selected.protocol]}`}>
                    {selected.protocol}
                  </span>
                  <span className={`text-[10px] font-semibold ${STATUS_STYLES[selected.status].text}`}>
                    {selected.status.toUpperCase()}
                  </span>
                  <TruthBadge label={selected.truth_label} />
                </div>
              </div>
            </div>

            {/* Workload identities */}
            <div className="rounded border border-navy-700 bg-navy-800/60 p-4 mb-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">SPIFFE / SPIRE Workload Identity</div>
              <div className="grid grid-cols-2 gap-4">
                <SpiffeIdDisplay id={selected.spiffe_id_source} label="Source SPIFFE ID" />
                <SpiffeIdDisplay id={selected.spiffe_id_dest}   label="Destination SPIFFE ID" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500">SPIRE attested:</span>
                  <span className={`text-[10px] font-semibold ${selected.spire_attested ? 'text-verified' : 'text-critical'}`}>
                    {selected.spire_attested ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500">Trust level:</span>
                  <span className={`text-[10px] font-semibold ${TRUST_COLORS[selected.trust_level]}`}>
                    {selected.trust_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate detail */}
            <div className="rounded border border-navy-700 bg-navy-800/60 p-4 mb-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Certificate</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Protocol',     value: selected.protocol },
                  { label: 'TLS version',  value: selected.tls_version ?? 'N/A' },
                  { label: 'Issuer',       value: selected.cert_issuer ?? 'No cert' },
                  { label: 'Expiry',       value: selected.cert_expiry ? new Date(selected.cert_expiry).toLocaleDateString() : 'N/A' },
                  { label: 'Days left',    value: <CertExpiryBadge expiry={selected.cert_expiry} /> },
                  { label: 'Site',         value: selected.site },
                ].map(row => (
                  <div key={row.label}>
                    <div className="text-[9px] text-slate-500 mb-0.5">{row.label}</div>
                    <div className="text-[10px] text-slate-300">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PQC readiness */}
            <div className={`rounded border p-3 mb-4 ${selected.pqc_ready ? 'border-purple-500/30 bg-purple-500/5' : 'border-navy-700 bg-navy-800/40'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-purple-400">Post-Quantum Cryptography (PQC)</span>
                <TruthBadge label={selected.pqc_ready ? 'simulated' : 'roadmap'} />
              </div>
              <div className={`text-[10px] ${selected.pqc_ready ? 'text-purple-300' : 'text-slate-500'}`}>
                {selected.pqc_ready
                  ? 'This channel is configured for post-quantum key exchange. Quantum-resistant algorithms active.'
                  : 'PQC upgrade not yet applied to this channel. Roadmap feature — planned for future deployment.'}
              </div>
            </div>

            {/* Trust chain */}
            <TrustChain channel={selected} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[11px] text-slate-500">Select a channel to inspect</div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Summary + Degraded callout ─────────────────────────────── */}
      <div className="w-64 border-l border-navy-700 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-navy-700">
          <div className="text-[11px] font-bold text-white mb-1">Channel Summary</div>
          <div className="text-[9px] text-slate-500">Environment: {channels.length} total</div>
        </div>

        {/* Degraded channels callout */}
        <div className="p-3 border-b border-amber-500/20 bg-amber-500/5">
          <div className="text-[10px] font-bold text-amber-400 mb-2">⚠ Degraded Channels</div>
          {channels.filter(c => c.status !== 'healthy').map(ch => (
            <div
              key={ch.id}
              onClick={() => setSelected(ch)}
              className="mb-2 rounded border border-amber-500/20 bg-navy-900/60 p-2 cursor-pointer hover:bg-navy-800 transition-colors"
            >
              <div className="text-[9px] font-semibold text-white">{ch.name}</div>
              <div className={`text-[9px] ${STATUS_STYLES[ch.status].text}`}>{ch.status}</div>
              {ch.status === 'plaintext' && (
                <div className="text-[9px] text-red-400 mt-0.5">No encryption — unacceptable for internal traffic</div>
              )}
            </div>
          ))}
          {channels.filter(c => c.status !== 'healthy').length === 0 && (
            <div className="text-[9px] text-verified">All channels healthy</div>
          )}
        </div>

        {/* Environment secure channel status tie-in */}
        <div className="p-3 border-b border-navy-700">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Environment Status</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span className="text-[10px] text-warning font-semibold">Secure channel: Degraded</span>
          </div>
          <div className="text-[9px] text-slate-500 leading-relaxed">
            Header reports degraded due to {channels.filter(c => c.status !== 'healthy').length} non-healthy channels.
            Plaintext internal traffic detected.
          </div>
        </div>

        {/* PQC roadmap note */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold text-purple-400">PQC Roadmap</span>
            <TruthBadge label="roadmap" />
          </div>
          <div className="text-[9px] text-slate-500 leading-relaxed">
            Post-quantum crypto migration is a planned governance capability. 1 of {channels.length} channels currently PQC-ready (demo).
          </div>
        </div>

        <div className="flex-1 p-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">SPIFFE / SPIRE</div>
          <div className="text-[9px] text-slate-600 leading-relaxed">
            SPIFFE workload identity provides cryptographic proof of workload identity independent of network location. SPIRE is the runtime implementation. AOS534 validates attestation for each channel.
          </div>
        </div>

        <div className="border-t border-navy-700 p-2">
          <TruthBadge label="simulated" />
        </div>
      </div>
    </div>
  );
}
