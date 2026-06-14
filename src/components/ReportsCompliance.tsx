import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle, ShieldAlert, BadgeAlert, 
  Printer, Trash2, Calendar, Target, User, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';

interface ReportTemplate {
  title: string;
  targetAudience: string;
  scope: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  resilienceScore: number;
  unassignedTally: number;
  isoCoverage: number;
  socCoverage: number;
  nistCoverage: number;
  gdprCoverage: number;
  assessorComments: string;
  priorityThreats: string[];
}

export const ReportsCompliance: React.FC = () => {
  // Report Editor state
  const [report, setReport] = useState<ReportTemplate>({
    title: 'Nexus SOC Cyber Security Executive Review',
    targetAudience: 'Chief Information Security Officer (CISO)',
    scope: 'Enterprise Network Segment & Core Servers',
    grade: 'A',
    resilienceScore: 94,
    unassignedTally: 4,
    isoCoverage: 92,
    socCoverage: 85,
    nistCoverage: 78,
    gdprCoverage: 98,
    assessorComments: 'Continuous packet analysis validates that network boundary firewalls successfully contained multi-threaded port scans. The deployment of automated rate limiters reduced SYN attack footprints substantially. High coverage remains stable across GDPR compliance points; however, additional key credential hardening is recommended for active SSH login nodes to bridge SOC2 and NIST requirements.',
    priorityThreats: ['DNS Tunneling Anomaly', 'DDoS Volumetric Spike', 'SSH Password Dictionary Force']
  });

  const [historicalReports, setHistoricalReports] = useState([
    { title: 'Weekly SOC Summary', date: 'Jun 12, 2026', type: 'PDF', size: '2.4 MB' },
    { title: 'Threat Intelligence Brief', date: 'Jun 08, 2026', type: 'PDF', size: '1.8 MB' },
    { title: 'DDoS Incident Post-Mortem', date: 'May 28, 2026', type: 'DOCX', size: '1.2 MB' },
    { title: 'Data Exfiltration Analysis', date: 'May 14, 2026', type: 'PDF', size: '3.1 MB' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // PDF Export Trigger
  const handleExportPDF = () => {
    const reportRef = `REF-NX-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // We formulate a fully compiled HTML document with beautiful clean print styling for standard Letter (A4) pages.
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable pop-ups to export the PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            @page {
              size: letter;
              margin: 20mm;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              color: #1e293b;
              background-color: #ffffff;
              line-height: 1.5;
              font-size: 11pt;
              padding: 0;
              margin: 0;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 15px;
            }
            .org-title {
              font-size: 14pt;
              font-weight: 800;
              letter-spacing: 1px;
              color: #0f172a;
              text-transform: uppercase;
            }
            .org-sub {
              font-size: 8pt;
              color: #64748b;
              font-family: monospace;
              text-transform: uppercase;
            }
            .doc-title {
              font-size: 20pt;
              font-weight: bold;
              color: #0c4a6e;
              margin: 15px 0 5px 0;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 15px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
            }
            .meta-item {
              font-size: 9.5pt;
            }
            .meta-label {
              font-weight: bold;
              color: #475569;
              font-size: 8pt;
              text-transform: uppercase;
              font-family: monospace;
            }
            .meta-value {
              font-weight: 500;
              color: #0f172a;
            }
            .grade-container {
              display: flex;
              align-items: center;
              gap: 10px;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 6px;
              padding: 10px 15px;
              margin-bottom: 25px;
            }
            .grade-badge {
              font-size: 24pt;
              font-weight: 900;
              color: #15803d;
              background: #dcfce7;
              width: 48px;
              height: 48px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .section-heading {
              font-size: 12pt;
              font-weight: bold;
              color: #0f172a;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 5px;
              margin-top: 25px;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .commentary-box {
              background-color: #f8fafc;
              border-left: 3px solid #0284c7;
              padding: 12px 15px;
              font-style: italic;
              color: #334155;
              border-radius: 0 4px 4px 0;
            }
            .threat-tag {
              display: inline-block;
              background-color: #f1f5f9;
              border: 1px solid #cbd5e1;
              color: #334155;
              padding: 4px 10px;
              border-radius: 15px;
              font-size: 9pt;
              margin-right: 5px;
              margin-bottom: 5px;
              font-weight: 500;
            }
            .compliance-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .compliance-table th {
              background-color: #f1f5f9;
              color: #475569;
              font-size: 8pt;
              text-transform: uppercase;
              font-family: monospace;
              padding: 8px 10px;
              text-align: left;
              border-bottom: 2px solid #cbd5e1;
            }
            .compliance-table td {
              padding: 10px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 10pt;
            }
            .bar-outer {
              background-color: #e2e8f0;
              height: 8px;
              border-radius: 4px;
              width: 120px;
              overflow: hidden;
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
            }
            .bar-inner {
              height: 100%;
              border-radius: 4px;
            }
            .bar-green { background-color: #16a34a; }
            .bar-yellow { background-color: #ca8a04; }
            .bar-orange { background-color: #ea580c; }
            .footer {
              margin-top: 45px;
              border-top: 1px solid #cbd5e1;
              padding-top: 15px;
              font-size: 8pt;
              color: #94a3b8;
              text-align: center;
              font-family: monospace;
            }
            .print-btn-container {
              background-color: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
              padding: 12px 25px;
              display: flex;
              justify-content: flex-end;
              gap: 10px;
            }
            .print-btn {
              background-color: #0284c7;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 10pt;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .print-btn:hover {
              background-color: #0369a1;
            }
            @media print {
              .print-btn-container {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-btn-container">
             <button class="print-btn" onclick="window.print()">📥 Print / Save PDF</button>
             <button class="print-btn" style="background:#64748b;" onclick="window.close()">Close Window</button>
          </div>
          
          <div style="padding: 25px;">
             <table class="header-table">
               <tr>
                 <td>
                    <div class="org-title">Nexus Operations Command Center</div>
                    <div class="org-sub">SEC_OPS / CYBER RANGE SIMULATION LABS</div>
                 </td>
                 <td style="text-align: right; font-family: monospace; font-size: 9pt; color: #64748b;">
                    DOC_REF: ${reportRef}<br>
                    GENERATED: ${currentDate}
                 </td>
               </tr>
             </table>

             <div class="doc-title">${report.title}</div>
             
             <div class="meta-grid">
                <div class="meta-item">
                   <div class="meta-label">Target Audience Group</div>
                   <div class="meta-value">${report.targetAudience}</div>
                </div>
                <div class="meta-item">
                   <div class="meta-label">Assessment Core Scope</div>
                   <div class="meta-value">${report.scope}</div>
                </div>
                <div class="meta-item">
                   <div class="meta-label">Operational Security Index</div>
                   <div class="meta-value">${report.resilienceScore}% Performance Index</div>
                </div>
                <div class="meta-item">
                   <div class="meta-label">Unassigned Risk Tallies</div>
                   <div class="meta-value">${report.unassignedTally} High Priority Alarms</div>
                </div>
             </div>

             <div class="grade-container">
                <div class="grade-badge">${report.grade}</div>
                <div>
                   <div style="font-weight:bold; color: #166534;">Security Grade Assurance Rating: Perfect Integration</div>
                   <div style="font-size: 9pt; color: #15803d;">Network boundaries demonstrate exceptional compliance, filtering active threat streams flawlessly.</div>
                </div>
             </div>

             <div class="section-heading">Assessor Executive Analysis</div>
             <div class="commentary-box">
                "${report.assessorComments}"
             </div>

             <div class="section-heading">Priority Threat Profiles Under Mitigation</div>
             <div style="margin-top: 10px; margin-bottom: 20px;">
                ${report.priorityThreats.map(t => `<span class="threat-tag">${t}</span>`).join('')}
             </div>

             <div class="section-heading">Compliance Sliders coverage map</div>
             <table class="compliance-table">
                <thead>
                   <tr>
                      <th>Compliance Standard</th>
                      <th>Observed Coverage</th>
                      <th>Deployment Health</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td>ISO / IEC 27001</td>
                      <td>
                         <div class="bar-outer"><div class="bar-inner bar-green" style="width: ${report.isoCoverage}%"></div></div>
                         ${report.isoCoverage}%
                      </td>
                      <td style="color:#16a34a; font-weight:650;">Assured Compliant</td>
                   </tr>
                   <tr>
                      <td>SOC 2 TYPE II</td>
                      <td>
                         <div class="bar-outer"><div class="bar-inner bar-yellow" style="width: ${report.socCoverage}%"></div></div>
                         ${report.socCoverage}%
                      </td>
                      <td style="color:#ca8a04; font-weight:650;">Needs Auditing</td>
                   </tr>
                   <tr>
                      <td>NIST Critical Frame</td>
                      <td>
                         <div class="bar-outer"><div class="bar-inner bar-orange" style="width: ${report.nistCoverage}%"></div></div>
                         ${report.nistCoverage}%
                      </td>
                      <td style="color:#ea580c; font-weight:650;">Triage Recommended</td>
                   </tr>
                   <tr>
                      <td>GDPR Privacy Core</td>
                      <td>
                         <div class="bar-outer"><div class="bar-inner bar-green" style="width: ${report.gdprCoverage}%"></div></div>
                         ${report.gdprCoverage}%
                      </td>
                      <td style="color:#16a34a; font-weight:650;">Assured Compliant</td>
                   </tr>
                </tbody>
             </table>

             <div class="footer">
                NEXUS SOC ASSURANCE AUDIT REPORT • CLOUD OPERATIONS INTERNAL DOCUMENT • SAVE SECURELY
             </div>
          </div>

          <script>
             window.onload = function() {
                // Instantly present browser printer
                setTimeout(function(){ window.print(); }, 200);
             };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Append newly compiled report into historical records for interactive feel
    const newReportRecord = {
       title: report.title,
       date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
       type: 'PDF',
       size: '1.4 MB'
    };
    setHistoricalReports(prev => [newReportRecord, ...prev]);
  };

  const generateReportFakeApi = () => {
     setIsGenerating(true);
     setTimeout(() => {
        setIsGenerating(false);
        handleExportPDF();
     }, 1200);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden glass-panel rounded-lg border border-gray-800 p-6 relative">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500"></div>

      {/* Title Header */}
      <div className="flex items-center justify-between shrink-0 border-b border-gray-800 pb-4">
        <div>
           <h2 className="text-xl font-bold flex items-center text-gray-200">
             <FileText className="mr-2 text-fuchsia-400" /> Executive Intelligence & Compliance
           </h2>
           <p className="text-xs text-gray-500 mt-0.5">Configure live security parameters and compile official Letterhead compliance reports instantly.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
          
          {/* LEFT: Designer Configuration Dashboard */}
          <div className="lg:col-span-5 bg-gray-950 border border-gray-800 rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400 flex items-center">
                 <Sparkles size={12} className="mr-2" /> Report Configuration Matrix
              </h3>

              <div className="space-y-4 text-xs font-mono">
                 <div>
                    <label className="text-[10px] text-gray-400 uppercase block mb-1">Doc Summary Title</label>
                    <input 
                       type="text" 
                       value={report.title}
                       onChange={(e) => setReport({ ...report, title: e.target.value })}
                       className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250 focus:outline-none focus:border-fuchsia-500"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-[10px] text-gray-400 uppercase block mb-1">Target Recipient</label>
                       <input 
                          type="text" 
                          value={report.targetAudience}
                          onChange={(e) => setReport({ ...report, targetAudience: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250 focus:outline-none focus:border-fuchsia-500"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-400 uppercase block mb-1">Scope Perimeter</label>
                       <input 
                          type="text" 
                          value={report.scope}
                          onChange={(e) => setReport({ ...report, scope: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250 focus:outline-none focus:border-fuchsia-500"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    <div>
                       <label className="text-[10px] text-gray-400 uppercase block mb-1">Assurance Grade</label>
                       <select 
                          value={report.grade}
                          onChange={(e) => setReport({ ...report, grade: e.target.value as any })}
                          className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250"
                       >
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                          <option value="C">Grade C</option>
                          <option value="D">Grade D</option>
                          <option value="F">Grade F</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-400 uppercase block mb-1">Resilience %</label>
                       <input 
                          type="number" 
                          value={report.resilienceScore}
                          onChange={(e) => setReport({ ...report, resilienceScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] text-gray-400 uppercase block mb-1">Risks Pending</label>
                       <input 
                          type="number" 
                          value={report.unassignedTally}
                          onChange={(e) => setReport({ ...report, unassignedTally: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-full bg-gray-900 border border-gray-850 rounded px-2.5 py-1.5 text-[11px] text-gray-250"
                       />
                    </div>
                 </div>

                 {/* SLA Standards Coverage bars adjustment */}
                 <div className="bg-gray-900/60 p-3.5 rounded-lg border border-gray-850 space-y-2.5">
                    <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">Compliance Parameter Offsets</span>
                    
                    <div>
                       <div className="flex justify-between font-mono text-[9px] text-gray-400">
                          <span>ISO 27001</span>
                          <span>{report.isoCoverage}%</span>
                       </div>
                       <input type="range" min="10" max="100" value={report.isoCoverage} onChange={(e) => setReport({...report, isoCoverage: parseInt(e.target.value)})} className="w-full accent-fuchsia-500 h-1 cursor-pointer" />
                    </div>

                    <div>
                       <div className="flex justify-between font-mono text-[9px] text-gray-400">
                          <span>SOC 2 Type II</span>
                          <span>{report.socCoverage}%</span>
                       </div>
                       <input type="range" min="10" max="100" value={report.socCoverage} onChange={(e) => setReport({...report, socCoverage: parseInt(e.target.value)})} className="w-full accent-fuchsia-500 h-1 cursor-pointer" />
                    </div>

                    <div>
                       <div className="flex justify-between font-mono text-[9px] text-gray-400">
                          <span>NIST Standards</span>
                          <span>{report.nistCoverage}%</span>
                       </div>
                       <input type="range" min="10" max="100" value={report.nistCoverage} onChange={(e) => setReport({...report, nistCoverage: parseInt(e.target.value)})} className="w-full accent-fuchsia-500 h-1 cursor-pointer" />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] text-gray-400 uppercase block mb-1">Assessor Commentary & Diagnostics</label>
                    <textarea 
                       value={report.assessorComments}
                       onChange={(e) => setReport({ ...report, assessorComments: e.target.value })}
                       rows={4}
                       className="w-full bg-gray-900 border border-gray-850 rounded p-3 text-[11px] font-mono text-gray-300 leading-normal focus:outline-none focus:border-fuchsia-500"
                    />
                 </div>

                 <button 
                    onClick={generateReportFakeApi}
                    disabled={isGenerating}
                    className="w-full text-xs font-bold tracking-wider uppercase font-mono py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                 >
                    {isGenerating ? (
                       <>
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          COMPILING SEC_OPS AUDIT SCHEMA...
                       </>
                    ) : (
                       <>
                          <Printer size={14} /> Compile & Export Executive PDF
                       </>
                    )}
                 </button>
              </div>
          </div>

          {/* RIGHT: Document Sandbox Visualizer */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden h-full">
             
             {/* Report paper-style preview */}
             <div className="flex-1 bg-white text-gray-800 rounded-xl p-6 overflow-y-auto shadow-2xl relative select-text border border-gray-200">
                
                {/* Visual watermark logo */}
                <div className="flex justify-between border-b border-gray-350 pb-3.5 items-start">
                   <div>
                      <div className="text-xs font-extrabold uppercase font-sans tracking-widest text-slate-900">Nexus Security Command</div>
                      <div className="text-[8px] font-mono tracking-widest text-slate-500">OPERATIONAL INTEL ASSESSMENT MATRIX</div>
                   </div>
                   <div className="text-[9px] font-mono text-slate-400 text-right">
                      REF-NX-CONFIDENTIAL<br />
                      SEC_LEVEL T-1 ROSTER
                   </div>
                </div>

                <div className="mt-5">
                   <h2 className="text-xl font-bold font-sans text-slate-900 tracking-tight leading-snug">{report.title}</h2>
                </div>

                {/* Brief details matrix metadata */}
                <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                   <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Assessed Client Base</div>
                      <div className="font-semibold text-slate-800">{report.targetAudience}</div>
                   </div>
                   <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Scope Parameters</div>
                      <div className="font-semibold text-slate-800">{report.scope}</div>
                   </div>
                   <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Operational Security Rating</div>
                      <div className="font-semibold text-slate-800">{report.resilienceScore}% Security Index</div>
                   </div>
                   <div>
                      <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Unassigned Vuln Alerts</div>
                      <div className="font-semibold text-red-650 font-bold">{report.unassignedTally} High Priority</div>
                   </div>
                </div>

                {/* Assessor Grade Frame */}
                <div className="mt-5 border border-emerald-200 bg-emerald-50/50 rounded-lg p-3.5 flex items-center gap-3.5">
                   <div className="h-11 w-11 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded flex items-center justify-center font-extrabold text-2xl">
                      {report.grade}
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-emerald-900 leading-none">Security Grade Quality Assurance Approved</h4>
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">Continuous monitors show maximum network baseline resistance thresholds satisfied.</p>
                   </div>
                </div>

                {/* Commentary */}
                <div className="mt-5">
                   <h4 className="text-xs uppercase font-bold text-slate-600 border-b border-slate-200 pb-1 font-mono tracking-wider">Assessor Commentary Summary</h4>
                   <p className="text-[11px] text-slate-650 italic leading-relaxed mt-2.5 font-serif text-slate-700 bg-slate-50 p-2 border-l-2 border-slate-400">
                      "{report.assessorComments}"
                   </p>
                </div>

                {/* Threat types list items */}
                <div className="mt-5">
                   <h4 className="text-xs uppercase font-bold text-slate-600 border-b border-slate-200 pb-1 font-mono tracking-wider">Mitigated Hazard Vectors</h4>
                   <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {report.priorityThreats.map((threat, idx) => (
                         <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-700 rounded-full px-2.5 py-0.5 text-[9px] font-semibold font-mono">
                            {threat}
                         </span>
                      ))}
                   </div>
                </div>

                {/* Compliance progress bar table */}
                <div className="mt-5">
                   <h4 className="text-xs uppercase font-bold text-slate-600 border-b border-slate-200 pb-1 font-mono tracking-wider">Regulatory SLA Coverage</h4>
                   <div className="space-y-3 mt-3">
                      <div>
                         <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700 mb-1">
                            <span>ISO / IEC 27001 (Information Security)</span>
                            <span>{report.isoCoverage}% Coverage</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-600" style={{ width: `${report.isoCoverage}%` }}></div>
                         </div>
                      </div>

                      <div>
                         <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700 mb-1">
                            <span>SOC 2 Type II (Operational Trust)</span>
                            <span>{report.socCoverage}% Coverage</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-yellow-600" style={{ width: `${report.socCoverage}%` }}></div>
                         </div>
                      </div>

                      <div>
                         <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700 mb-1">
                            <span>GDPR Data Protection</span>
                            <span>{report.gdprCoverage}% Coverage</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-600" style={{ width: `${report.gdprCoverage}%` }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 text-[8px] text-slate-400 font-mono text-center">
                   nexus cybersoc simulated audit core • legal notification: secure deletion strictly required upon session exit
                </div>
             </div>

             {/* Historic archived brief list */}
             <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mt-4 shrink-0">
                 <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-bold mb-2 flex items-center">
                    <Calendar size={12} className="mr-1.5 text-fuchsia-400" /> Historical Executive Downloads Archive
                 </h4>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {historicalReports.map((item, idx) => (
                       <button 
                         key={idx}
                         onClick={handleExportPDF}
                         className="bg-gray-900 border border-gray-850 hover:border-fuchsia-500/45 p-2 rounded text-left transition-all"
                       >
                          <div className="text-[10px] font-semibold text-gray-200 truncate">{item.title}</div>
                          <div className="flex items-center justify-between text-[8px] text-gray-500 font-mono mt-1">
                             <span>{item.date}</span>
                             <span className="text-fuchsia-400 font-bold">{item.type}</span>
                          </div>
                       </button>
                    ))}
                 </div>
             </div>

          </div>

      </div>
    </div>
  );
};
