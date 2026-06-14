import React, { useState } from 'react';
import { 
  Shield, Clock, AlertTriangle, CheckCircle, FileText, User, 
  ArrowLeft, Plus, Send, ShieldAlert, Sparkles, Network, Database, ChevronRight, Activity
} from 'lucide-react';

interface CaseNote {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Investigating' | 'Remediated' | 'Resolved';
  assignee: string;
  time: string;
  description: string;
  sourceIp: string;
  targetIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'DNS';
  pcapSignature: string;
  mitigationAdvised: string;
  alertVolume: number;
  notes: CaseNote[];
}

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    { 
      id: 'INC-7041', 
      title: 'Suspected DNS Tunneling', 
      severity: 'High', 
      status: 'Investigating', 
      assignee: 'Auto-Triage', 
      time: '10m ago',
      description: 'An anomalous outbound protocol pattern was detected on port 53. Payload packets contain asymmetric sub-domain payloads indicating potential recursive data encapsulation and exfiltration of sensitive server configurations.',
      sourceIp: '185.34.12.82',
      targetIp: '10.155.1.40',
      protocol: 'DNS',
      pcapSignature: 'dns_encap_tunnel_v18',
      mitigationAdvised: 'Enforce DNSSEC filtering, scale rate limiters on firewall gateway router, and block suspicious external resolvers.',
      alertVolume: 1420,
      notes: [
        { id: '1', author: 'Nexus SecOps', time: '8m ago', text: 'Automatic ingestion captured continuous query sequences mapping out non-existent domains. Initial threshold tripped.' },
        { id: '2', author: 'Auto-Triage', time: '5m ago', text: 'Correlated the external resource IP against Tor Exit list. Matched Positive.' }
      ]
    },
    { 
      id: 'INC-7042', 
      title: 'Multiple Failed SSH Auth', 
      severity: 'Medium', 
      status: 'Open', 
      assignee: 'Unassigned', 
      time: '25m ago',
      description: 'Excessive password validation errors from root attempts on primary SSH interfaces within a 2-second time window.',
      sourceIp: '43.250.2.14',
      targetIp: '192.168.1.100',
      protocol: 'TCP',
      pcapSignature: 'ssh_bruteforce_dictionary',
      mitigationAdvised: 'Transition authentication schema immediately to SSH Key-Only authentication and trigger automated host banning rules.',
      alertVolume: 350,
      notes: [
        { id: '1', author: 'System Sentinel', time: '20m ago', text: 'Tripped pam_tally2 threshold: 45 authentication failures in immediate succession.' }
      ]
    },
    { 
      id: 'INC-7033', 
      title: 'DDoS SYN Flood Vector', 
      severity: 'Critical', 
      status: 'Resolved', 
      assignee: 'Nexus AI', 
      time: '2h ago',
      description: 'Massive volumetric flood of TCP SYN packets with randomized source ports saturating available server listening sockets.',
      sourceIp: 'Multiple Botnet IPs',
      targetIp: '10.155.1.15',
      protocol: 'TCP',
      pcapSignature: 'tcp_syn_flood_volumetric',
      mitigationAdvised: 'Deploy Rate Limiting WAF rules at router ingress and activate SYN cookies protection at kernel levels.',
      alertVolume: 43200,
      notes: [
        { id: '1', author: 'Nexus AI', time: '1.5h ago', text: 'Dynamic traffic flow monitoring identified the threat signature. Rate-limiter mitigation rules generated and deployed automatically.' },
        { id: '2', author: 'Nexus AI', time: '1h ago', text: 'Port saturation dropped below critical thresholds. Flow rate normalized. Case updated to Remediation confirmed.' }
      ]
    },
    { 
      id: 'INC-7019', 
      title: 'Malware Exfiltration Beacon', 
      severity: 'High', 
      status: 'Resolved', 
      assignee: 'John Doe', 
      time: '1d ago',
      description: 'Outbound HTTP beacons containing encrypted metadata payloads calling home to suspicious malicious command and control (C2) domains.',
      sourceIp: '192.168.1.112',
      targetIp: '198.51.100.41',
      protocol: 'HTTP',
      pcapSignature: 'c2_beacon_malware_payload',
      mitigationAdvised: 'Isolate compromised guest network node, run deep endpoint antivirus sweep, and update payload DPI filters.',
      alertVolume: 122,
      notes: [
        { id: '1', author: 'John Doe', time: '20h ago', text: 'Isolated network device on port FE-0/2. Executed complete sandbox forensics report. Malware footprint neutralized.' }
      ]
    },
  ]);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New incident form states
  const [formTitle, setFormTitle] = useState('');
  const [formSeverity, setFormSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [formDesc, setFormDesc] = useState('');
  const [formSrcIp, setFormSrcIp] = useState('');
  const [formDstIp, setFormDstIp] = useState('');
  const [formProto, setFormProto] = useState<'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'DNS'>('TCP');

  const addNote = (incidentId: string) => {
    if (!newNoteText.trim()) return;
    
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newNote: CaseNote = {
          id: Date.now().toString(),
          author: 'SecOps Analyst (You)',
          time: 'Just now',
          text: newNoteText
        };
        return {
          ...inc,
          notes: [...inc.notes, newNote]
        };
      }
      return inc;
    }));

    // Keep active viewing incident in sync
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? {
        ...prev,
        notes: [...prev.notes, {
          id: Date.now().toString(),
          author: 'SecOps Analyst (You)',
          time: 'Just now',
          text: newNoteText
        }]
      } : null);
    }

    setNewNoteText('');
  };

  const updateStatus = (incidentId: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const updateAssignee = (incidentId: string, newAssignee: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, assignee: newAssignee };
      }
      return inc;
    }));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, assignee: newAssignee } : null);
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInc: Incident = {
      id: newId,
      title: formTitle,
      severity: formSeverity,
      status: 'Open',
      assignee: 'Unassigned',
      time: 'Just now',
      description: formDesc || 'Manual incident log generated in tactical SOC interface.',
      sourceIp: formSrcIp || '192.168.1.1',
      targetIp: formDstIp || '10.155.1.20',
      protocol: formProto,
      pcapSignature: `manual_trace_${newId.toLowerCase()}`,
      mitigationAdvised: 'Perform physical trace and review packet payload records.',
      alertVolume: 1,
      notes: [{ id: '1', author: 'System Dispatcher', time: 'Just now', text: 'Incident registered manually in the tactical operator queue.' }]
    };

    setIncidents(prev => [newInc, ...prev]);
    setShowCreateModal(false);
    
    // Clear fields
    setFormTitle('');
    setFormDesc('');
    setFormSrcIp('');
    setFormDstIp('');
    setFormSeverity('High');
  };

  // Compute live aggregates from incidents
  const totalCases = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const investigatings = incidents.filter(i => i.status === 'Investigating').length;
  const resolveds = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="h-full flex flex-col glass-panel rounded-lg border border-gray-800 p-6 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-600 to-emerald-500"></div>

      {selectedIncident ? (
        /* CASE VIEWER DETAIL SCREEN */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800 shrink-0">
            <button 
              onClick={() => setSelectedIncident(null)}
              className="flex items-center text-sm font-mono text-gray-400 hover:text-cyan-400 transition-colors bg-gray-900/60 hover:bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft size={16} className="mr-2" /> Return to Threat Queue
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-500">Incident Lifecycle Context</span>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
            {/* Left Box: Investigation Scope, Vectors & Meta */}
            <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-1">
              {/* Title & Stats block */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded">
                      {selectedIncident.id}
                    </span>
                    <h3 className="text-xl font-bold text-gray-100 mt-2">{selectedIncident.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
                    selectedIncident.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                    selectedIncident.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                    selectedIncident.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {selectedIncident.severity} Severity
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  {selectedIncident.description}
                </p>

                {/* Packet Forensic Details */}
                <div className="grid grid-cols-2 gap-4 mt-5 p-3.5 bg-gray-900/60 rounded-lg border border-gray-800/80">
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Forensic Source</div>
                    <div className="text-sm font-semibold font-mono text-gray-350">{selectedIncident.sourceIp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Target Vector</div>
                    <div className="text-sm font-semibold font-mono text-cyan-400">{selectedIncident.targetIp}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Protocol Trace</div>
                    <div className="text-xs font-semibold text-gray-300 font-mono">{selectedIncident.protocol} (Capture Signature)</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Payload Encrypted Sig</div>
                    <div className="text-xs font-semibold text-fuchsia-400 font-mono">{selectedIncident.pcapSignature}</div>
                  </div>
                </div>
              </div>

              {/* Recommended Action & Policy Mitigation */}
              <div className="bg-gray-950 border border-emerald-500/10 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/60"></div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center mb-2 font-mono">
                   <ShieldAlert size={14} className="mr-2" /> Prescribed Countermeasure Guidance
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  These dynamic mitigating controls reduce host vulnerability during active threat streams:
                </p>
                <div className="bg-emerald-950/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-300 text-xs font-mono leading-normal">
                   {selectedIncident.mitigationAdvised}
                </div>
              </div>

              {/* Active Control Action Board */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                 <h4 className="text-xs uppercase tracking-widest font-bold text-gray-300 mb-4 font-mono flex items-center">
                    <Activity size={14} className="mr-2 text-cyan-400" /> Operational Control Room Actions
                 </h4>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] text-gray-500 font-mono block mb-1 uppercase">Modify Case Status</label>
                       <select 
                          value={selectedIncident.status}
                          onChange={(e) => updateStatus(selectedIncident.id, e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-500"
                       >
                          <option value="Open">🔴 Open (Triage Queue)</option>
                          <option value="Investigating">🟡 Investigating (Active Sandbox)</option>
                          <option value="Remediated">🟢 Remediated (Countermeasures set)</option>
                          <option value="Resolved">🔵 Resolved (Lifecycle Complete)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-500 font-mono block mb-1 uppercase">Change Investigator</label>
                       <select 
                          value={selectedIncident.assignee}
                          onChange={(e) => updateAssignee(selectedIncident.id, e.target.value)}
                          className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-500"
                       >
                          <option value="Unassigned">👤 Unassigned</option>
                          <option value="John Doe">👤 John Doe (T-1 Ops)</option>
                          <option value="Auto-Triage">🤖 Auto-Triage Agent</option>
                          <option value="Nexus AI">✨ Nexus Cyber AI</option>
                       </select>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Box: Live Activity logs, Forensics Notes Feed */}
            <div className="lg:col-span-5 flex flex-col h-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
               <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center shrink-0">
                  <span className="text-xs font-mono font-bold tracking-wider text-gray-300 flex items-center">
                     <FileText size={13} className="mr-1.5 text-cyan-400" /> Analyst Investigation Log
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                     {selectedIncident.notes.length} history checkpoints
                  </span>
               </div>

               {/* Stream of comments/events */}
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedIncident.notes.map((note) => (
                     <div key={note.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 relative">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-bold text-cyan-400 font-mono flex items-center">
                              <Sparkles size={10} className="mr-1 text-fuchsia-400" /> {note.author}
                           </span>
                           <span className="text-[9px] text-gray-500 font-mono">{note.time}</span>
                        </div>
                        <p className="text-xs text-gray-300 font-mono leading-relaxed select-text">
                           {note.text}
                        </p>
                     </div>
                  ))}
               </div>

               {/* Form to submit custom log note */}
               <div className="p-3.5 bg-gray-900/60 border-t border-gray-800 shrink-0 flex gap-2">
                  <input 
                     type="text" 
                     placeholder="Deploy network isolation rule, check signatures..."
                     value={newNoteText}
                     onChange={(e) => setNewNoteText(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') addNote(selectedIncident.id);
                     }}
                     className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                     onClick={() => addNote(selectedIncident.id)}
                     className="bg-cyan-600 hover:bg-cyan-500 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
                     title="Submit Analysis Note"
                  >
                     <Send size={14} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* DISPATCH QUEUE MAIN SCREEN */
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
               <h2 className="text-xl font-bold flex items-center text-gray-250">
                 <Shield className="mr-2 text-cyan-400" /> Tactical Incident Commander
               </h2>
               <p className="text-xs text-gray-500 mt-0.5">Filter, audit, and investigate raw network anomaly triggers dispatched from system firewalls.</p>
            </div>
            <button 
               onClick={() => setShowCreateModal(true)}
               className="px-3.5 py-1.5 bg-cyan-600/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono hover:bg-cyan-600/40 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> MANUAL INTAKE REPORT
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6 shrink-0">
             <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-wider">Dispatched Threats</div>
                <div className="text-2xl font-bold text-gray-150 font-mono">{totalCases}</div>
             </div>
             <div className="bg-gray-900/40 p-4 rounded-xl border border-red-950/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1">
                   <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                </div>
                <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-wider">Critical Priority</div>
                <div className="text-2xl font-bold text-red-500 font-mono">{criticalCount}</div>
             </div>
             <div className="bg-gray-900/40 p-4 rounded-xl border border-yellow-950/30">
                <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-wider">Active Sandbox</div>
                <div className="text-2xl font-bold text-yellow-500 font-mono">{investigatings}</div>
             </div>
             <div className="bg-gray-900/40 p-4 rounded-xl border border-emerald-950/30">
                <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-wider">Remediated & Closed</div>
                <div className="text-2xl font-bold text-emerald-500 font-mono">{resolveds}</div>
             </div>
          </div>

          <div className="flex-1 overflow-auto rounded-xl border border-gray-800 bg-gray-950">
            <table className="w-full text-left text-xs whitespace-nowrap table-fixed">
              <thead className="bg-gray-900/80 text-gray-400 font-mono text-xs border-b border-gray-800 sticky top-0 z-10 backdrop-blur">
                <tr>
                  <th className="px-5 py-3 font-medium w-24">ID</th>
                  <th className="px-5 py-3 font-medium w-48">Threat Title</th>
                  <th className="px-5 py-3 font-medium w-24">Severity</th>
                  <th className="px-5 py-3 font-medium w-36">Investigation State</th>
                  <th className="px-5 py-3 font-medium w-32">Assignee</th>
                  <th className="px-5 py-3 font-medium w-24">Timestamp</th>
                  <th className="px-5 py-3 font-medium w-28 text-center">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-5 py-4.5 font-mono text-cyan-400 font-bold">{inc.id}</td>
                    <td className="px-5 py-4.5 text-gray-200 font-medium truncate">
                       <span className="block font-semibold text-gray-200 truncate">{inc.title}</span>
                       <span className="block text-[10px] font-mono text-gray-500 mt-1 truncate">sig: {inc.pcapSignature}</span>
                    </td>
                    <td className="px-5 py-4.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        inc.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                        inc.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                        inc.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4.5 text-gray-400">
                       <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          {inc.status === 'Resolved' && <CheckCircle size={13} className="text-emerald-500"/>}
                          {inc.status === 'Remediated' && <CheckCircle size={13} className="text-cyan-400"/>}
                          {inc.status === 'Investigating' && <Clock size={13} className="text-yellow-500 animate-pulse" />}
                          {inc.status === 'Open' && <AlertTriangle size={13} className="text-red-500"/>}
                          <span className={
                             inc.status === 'Resolved' ? 'text-emerald-400' :
                             inc.status === 'Remediated' ? 'text-cyan-400' :
                             inc.status === 'Investigating' ? 'text-yellow-500' : 'text-red-500'
                          }>{inc.status}</span>
                       </div>
                    </td>
                    <td className="px-5 py-4.5 text-gray-300 font-mono">
                       <div className="flex items-center gap-2">
                          <User size={13} className="text-gray-500" /> {inc.assignee}
                       </div>
                    </td>
                    <td className="px-5 py-4.5 text-gray-500 font-mono">{inc.time}</td>
                    <td className="px-5 py-4.5 text-center">
                       <button 
                         onClick={() => setSelectedIncident(inc)}
                         className="mx-auto text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-600 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase font-mono flex items-center justify-center gap-1 transition-all"
                       >
                          <FileText size={12}/> View Case
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MANUAL INCIDENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
           <form 
             onSubmit={handleCreateIncident}
             className="bg-gray-950 border border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl relative"
           >
              <div className="absolute inset-x-0 top-0 h-1 bg-cyan-500"></div>
              
              <div className="p-5 border-b border-gray-800">
                 <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-400 flex items-center">
                    <ShieldAlert size={16} className="mr-2" /> Register Anomaly Triggers
                 </h3>
                 <p className="text-[11px] text-gray-400 mt-1">Submit high-integrity alerts manually to active Security Command Center rosters.</p>
              </div>

              <div className="p-5 space-y-3.5">
                 <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Vulnerability / Incident Name</label>
                    <input 
                       type="text" 
                       value={formTitle}
                       onChange={(e) => setFormTitle(e.target.value)}
                       placeholder="e.g. Host-Based Remote Code Execution attempt"
                       required
                       className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Severity</label>
                       <select 
                          value={formSeverity}
                          onChange={(e) => setFormSeverity(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                       >
                          <option value="Critical">🚨 Critical</option>
                          <option value="High">🟠 High Risk</option>
                          <option value="Medium">🟡 Medium Scope</option>
                          <option value="Low">🔵 Informational</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Observed Protocol</label>
                       <select 
                          value={formProto}
                          onChange={(e) => setFormProto(e.target.value as any)}
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                       >
                          <option value="TCP">TCP</option>
                          <option value="UDP">UDP</option>
                          <option value="DNS">DNS</option>
                          <option value="HTTP">HTTP</option>
                          <option value="ICMP">ICMP</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Attacking IP Source</label>
                       <input 
                          type="text" 
                          value={formSrcIp}
                          onChange={(e) => setFormSrcIp(e.target.value)}
                          placeholder="84.221.12.9"
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 font-mono"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Destination Host Target</label>
                       <input 
                          type="text" 
                          value={formDstIp}
                          onChange={(e) => setFormDstIp(e.target.value)}
                          placeholder="10.155.1.20"
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 font-mono"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase">Detailed Description & Forensic Clues</label>
                    <textarea 
                       value={formDesc}
                       onChange={(e) => setFormDesc(e.target.value)}
                       rows={3}
                       placeholder="Captured malformed request envelopes transiting WAN gateway interfaces..."
                       className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                 </div>
              </div>

              <div className="p-4 bg-gray-900/60 border-t border-gray-800 flex justify-end gap-3.5">
                 <button 
                   type="button"
                   onClick={() => setShowCreateModal(false)}
                   className="px-3.5 py-1.5 rounded-lg border border-gray-800 bg-gray-950 text-gray-400 text-xs hover:bg-gray-900 hover:text-white"
                 >
                    Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                 >
                    Publish to System Queue
                 </button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};
