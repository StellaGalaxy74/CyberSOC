import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, Skull, Activity, ShieldAlert, Crosshair, PlaySquare, 
  Shield, ShieldCheck, ShieldOff, Zap, ZapOff, Server, Terminal, 
  AlertTriangle, Cpu, Database, Play, Square, BadgeAlert, Sparkles, Flame
} from 'lucide-react';
import { Packet } from '../types';
import { TrafficTimeline } from './TrafficTimeline';

export interface AttackSimulatorProps {
  onSimulateAttack: (type: Packet['threatType'], targetIp: string, intensity: number) => void;
  activeAttack: { type: Packet['threatType']; targetIp: string; intensity: number } | null;
  onStopAttack: () => void;
  activeMitigations: string[];
  onToggleMitigation: (mitigationId: string) => void;
  logs: string[];
  historicData: any[];
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({
  onSimulateAttack,
  activeAttack,
  onStopAttack,
  activeMitigations,
  onToggleMitigation,
  logs,
  historicData
}) => {
  const [intensity, setIntensity] = useState(6);
  const [targetIp, setTargetIp] = useState('192.168.1.100');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const attackTypes = [
     { id: 'DDoS Attempt', name: 'SYN Flood / DDoS', desc: 'Saturates target with TCP SYN burst requests.', icon: <Activity size={16} className="text-red-500" /> },
     { id: 'Port Scan', name: 'Stealth Port Scan', desc: 'Probes TCP/UDP ports to discover active services.', icon: <Target size={16} className="text-yellow-500" /> },
     { id: 'Brute Force', name: 'SSH Brute Force', desc: 'Launches automated dictionary attacks targeting SSH.', icon: <Crosshair size={16} className="text-orange-500" /> },
     { id: 'Malware Signature', name: 'Malware Exfiltration', desc: 'Infects local nodes and extracts sensitive payloads.', icon: <Skull size={16} className="text-fuchsia-500" /> },
     { id: 'DNS Poisoning', name: 'DNS Cache Poisoning', desc: 'Injects forged entries to redirect outgoing web requests.', icon: <ShieldAlert size={16} className="text-purple-500" /> },
  ];

  const defensiveMitigations = [
    { 
       id: 'rate_limiter', 
       name: 'Rate Limiting Firewall', 
       desc: 'Mitigates DDoS Floods', 
       tip: 'Limits TCP request frequency per socket.',
       counter: 'DDoS Attempt'
    },
    { 
       id: 'ip_blocklist', 
       name: 'IP Shun / Blocklist', 
       desc: 'Mitigates Port Sweeps', 
       tip: 'Blocks ranges executing rapid connection attempts.',
       counter: 'Port Scan'
    },
    { 
       id: 'key_auth', 
       name: 'Key-Only SSH Creds', 
       desc: 'Mitigates SSH Brute Force', 
       tip: 'Strictly blocks dictionary passwords logins.',
       counter: 'Brute Force'
    },
    { 
       id: 'payload_dpi', 
       name: 'DPI Payload Scan', 
       desc: 'Mitigates Malware leaks', 
       tip: 'Deconstructs and matches signatures on bytes.',
       counter: 'Malware Signature'
    },
    { 
       id: 'dnssec', 
       name: 'DNSSEC Cryto Validation', 
       desc: 'Mitigates DNS Spoofs', 
       tip: 'Enforces digital signature validation on DNS answers.',
       counter: 'DNS Poisoning'
    }
  ];

  // Auto scroll terminal log to top (newest is on top, but we can keep scroll smooth)
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Calculations for simulated telemetry indicators
  const isCurrentlyMitigated = activeAttack 
    ? (activeAttack.type === 'DDoS Attempt' && activeMitigations.includes('rate_limiter')) ||
      (activeAttack.type === 'Port Scan' && activeMitigations.includes('ip_blocklist')) ||
      (activeAttack.type === 'Brute Force' && activeMitigations.includes('key_auth')) ||
      (activeAttack.type === 'Malware Signature' && activeMitigations.includes('payload_dpi')) ||
      (activeAttack.type === 'DNS Poisoning' && activeMitigations.includes('dnssec'))
    : false;

  // Active status text
  const simulationStatus = activeAttack 
    ? (isCurrentlyMitigated ? 'MITIGATED' : 'CRITICAL') 
    : 'MONITORING';

  // Computed live stats inside cyber range
  const computedStats = {
     targetAvailability: activeAttack 
       ? (isCurrentlyMitigated ? 99.8 : Math.max(12.4, 100 - (intensity * 9.2))) 
       : 100.0,
     ingressPps: activeAttack 
       ? (isCurrentlyMitigated 
          ? 50 + Math.floor(Math.random() * 20) 
          : intensity * 350 + Math.floor(Math.random() * 100)) 
       : 12 + Math.floor(Math.random() * 5),
     firewallCpu: activeAttack 
       ? (isCurrentlyMitigated 
          ? 20 + intensity * 6 
          : intensity * 2) 
       : 1 + Math.floor(Math.random() * 2),
     mitigatedCount: activeMitigations.length
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-full text-gray-200">
      {/* CSS Animations Stylesheet */}
      <style>{`
        @keyframes flow-left-to-right {
          0% { left: 10%; opacity: 0; transform: scale(0.6) translateY(-50%); }
          15% { opacity: 1; transform: scale(1) translateY(-50%); }
          85% { opacity: 1; }
          100% { left: 90%; opacity: 0; transform: scale(0.6) translateY(-50%); }
        }
        @keyframes flow-blocked {
          0% { left: 10%; opacity: 0; transform: scale(0.6) translateY(-50%); }
          15% { opacity: 1; transform: scale(1) translateY(-50%); }
          48% { opacity: 1; transform: scale(1.1) translateY(-50%); }
          50% { opacity: 0; transform: scale(1.8) translateY(-50%); filter: saturate(2); }
          100% { left: 50%; opacity: 0; transform: scale(0.6) translateY(-50%); }
        }
        .animate-packet-clean {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #22d3ee; /* Cyan */
          box-shadow: 0 0 8px #22d3ee;
          top: 50%;
          animation: flow-left-to-right 2.2s linear infinite;
        }
        .animate-packet-threat-unmitigated {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #ef4444; /* Red */
          box-shadow: 0 0 10px #ef4444;
          top: 50%;
          animation: flow-left-to-right 1.2s linear infinite;
        }
        .animate-packet-threat-mitigated {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #eab308; /* Yellow */
          box-shadow: 0 0 10px #eab308;
          top: 50%;
          animation: flow-blocked 0.9s linear infinite;
        }
        @keyframes target-pulse-vibrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(0.98) rotate(-1deg) translate(-1px, 1px); }
          40% { transform: scale(1.02) rotate(1deg) translate(1px, -1px); }
          60% { transform: scale(0.99) rotate(-1deg) translate(-1px, -1px); }
          80% { transform: scale(1.01) rotate(1deg) translate(1px, 1px); }
        }
        .server-shaker {
          animation: target-pulse-vibrate 0.15s linear infinite;
        }
        @keyframes ring-expand {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .threat-ring {
          animation: ring-expand 1.4s ease-out infinite;
        }
      `}</style>

      {/* LEFT COLUMN: Controls & Countermeasures */}
      <div className="lg:col-span-5 flex flex-col gap-5 h-full overflow-y-auto">
         
         {/* Live Attack Controller */}
         <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-[#0d1527]/50 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-red-500 flex items-center">
                 <Skull size={14} className="mr-2" /> 1. Launch Intrusion Vectors
              </h3>
              {activeAttack && (
                 <button 
                   onClick={onStopAttack}
                   className="px-2.5 py-1 bg-red-600/30 text-red-400 border border-red-500/40 rounded text-[11px] font-mono hover:bg-red-600/50 transition-all flex items-center gap-1.5 animate-pulse"
                 >
                   <Square size={10} fill="currentColor" /> TERM SIMULATION
                 </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-[10px] text-gray-400 font-mono block mb-1 uppercase tracking-wider">Target Node IP</label>
                   <input 
                      type="text" 
                      value={targetIp}
                      onChange={(e) => setTargetIp(e.target.value)}
                      disabled={!!activeAttack}
                      className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50"
                   />
                </div>
                <div>
                   <label className="text-[10px] text-gray-400 font-mono flex justify-between mb-1 uppercase tracking-wider">
                      <span>Intensity</span>
                      <span className="text-orange-400 font-bold">LVL {intensity}</span>
                   </label>
                   <input 
                      type="range" 
                      min="1" max="10" 
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      disabled={!!activeAttack}
                      className="w-full accent-red-500 cursor-pointer disabled:opacity-40"
                   />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                  {attackTypes.map((attack) => {
                     const isThisActive = activeAttack?.type === attack.id;
                     return (
                        <button 
                           key={attack.id}
                           onClick={() => {
                              if (isThisActive) {
                                 onStopAttack();
                              } else {
                                 onSimulateAttack(attack.id as any, targetIp, intensity);
                              }
                           }}
                           className={`flex flex-col text-left px-4 py-3 border rounded-lg transition-all relative ${
                              isThisActive 
                              ? 'bg-red-950/20 border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.15)]' 
                              : 'bg-gray-900/40 hover:bg-gray-800/60 border-gray-800'
                           }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center text-xs font-semibold text-gray-200">
                                   <span className="mr-3 p-1.5 rounded-md bg-gray-950/60">
                                      {attack.icon}
                                   </span>
                                   <div>
                                      <p className="text-sm font-semibold">{attack.name}</p>
                                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 leading-normal">{attack.desc}</p>
                                   </div>
                                </div>
                                <div>
                                   {isThisActive ? (
                                      <span className="h-6 w-6 rounded-full bg-red-600/20 text-red-400 border border-red-500/50 flex items-center justify-center animate-ping">
                                         <Flame size={12} />
                                      </span>
                                   ) : (
                                      <Play size={12} className="text-gray-500 group-hover:text-red-400" />
                                   )}
                                </div>
                            </div>
                        </button>
                     );
                  })}
              </div>
            </div>
         </div>

         {/* Defensive rule block - Mitigation Grid */}
         <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-[#071321]/40 flex flex-col">
            <h3 className="text-xs uppercase tracking-widest font-bold text-cyan-400 mb-3 flex items-center">
                 <Shield size={14} className="mr-2" /> 2. Deploy Defensive Controllables (WAF Rules)
            </h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
               Interact with these inline policies. Activate the correct rules below to block the corresponding threat vectors traversing your firewalls.
            </p>

            <div className="flex flex-col gap-2.5">
               {defensiveMitigations.map((def) => {
                  const isDeployed = activeMitigations.includes(def.id);
                  const successfullyCountersActiveAttack = activeAttack?.type === def.counter;

                  return (
                     <div 
                        key={def.id}
                        className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                          isDeployed 
                            ? (successfullyCountersActiveAttack 
                                ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                : 'bg-cyan-950/20 border-cyan-500/50')
                            : 'bg-gray-950/30 border-gray-800/80 hover:border-gray-700'
                        }`}
                     >
                        <div className="flex-1 pr-4">
                           <div className="flex items-center gap-2">
                              {isDeployed ? (
                                 <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                              ) : (
                                 <ShieldOff size={14} className="text-gray-500 shrink-0" />
                              )}
                              <span className="text-xs font-semibold text-gray-200">{def.name}</span>
                              <span className="text-[9px] bg-gray-850 text-gray-400 px-1.5 py-0.2 rounded font-mono border border-gray-800">{def.desc}</span>
                           </div>
                           <p className="text-[10px] text-gray-500 font-mono mt-1 leading-relaxed">{def.tip}</p>
                        </div>
                        <button
                           onClick={() => onToggleMitigation(def.id)}
                           className={`px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase border transition-all shrink-0 ${
                             isDeployed 
                               ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                               : 'bg-gray-900 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                           }`}
                        >
                           {isDeployed ? 'ACTIVE' : 'DEPLOY'}
                        </button>
                     </div>
                  );
               })}
            </div>
         </div>

      </div>

      {/* RIGHT COLUMN: Topology, Diagnostics & Logs */}
      <div className="lg:col-span-7 flex flex-col gap-5 h-full overflow-hidden">
         
         {/* Network Topology Sandbox Map */}
         <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-gray-950/30 flex flex-col relative overflow-hidden h-64 shrink-0">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 flex items-center justify-between">
               <span className="flex items-center"><Server size={14} className="mr-2" /> Live Network Arena Visualization</span>
               <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  simulationStatus === 'CRITICAL' 
                    ? 'bg-red-950/40 text-red-500 border-red-500/30 animate-pulse'
                    : (simulationStatus === 'MITIGATED' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-400/30' : 'bg-gray-900 text-cyan-400 border-cyan-500/20')
               }`}>
                  STATUS: {simulationStatus}
               </span>
            </h3>

            {/* Simulated interactive grid mapping */}
            <div className="flex-1 relative border border-gray-800/60 rounded-lg bg-gray-950/90 flex items-center justify-between px-10 overflow-hidden select-none">
                {/* SVG connection lines in background */}
                <svg className="absolute inset-x-0 top-0 w-full h-full pointer-events-none opacity-40">
                   <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
                   <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Packet particles emitter overlays */}
                {/* Clean traffic dots: float continuously background */}
                <div className="animate-packet-clean" style={{ animationDelay: '0s' }}></div>
                <div className="animate-packet-clean" style={{ animationDelay: '0.8s' }}></div>
                <div className="animate-packet-clean" style={{ animationDelay: '1.6s' }}></div>

                {/* Simulated threat packets flow */}
                {activeAttack && (
                   <>
                      <div className={isCurrentlyMitigated ? 'animate-packet-threat-mitigated' : 'animate-packet-threat-unmitigated'} style={{ animationDelay: '0.1s' }}></div>
                      <div className={isCurrentlyMitigated ? 'animate-packet-threat-mitigated' : 'animate-packet-threat-unmitigated'} style={{ animationDelay: '0.3s' }}></div>
                      <div className={isCurrentlyMitigated ? 'animate-packet-threat-mitigated' : 'animate-packet-threat-unmitigated'} style={{ animationDelay: '0.5s' }}></div>
                      <div className={isCurrentlyMitigated ? 'animate-packet-threat-mitigated' : 'animate-packet-threat-unmitigated'} style={{ animationDelay: '0.7s' }}></div>
                      <div className={isCurrentlyMitigated ? 'animate-packet-threat-mitigated' : 'animate-packet-threat-unmitigated'} style={{ animationDelay: '0.9s' }}></div>
                   </>
                )}

                {/* Node 1: Attacker space */}
                <div className="relative flex flex-col items-center z-10">
                   <div className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all ${
                     activeAttack 
                       ? 'bg-red-950/60 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
                       : 'bg-gray-900 border-gray-800'
                   }`}>
                      <Skull size={18} className={activeAttack ? 'text-red-500' : 'text-gray-500'} />
                   </div>
                   <span className="text-[10px] text-gray-300 font-bold mt-2">Attacker Endpoint</span>
                   <span className="text-[8px] text-gray-500 font-mono mt-0.5">{activeAttack ? '45.122.33.102' : 'OFFLINE'}</span>
                </div>

                {/* Node 2: Firewall Gateway Router */}
                <div className="relative flex flex-col items-center z-10">
                   {isCurrentlyMitigated && (
                      <div className="absolute h-16 w-16 -top-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 threat-ring"></div>
                   )}
                   <div className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all ${
                     isCurrentlyMitigated 
                       ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                       : (activeAttack ? 'bg-orange-950/30 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-gray-900 border-gray-800')
                   }`}>
                      {isCurrentlyMitigated ? (
                         <ShieldCheck size={20} className="text-emerald-400" />
                      ) : (
                         <Shield size={20} className={activeAttack ? 'text-orange-400' : 'text-gray-400'} />
                      )}
                   </div>
                   <span className="text-[10px] text-gray-300 font-bold mt-2">WAF Gateway Router</span>
                   <span className="text-[8px] text-cyan-500 font-mono mt-0.5">{activeMitigations.length} rules active</span>
                </div>

                {/* Node 3: Target Server host */}
                <div className={`relative flex flex-col items-center z-10 ${activeAttack && !isCurrentlyMitigated ? 'server-shaker' : ''}`}>
                   {activeAttack && !isCurrentlyMitigated && (
                      <div className="absolute h-16 w-16 -top-2 rounded-full border border-red-500/40 bg-red-500/10 threat-ring"></div>
                   )}
                   <div className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all ${
                     activeAttack && !isCurrentlyMitigated 
                       ? 'bg-red-950/80 border-red-500 shadow-[0_0_20px_#ef4444]' 
                       : 'bg-gray-900 border-gray-800'
                   }`}>
                      <Server size={18} className={activeAttack && !isCurrentlyMitigated ? 'text-red-500 animate-bounce' : 'text-cyan-400'} />
                   </div>
                   <span className="text-[10px] text-gray-300 font-bold mt-2">Target Target</span>
                   <span className="text-[8px] text-cyan-400 font-mono mt-0.5">IP: {targetIp}</span>
                </div>
            </div>
         </div>

         {/* Diagnostics readout row - Bento layout counters */}
         <div className="grid grid-cols-4 gap-4 shrink-0">
             <div className="bg-gray-950/40 border border-gray-800/80 p-3.5 rounded-xl flex flex-col">
                <span className="text-[8px] uppercase tracking-wider font-mono text-gray-400">Target Availability</span>
                <span className={`text-lg font-bold font-mono tracking-tight mt-1 leading-none ${computedStats.targetAvailability < 80 ? 'text-red-500' : 'text-emerald-400'}`}>
                   {computedStats.targetAvailability.toFixed(1)}%
                </span>
                <p className="text-[9px] text-gray-650 font-mono mt-1.5 uppercase text-gray-500">Service Uptime</p>
             </div>

             <div className="bg-gray-950/40 border border-gray-800/80 p-3.5 rounded-xl flex flex-col">
                <span className="text-[8px] uppercase tracking-wider font-mono text-gray-400">Inbound Load</span>
                <span className="text-lg font-bold text-gray-100 font-mono tracking-tight mt-1 leading-none">
                   {computedStats.ingressPps.toLocaleString()} <span className="text-[10px] text-gray-500">pps</span>
                </span>
                <p className="text-[9px] text-gray-650 font-mono mt-1.5 uppercase text-gray-500">Packet streams</p>
             </div>

             <div className="bg-gray-950/40 border border-gray-800/80 p-3.5 rounded-xl flex flex-col">
                <span className="text-[8px] uppercase tracking-wider font-mono text-gray-400">Firewall CPU Load</span>
                <span className="text-lg font-bold text-cyan-400 font-mono tracking-tight mt-1 leading-none">
                   {computedStats.firewallCpu}%
                </span>
                <p className="text-[9px] text-gray-650 font-mono mt-1.5 uppercase text-gray-500">Processor draw</p>
             </div>

             <div className="bg-gray-950/40 border border-gray-800/80 p-3.5 rounded-xl flex flex-col">
                <span className="text-[8px] uppercase tracking-wider font-mono text-gray-400">Threat Containment</span>
                <span className={`text-lg font-bold font-mono tracking-tight mt-1 leading-none ${activeAttack && !isCurrentlyMitigated ? 'text-red-500' : 'text-emerald-400'}`}>
                   {activeAttack ? (isCurrentlyMitigated ? 'CONTAINED' : 'BREACHED') : 'STABLE'}
                </span>
                <p className="text-[9px] text-gray-650 font-mono mt-1.5 uppercase text-gray-500">Intrusion state</p>
             </div>
         </div>

         {/* SEC_OPS Tactical terminal log console */}
         <div className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-950/80 flex flex-col flex-1 min-h-[160px] overflow-hidden">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center border-b border-gray-800/60 pb-2">
               <Terminal size={12} className="mr-2" /> Security Operations Center (SOC) Tactical Console
            </h4>
            
            <div className="flex-1 overflow-y-auto text-xs font-mono space-y-1.5 pr-2 custom-scrollbar flex flex-col-reverse">
               <div ref={terminalEndRef}></div>
               {logs.map((log, i) => {
                  let colorClass = 'text-gray-400';
                  if (log.includes('[DE-ACTIVATED]') || log.includes('[SEC_OPS]')) {
                     colorClass = 'text-cyan-400';
                  } else if (log.includes('[DEPLOYED]')) {
                     colorClass = 'text-emerald-400';
                  } else if (log.includes('[ALERT_CRITICAL]') || log.includes('[VULNERABILITY_BREACH]')) {
                     colorClass = 'text-red-500 font-bold';
                  } else if (log.includes('[FIREWALL_BLOCK]')) {
                     colorClass = 'text-yellow-500';
                  }
                  return (
                     <div key={i} className={`py-0.5 leading-relaxed tracking-tight border-b border-gray-900/40 hover:bg-gray-900/20 px-1 rounded ${colorClass}`}>
                        {log}
                     </div>
                  );
               })}
            </div>
         </div>

      </div>
    </div>
  );
};
