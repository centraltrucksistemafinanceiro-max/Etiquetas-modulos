
import React from 'react';
import StyledQRCode from './StyledQRCode';
import { LabelData, LabelSettings } from '../types';

interface LabelProps {
  id?: string;
  data: LabelData;
  type: 'main' | 'meta';
  settings: LabelSettings;
  isPrint?: boolean;
}

const LabelComponent: React.FC<LabelProps> = ({ id, data, type, settings, isPrint }) => {
  const generateQRValue = () => {
    try {
      const url = new URL(window.location.origin);
      if (id) {
        url.searchParams.set('id', id);
      } else {
        const dataString = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(dataString)));
        url.searchParams.set('v', encoded);
      }
      return url.toString();
    } catch (e) {
      return `CLIENTE: ${data.cliente || '-'}\nOS: ${data.os || '-'}\nPLACA: ${data.placa || '-'}`;
    }
  };

  const qrValue = generateQRValue();

  const labelStyle: React.CSSProperties = {
    width: `${settings.width}mm`,
    height: `${settings.height}mm`,
    paddingLeft: '2mm',
    paddingRight: '2mm',
    paddingBottom: '2mm',
    paddingTop: `${settings.paddingTop}mm`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineSpacing,
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: 'black',
    border: isPrint ? 'none' : '1px solid #ffffff',
    borderRadius: isPrint ? '0' : '2px',
    boxShadow: isPrint ? 'none' : '0 20px 50px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'left'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '110%', 
    textTransform: 'uppercase', 
    fontWeight: '900',
    borderBottom: '0.4mm solid #000',
    marginBottom: '1.5mm',
    paddingBottom: '0.8mm',
    paddingTop: '0.8mm', // Espaço extra no topo e base para evitar cortes
    width: '100%',
    lineHeight: '1.2',
    textAlign: 'center',
    display: 'block',
    wordBreak: 'break-word'
  };

  if (type === 'main') {
    // Calcula o tamanho base do QR Code usando a porcentagem definida nos ajustes
    const qrMultiplier = (settings.qrSize || 45) / 100;
    const qrSizeMm = Math.min(settings.width * qrMultiplier, settings.height * qrMultiplier);
    const qrSizePx = qrSizeMm * 3.78;

    return (
      <div style={labelStyle}>
        <div style={headerStyle}>
          {data.cliente || '-'}
        </div>
        <div style={{ textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', gap: '1mm', marginBottom: '0.5mm' }}>
          <span style={{ flexShrink: 0 }}>O.S:</span> 
          <span style={{ textAlign: 'right', wordBreak: 'break-all' }}>{data.os || '-'}</span>
        </div>
        <div style={{ textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', gap: '1mm', marginBottom: '0.5mm' }}>
          <span style={{ flexShrink: 0 }}>PLACA:</span> 
          <span style={{ textAlign: 'right', wordBreak: 'break-all' }}>{data.placa || '-'}</span>
        </div>
        <div style={{ textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', gap: '1mm', marginBottom: '0.5mm' }}>
          <span style={{ flexShrink: 0 }}>ID/SN:</span> 
          <span style={{ textAlign: 'right', wordBreak: 'break-all' }}>{data.frota || '-'}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          paddingTop: '0.5mm',
          width: '100%'
        }}>
          <StyledQRCode 
            value={qrValue} 
            size={qrSizePx}
          />
          
          <div style={{ 
            marginTop: '1mm', 
            textAlign: 'center', 
            width: '100%',
            lineHeight: '1'
          }}>
            <div style={{ 
              color: 'black', 
              fontSize: '9px', 
              fontWeight: '900',
              textTransform: 'uppercase'
            }}>
              Central Truck
            </div>
            <div style={{ 
              color: 'black', 
              fontSize: '5px', 
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              Sistema Financeiro
            </div>
            {data.shortId && (
              <div style={{ 
                fontSize: '10px', 
                fontWeight: '900',
                marginTop: '1.5mm',
                border: '0.3mm solid black',
                padding: '0.2mm 2mm',
                display: 'inline-block'
              }}>
                #{data.shortId}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={labelStyle}>
      <div style={headerStyle}>
        DATA: {data.data ? data.data.split('-').reverse().join('/') : '-'}
      </div>
      <div style={{ 
        fontSize: '90%', 
        textTransform: 'uppercase', 
        textAlign: 'left',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap', 
        overflow: 'hidden',
        flex: 1,
        marginTop: '0.5mm'
      }}>
        OBS: {data.observacao || '-'}
      </div>
      {!isPrint && (
        <div className="absolute bottom-1 right-1 opacity-20 pointer-events-none">
          <div className="text-[5px] text-slate-400">#2</div>
        </div>
      )}
    </div>
  );
};

export default LabelComponent;
