import React from 'react';

const DebugPanel = ({ debugInfo }) => {
  return (
    <div style={{
      background: '#222', color: '#fff', padding: '1rem', margin: '1rem 0', borderRadius: '8px', fontSize: '0.95rem', maxHeight: '300px', overflowY: 'auto'
    }}>
      <h3 style={{marginTop:0}}>Debug/Test Panel</h3>
      {debugInfo ? (
        <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{JSON.stringify(debugInfo, null, 2)}</pre>
      ) : (
        <span>Henüz veri yok.</span>
      )}
    </div>
  );
};

export default DebugPanel;
