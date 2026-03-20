import React, { useState, useEffect, useRef } from 'react';

const ByteSweepScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState([
    { time: '00:00:00', text: '> BYTESWEEP v4.0 INITIALIZED', type: 'info' },
    { time: '00:00:01', text: '> Neural scan engine loaded', type: 'info' },
    { time: '00:00:02', text: '> Ready for target acquisition...', type: 'warning' },
  ]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [activePanel, setActivePanel] = useState('scanner');
  const terminalRef = useRef(null);

  const folders = [
    { name: 'Projects', path: 'C:\\Users\\Dell\\Projects', size: '45.2 GB', files: 12847, type: 'folder', color: '#00fff7' },
    { name: 'Downloads', path: 'C:\\Users\\Dell\\Downloads', size: '12.8 GB', files: 3421, type: 'folder', color: '#bf00ff' },
    { name: 'Documents', path: 'C:\\Users\\Dell\\Documents', size: '8.4 GB', files: 2156, type: 'folder', color: '#00fff7' },
    { name: 'Videos', path: 'C:\\Users\\Dell\\Videos', size: '156.7 GB', files: 892, type: 'folder', color: '#bf00ff' },
    { name: 'Local Disk D:', path: 'D:\\', size: '489.2 GB', files: 45623, type: 'drive', color: '#ff003c' },
    { name: 'Local Disk C:', path: 'C:\\', size: '234.5 GB', files: 89234, type: 'drive', color: '#00fff7' },
  ];

  const stats = [
    { label: 'FILES SCANNED', value: 12847, icon: '📁', color: '#00fff7', glow: 'rgba(0, 255, 247, 0.4)' },
    { label: 'DUPLICATES', value: 24, icon: '🔄', color: '#bf00ff', glow: 'rgba(191, 0, 255, 0.4)' },
    { label: 'RECOVERABLE', value: '2.47', suffix: ' GB', icon: '💾', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.4)' },
    { label: 'THREATS', value: 0, icon: '🛡️', color: '#ff003c', glow: 'rgba(255, 0, 60, 0.4)' },
  ];

  const fileTypes = [
    { ext: 'JPG', count: 2847, size: '34.2 GB', color: '#00fff7', percent: 100 },
    { ext: 'MP4', count: 456, size: '89.3 GB', color: '#bf00ff', percent: 16 },
    { ext: 'PDF', count: 892, size: '4.7 GB', color: '#ff003c', percent: 31 },
    { ext: 'DOCX', count: 1247, size: '8.9 GB', color: '#00ff88', percent: 44 },
    { ext: 'ZIP', count: 234, size: '45.2 GB', color: '#ffaa00', percent: 8 },
    { ext: 'PNG', count: 3421, size: '28.4 GB', color: '#00aaff', percent: 95 },
  ];

  const scanLogs = [
    { phase: 'INIT', text: 'Loading signature database [v4.0.1]', status: 'complete' },
    { phase: 'SCAN', text: 'Scanning master file table...', status: 'complete' },
    { phase: 'HASH', text: 'Computing xxHash3-64 fingerprints', status: 'complete' },
    { phase: 'DEDUP', text: 'Deduplication pass — byte verify', status: 'active' },
    { phase: 'SORT', text: 'Sorting by last-access timestamp', status: 'pending' },
    { phase: 'DONE', text: 'Finalizing report', status: 'pending' },
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLog = (text, type = 'info') => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setTerminalLines((prev) => [...prev.slice(-50), { time, text, type }]);
  };

  const startScan = () => {
    if (!selectedFolder) {
      addLog('> ERROR: No target selected', 'error');
      return;
    }
    setIsScanning(true);
    setScanProgress(0);
    addLog(`> Initiating deep scan: ${selectedFolder.path}`, 'info');
    addLog('> Loading neural scan engine...', 'info');
    addLog('> Initializing entropy analysis buffer...', 'info');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsScanning(false);
        addLog('', 'info');
        addLog('> ████████████████████████████████████████████ 100%', 'complete');
        addLog('> ════════════════════════════════════════════', 'info');
        addLog('> SCAN COMPLETE', 'success');
        addLog('> ════════════════════════════════════════════', 'info');
        addLog(`> Files found: ${stats[0].value.toLocaleString()}`, 'info');
        addLog(`> Duplicate groups: ${stats[1].value}`, 'info');
        addLog(`> Space recoverable: ${stats[2].value} GB`, 'info');
      } else {
        setScanProgress(progress);
        if (progress < 25) addLog('> Scanning master file table...', 'info');
        else if (progress < 50) addLog('> Computing xxHash3-64 fingerprints...', 'info');
        else if (progress < 75) addLog('> Deduplication pass — byte verify...', 'info');
        else if (progress < 95) addLog('> Sorting by last-access timestamp...', 'info');
      }
    }, 150);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color); }
          50% { box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color); }
        }
        @keyframes scanline {
          0% { left: -30%; }
          100% { left: 110%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(0, 255, 247, 0.3); }
          50% { border-color: rgba(191, 0, 255, 0.5); }
        }
        @keyframes textFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          95% { opacity: 0.9; }
          96% { opacity: 1; }
        }
        .neon-text { animation: textFlicker 4s infinite; }
        .glow-card:hover { transform: translateY(-2px); }
        .scanline-anim {
          position: absolute;
          top: 0;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,255,247,0.1), transparent);
          animation: scanline 3s linear infinite;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0, 255, 247, 0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 247, 0.5); }
      `}</style>

      <div style={styles.backgroundEffects}>
        <div style={styles.bgGradient1} />
        <div style={styles.bgGradient2} />
        <div style={styles.bgGradient3} />
        <div style={{ ...styles.gridOverlay }} />
      </div>

      <nav className="flex items-center justify-between md:justify-start md:px-6 px-3 h-14 md:h-[70px] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-[rgba(0,255,247,0.2)] relative z-100">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-[#00fff7] hover:bg-[rgba(0,255,247,0.1)] rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#00fff7] to-[#0088ff] rounded-lg md:rounded-[10px] flex items-center justify-content-center text-lg md:text-[22px] shadow-[0_0_20px_rgba(0,255,247,0.4),0_0_40px_rgba(0,255,247,0.2)]">⚡</div>
          <div className="hidden sm:block">
            <div className="font-['Orbitron'] text-sm md:text-xl font-bold bg-gradient-to-r from-[#00fff7] to-[#bf00ff] bg-clip-text text-transparent tracking-[3px]">BYTESWEEP</div>
            <div className="font-['Share_Tech_Mono'] text-[9px] text-[rgba(0,255,247,0.5)] tracking-[2px] mt-[2px]">NEURAL SCANNER v4.0</div>
          </div>
        </div>

        <div className="flex gap-1 md:gap-1 md:ml-14 overflow-x-auto md:overflow-visible">
          {['scanner', 'terminal', 'results', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePanel(tab)}
              className={`px-2 py-1.5 md:px-4 md:py-2 rounded-md text-[10px] md:text-[11px] font-['Orbitron'] tracking-[1px] md:tracking-[2px] cursor-pointer transition-all duration-300 flex items-center whitespace-nowrap border border-transparent
                ${activePanel === tab 
                  ? 'bg-[rgba(0,255,247,0.1)] border-[rgba(0,255,247,0.3)] text-[#00fff7]' 
                  : 'text-[#888] hover:text-[#aaa]'}`}
            >
              {tab === 'scanner' && '🔍'}
              {tab === 'terminal' && '📟'}
              {tab === 'results' && '📊'}
              {tab === 'settings' && '⚙️'}
              <span className="hidden md:inline ml-2 uppercase">{tab}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.1)]">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-[#00fff7] shadow-[0_0_10px_#00fff7] animate-pulse' : 'bg-[#666]'}'}`} />
            <span className="font-['Orbitron'] text-[10px] tracking-[2px]">
              {isScanning ? 'SCANNING' : 'READY'}
            </span>
          </div>
          <div className="hidden md:block w-24 md:w-28 h-1.5 bg-[rgba(255,255,255,0.1)] rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00fff7] to-[#bf00ff] rounded transition-all duration-300 shadow-[0_0_10px_rgba(0,255,247,0.5)]" style={{ width: `${scanProgress}%` }} />
          </div>
          <span className="font-['Orbitron'] text-[10px] md:text-xs text-[#00fff7] min-w-[30px] md:min-w-[50px] text-center">
            {Math.floor(scanProgress)}%
          </span>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-56px)] md:h-[calc(100vh-70px)] relative z-1">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <aside className={`fixed md:relative z-50 md:z-0 top-14 md:top-0 left-0 h-[calc(100vh-56px)] md:h-full w-72 md:w-[300px] p-5 bg-[rgba(10,10,15,0.95)] md:bg-[rgba(10,10,15,0.8)] backdrop-blur-xl md:backdrop-blur-20 border-r border-[rgba(0,255,247,0.1)] flex flex-col gap-4 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div style={styles.glassPanel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelDot} />
              <span style={styles.panelTitle}>TARGET ACQUISITION</span>
            </div>

            <div style={styles.folderList}>
              {folders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => setSelectedFolder(folder)}
                  style={{
                    ...styles.folderItem,
                    ...(selectedFolder?.path === folder.path ? styles.folderItemActive : {}),
                    '--glow-color': folder.color,
                  }}
                >
                  <div style={{ ...styles.folderIcon, color: folder.color }}>
                    {folder.type === 'drive' ? '💾' : '📁'}
                  </div>
                  <div style={styles.folderInfo}>
                    <div style={styles.folderName}>{folder.name}</div>
                    <div style={styles.folderMeta}>
                      {folder.files.toLocaleString()} files · {folder.size}
                    </div>
                  </div>
                  <div style={{ ...styles.folderIndicator, backgroundColor: folder.color }} />
                </button>
              ))}
            </div>
          </div>

          <div style={styles.glassPanel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelDot} />
              <span style={styles.panelTitle}>CONFIGURATION</span>
            </div>

            <div style={styles.configSection}>
              <label style={styles.configLabel}>Large File Threshold</label>
              <div style={styles.sliderContainer}>
                <input type="range" min="1" max="100" defaultValue="10" style={styles.slider} />
                <span style={styles.sliderValue}>10 MB</span>
              </div>
            </div>

            <div style={styles.configSection}>
              <label style={styles.configLabel}>Unused Files (days)</label>
              <div style={styles.sliderContainer}>
                <input type="range" min="30" max="365" defaultValue="180" style={styles.slider} />
                <span style={styles.sliderValue}>180 days</span>
              </div>
            </div>

            <div style={styles.configSection}>
              <label style={styles.configLabel}>Scan Depth</label>
              <div style={styles.sliderContainer}>
                <input type="range" min="1" max="5" defaultValue="3" style={styles.slider} />
                <span style={styles.sliderValue}>Deep</span>
              </div>
            </div>
          </div>

          <button
            onClick={startScan}
            disabled={isScanning}
            style={{
              ...styles.scanButton,
              ...(isScanning ? styles.scanButtonDisabled : {}),
            }}
          >
            {isScanning ? (
              <>
                <span style={{ animation: 'pulse 1s infinite' }}>◼</span>
                SCANNING
              </>
            ) : (
              <>
                <span>▶</span>
                INITIATE SCAN
              </>
            )}
          </button>

          <button style={styles.stopButton}>
            ◼ ABORT
          </button>
          
          <button onClick={() => setSidebarOpen(false)} className="md:hidden mt-auto py-3 px-4 bg-[rgba(255,0,60,0.2)] border border-[rgba(255,0,60,0.3)] rounded-lg text-[#ff003c] font-['Orbitron'] text-xs tracking-[2px]">
            CLOSE MENU
          </button>
        </aside>

        <main className="flex-1 p-3 md:p-5 overflow-y-auto flex flex-col gap-4 md:gap-5">
          {activePanel === 'scanner' && (
            <>
              <div style={styles.statsGrid} className="stats-grid">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="glow-card"
                    style={{
                      ...styles.statCard,
                      '--glow-color': stat.glow,
                      boxShadow: `0 0 30px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    }}
                  >
                    <div style={styles.statIcon}>{stat.icon}</div>
                    <div style={{ ...styles.statValue, color: stat.color }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      {stat.suffix && <span style={styles.statSuffix}>{stat.suffix}</span>}
                    </div>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={{ ...styles.statGlow, background: `radial-gradient(circle at 50% 0%, ${stat.glow}, transparent 70%)` }} />
                  </div>
                ))}
              </div>

              <div style={styles.contentRow}>
                <div style={styles.glassPanel}>
                  <div style={styles.panelHeader}>
                    <span style={styles.panelDot} />
                    <span style={styles.panelTitle}>LIVE TERMINAL</span>
                    <span style={styles.panelBadge}>SSE</span>
                  </div>
                  <div style={styles.scanlineOverlay} className="scanline-anim" />
                  <div ref={terminalRef} style={styles.terminal}>
                    {terminalLines.map((line, i) => (
                      <div key={i} style={styles.terminalLine}>
                        <span style={styles.terminalTime}>[{line.time}]</span>
                        <span style={{
                          ...styles.terminalText,
                          color: line.type === 'error' ? '#ff003c'
                            : line.type === 'success' ? '#00ff88'
                            : line.type === 'warning' ? '#ffaa00'
                            : line.type === 'complete' ? '#00fff7'
                            : '#00ff88',
                        }}>
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.scanProgressPanel}>
                  <div style={styles.progressCircle}>
                    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="90" cy="90" r="80" stroke="#1a1a2e" strokeWidth="8" fill="none" />
                      <circle
                        cx="90"
                        cy="90"
                        r="80"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(scanProgress / 100) * 502} 502`}
                        style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,247,0.5))' }}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00fff7" />
                          <stop offset="50%" stopColor="#bf00ff" />
                          <stop offset="100%" stopColor="#ff003c" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={styles.progressCenter}>
                      <div style={styles.progressPercent}>{Math.floor(scanProgress)}%</div>
                      <div style={styles.progressLabel}>PROGRESS</div>
                    </div>
                  </div>

                  <div style={styles.scanPhases}>
                    {scanLogs.map((log, i) => (
                      <div key={i} style={styles.phaseItem}>
                        <div style={{
                          ...styles.phaseIcon,
                          color: log.status === 'complete' ? '#00ff88'
                            : log.status === 'active' ? '#00fff7'
                            : '#444',
                        }}>
                          {log.status === 'complete' ? '✓' : log.status === 'active' ? '◉' : '○'}
                        </div>
                        <div style={styles.phaseInfo}>
                          <span style={styles.phaseCode}>[{log.phase}]</span>
                          <span style={{
                            ...styles.phaseText,
                            color: log.status === 'complete' ? '#00ff88'
                              : log.status === 'active' ? '#00fff7'
                              : '#666',
                          }}>
                            {log.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.glassPanel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelDot} />
                  <span style={styles.panelTitle}>FILE TYPE DISTRIBUTION</span>
                </div>
                <div style={styles.fileTypeGrid}>
                  {fileTypes.map((type, i) => (
                    <div key={i} style={styles.fileTypeItem}>
                      <div style={styles.fileTypeHeader}>
                        <span style={{ ...styles.fileTypeExt, color: type.color }}>{type.ext}</span>
                        <span style={styles.fileTypeCount}>{type.count.toLocaleString()} files</span>
                        <span style={styles.fileTypeSize}>{type.size}</span>
                      </div>
                      <div style={styles.fileTypeBar}>
                        <div
                          style={{
                            ...styles.fileTypeBarFill,
                            width: `${type.percent}%`,
                            background: `linear-gradient(90deg, ${type.color}, ${type.color}88)`,
                            boxShadow: `0 0 10px ${type.color}`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activePanel === 'terminal' && (
            <div style={styles.glassPanel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelDot} />
                <span style={styles.panelTitle}>SYSTEM TERMINAL</span>
                <div style={styles.terminalActions}>
                  <button style={styles.terminalBtn}>Clear</button>
                  <button style={{ ...styles.terminalBtn, ...styles.terminalBtnPrimary }}>Export</button>
                </div>
              </div>
              <div ref={terminalRef} style={styles.terminalFull} className="terminal-full">
                {terminalLines.map((line, i) => (
                  <div key={i} style={styles.terminalLine}>
                    <span style={styles.terminalTime}>[{line.time}]</span>
                    <span style={{
                      ...styles.terminalText,
                      color: line.type === 'error' ? '#ff003c'
                        : line.type === 'success' ? '#00ff88'
                        : line.type === 'warning' ? '#ffaa00'
                        : line.type === 'complete' ? '#00fff7'
                        : '#00ff88',
                    }}>
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'results' && (
            <div style={styles.resultsGrid}>
              <div style={styles.glassPanel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelDot} />
                  <span style={styles.panelTitle}>QUICK ACTIONS</span>
                </div>
                <div style={styles.actionList} className="action-list">
                  {[
                    { icon: '🗑️', label: 'Clean Duplicates', color: '#00fff7' },
                    { icon: '📦', label: 'Archive Large Files', color: '#bf00ff' },
                    { icon: '🕐', label: 'Remove Old Files', color: '#00ff88' },
                    { icon: '💾', label: 'Move to SSD', color: '#ffaa00' },
                  ].map((action, i) => (
                    <button key={i} style={{ ...styles.actionBtn, borderColor: action.color }}>
                      <span style={{ fontSize: 20 }}>{action.icon}</span>
                      <span style={{ color: action.color }}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.glassPanel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelDot} />
                  <span style={styles.panelTitle}>STORAGE ANALYSIS</span>
                </div>
                <div style={styles.storageBar}>
                  <div style={{ ...styles.storageSegment, width: '45%', background: 'linear-gradient(90deg, #00fff7, #0088ff)' }}>Media 45%</div>
                  <div style={{ ...styles.storageSegment, width: '20%', background: 'linear-gradient(90deg, #bf00ff, #ff00ff)' }}>Apps 20%</div>
                  <div style={{ ...styles.storageSegment, width: '15%', background: 'linear-gradient(90deg, #00ff88, #00cc66)' }}>Docs 15%</div>
                  <div style={{ ...styles.storageSegment, width: '10%', background: 'linear-gradient(90deg, #ffaa00, #ff6600)' }}>Other 10%</div>
                  <div style={{ ...styles.storageSegment, width: '10%', background: '#333' }}>Free</div>
                </div>
                <div style={styles.storageStats}>
                  <div style={styles.storageStat}>
                    <span style={styles.storageLabel}>Used</span>
                    <span style={{ ...styles.storageValue, color: '#00fff7' }}>234.5 GB</span>
                  </div>
                  <div style={styles.storageStat}>
                    <span style={styles.storageLabel}>Free</span>
                    <span style={{ ...styles.storageValue, color: '#00ff88' }}>489.2 GB</span>
                  </div>
                  <div style={styles.storageStat}>
                    <span style={styles.storageLabel}>Total</span>
                    <span style={{ ...styles.storageValue, color: '#bf00ff' }}>723.7 GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div style={styles.glassPanel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelDot} />
                <span style={styles.panelTitle}>SYSTEM CONFIGURATION</span>
              </div>
              <div style={styles.settingsGrid}>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Theme</label>
                  <select style={styles.settingSelect}>
                    <option>Cyberpunk (Default)</option>
                    <option>Matrix</option>
                    <option>Holographic</option>
                  </select>
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Accent Color</label>
                  <div style={styles.colorPicker}>
                    <div style={{ ...styles.colorSwatch, backgroundColor: '#00fff7', border: '2px solid #00fff7' }} />
                    <div style={{ ...styles.colorSwatch, backgroundColor: '#bf00ff' }} />
                    <div style={{ ...styles.colorSwatch, backgroundColor: '#ff003c' }} />
                    <div style={{ ...styles.colorSwatch, backgroundColor: '#00ff88' }} />
                  </div>
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Auto-scan on startup</label>
                  <input type="checkbox" defaultChecked style={styles.settingCheckbox} />
                </div>
                <div style={styles.settingItem}>
                  <label style={styles.settingLabel}>Sound effects</label>
                  <input type="checkbox" style={styles.settingCheckbox} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Share Tech Mono', monospace",
    backgroundColor: '#0a0a0f',
    minHeight: '100vh',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundEffects: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgGradient1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(0,255,247,0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
  },
  bgGradient2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: 500,
    height: 500,
    background: 'radial-gradient(circle, rgba(191,0,255,0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
  },
  bgGradient3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 800,
    background: 'radial-gradient(circle, rgba(0,255,247,0.03) 0%, transparent 70%)',
    filter: 'blur(80px)',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(0,255,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,247,0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 70,
    background: 'rgba(10,10,15,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0,255,247,0.2)',
    position: 'relative',
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    background: 'linear-gradient(135deg, #00fff7, #0088ff)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    boxShadow: '0 0 20px rgba(0,255,247,0.4), 0 0 40px rgba(0,255,247,0.2)',
  },
  logoText: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #00fff7, #bf00ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: 3,
  },
  logoSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9,
    color: 'rgba(0,255,247,0.5)',
    letterSpacing: 2,
    marginTop: 2,
  },
  navTabs: {
    display: 'flex',
    gap: 4,
    marginLeft: 60,
  },
  navTab: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 6,
    color: '#888',
    fontSize: 11,
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  navTabActive: {
    background: 'rgba(0,255,247,0.1)',
    borderColor: 'rgba(0,255,247,0.3)',
    color: '#00fff7',
  },
  navRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  progressBar: {
    width: 120,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00fff7, #bf00ff)',
    borderRadius: 3,
    transition: 'width 0.3s ease',
    boxShadow: '0 0 10px rgba(0,255,247,0.5)',
  },
  mainLayout: {
    display: 'flex',
    height: 'calc(100vh - 70px)',
    position: 'relative',
    zIndex: 1,
  },
  sidebar: {
    width: 300,
    padding: 20,
    background: 'rgba(10,10,15,0.8)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(0,255,247,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    overflowY: 'auto',
  },
  glassPanel: {
    background: 'rgba(20,20,30,0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,255,247,0.15)',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  panelDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#00fff7',
    boxShadow: '0 0 10px #00fff7',
  },
  panelTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 10,
    letterSpacing: 3,
    color: 'rgba(0,255,247,0.7)',
    flex: 1,
  },
  panelBadge: {
    fontSize: 8,
    padding: '2px 6px',
    background: 'rgba(0,255,247,0.2)',
    borderRadius: 4,
    color: '#00fff7',
  },
  folderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
  },
  folderItemActive: {
    background: 'rgba(0,255,247,0.1)',
    borderColor: 'rgba(0,255,247,0.3)',
    boxShadow: '0 0 20px rgba(0,255,247,0.1)',
  },
  folderIcon: {
    fontSize: 20,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 13,
    color: '#fff',
  },
  folderMeta: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  folderIndicator: {
    width: 4,
    height: 30,
    borderRadius: 2,
    opacity: 0.5,
  },
  configSection: {
    marginBottom: 16,
  },
  configLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
    display: 'block',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 4,
    WebkitAppearance: 'none',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    outline: 'none',
  },
  sliderValue: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 10,
    color: '#00fff7',
    minWidth: 60,
    textAlign: 'right',
  },
  scanButton: {
    width: '100%',
    padding: 16,
    background: 'linear-gradient(135deg, #00fff7, #0088ff)',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 0 30px rgba(0,255,247,0.4)',
    transition: 'all 0.3s ease',
  },
  scanButtonDisabled: {
    background: '#333',
    color: '#666',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  stopButton: {
    width: '100%',
    padding: 12,
    background: 'transparent',
    border: '1px solid rgba(255,0,60,0.5)',
    borderRadius: 8,
    color: '#ff003c',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11,
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  statCard: {
    padding: 24,
    background: 'linear-gradient(135deg, rgba(20,20,30,0.8), rgba(10,10,20,0.9))',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  statValue: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 32,
    fontWeight: 700,
  },
  statSuffix: {
    fontSize: 16,
    marginLeft: 4,
  },
  statLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9,
    letterSpacing: 2,
    color: '#666',
    marginTop: 8,
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    pointerEvents: 'none',
  },
  contentRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: 20,
  },
  terminal: {
    height: 200,
    overflowY: 'auto',
    padding: 12,
    background: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    fontSize: 12,
  },
  scanlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  terminalLine: {
    display: 'flex',
    gap: 12,
    padding: '2px 0',
  },
  terminalTime: {
    color: '#444',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10,
  },
  terminalText: {
    fontFamily: "'Share Tech Mono', monospace",
  },
  scanProgressPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  progressCircle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenter: {
    position: 'absolute',
    textAlign: 'center',
  },
  progressPercent: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 0 20px rgba(0,255,247,0.5)',
  },
  progressLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8,
    letterSpacing: 2,
    color: '#666',
  },
  scanPhases: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  phaseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  phaseIcon: {
    fontSize: 12,
    width: 20,
    textAlign: 'center',
  },
  phaseInfo: {
    display: 'flex',
    gap: 8,
  },
  phaseCode: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9,
    color: '#444',
  },
  phaseText: {
    fontSize: 11,
  },
  fileTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  fileTypeItem: {
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  fileTypeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fileTypeExt: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 12,
    fontWeight: 700,
  },
  fileTypeCount: {
    fontSize: 11,
    color: '#888',
  },
  fileTypeSize: {
    fontSize: 11,
    color: '#666',
  },
  fileTypeBar: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fileTypeBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  terminalFull: {
    height: 'calc(100vh - 250px)',
    overflowY: 'auto',
    padding: 16,
    background: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    fontSize: 12,
  },
  terminalActions: {
    display: 'flex',
    gap: 8,
  },
  terminalBtn: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: 4,
    color: '#888',
    fontSize: 10,
    cursor: 'pointer',
  },
  terminalBtnPrimary: {
    background: 'rgba(0,255,247,0.2)',
    color: '#00fff7',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  actionList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11,
    letterSpacing: 1,
  },
  storageBar: {
    display: 'flex',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  storageSegment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: '#fff',
    fontFamily: "'Share Tech Mono', monospace",
  },
  storageStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  storageStat: {
    padding: 12,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    textAlign: 'center',
  },
  storageLabel: {
    fontSize: 10,
    color: '#666',
    display: 'block',
    marginBottom: 4,
  },
  storageValue: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 16,
    fontWeight: 700,
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  settingLabel: {
    fontSize: 12,
    color: '#888',
  },
  settingSelect: {
    padding: 10,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(0,255,247,0.2)',
    borderRadius: 6,
    color: '#fff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12,
    outline: 'none',
  },
  colorPicker: {
    display: 'flex',
    gap: 12,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
  },
  settingCheckbox: {
    width: 20,
    height: 20,
    accentColor: '#00fff7',
  },
};

export default ByteSweepScanner;
