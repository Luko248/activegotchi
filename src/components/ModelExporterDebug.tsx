import React from 'react';
import { usePetStore } from '../store/petStore';
import modelExporter from '../services/modelExporter';

/**
 * Debug component to export 3D models to GLB format
 * Integrated into the debug panel
 */
export const ModelExporterDebug: React.FC = () => {
  const pet = usePetStore(s => s.pet);

  const handleExportModels = async () => {
    try {
      console.log('Starting model export...');
      await modelExporter.generateAllMoodModels({
        primaryColor: pet?.primaryColor || '#7CC6FF',
        name: pet?.name || 'ActiveGotchi'
      });
      console.log('Model export completed!');
      alert('Models exported! Check your Downloads folder for GLB files.');
    } catch (error) {
      console.error('Model export failed:', error);
      alert('Model export failed. Check console for details.');
    }
  };

  const handleExportSingleModel = async (mood: string) => {
    try {
      console.log(`Exporting ${mood} model...`);
      
      const model = modelExporter.createPetModel({
        mood,
        primaryColor: pet?.primaryColor || '#7CC6FF',
        name: pet?.name || 'ActiveGotchi'
      });

      const glbBuffer = await modelExporter.exportToGLB(model);
      
      // Create download link
      const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `activegotchi_pet_${mood}.glb`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      console.log(`${mood} model exported successfully`);
      alert(`${mood.charAt(0).toUpperCase() + mood.slice(1)} model exported!`);
      
    } catch (error) {
      console.error(`Failed to export ${mood} model:`, error);
      alert(`Failed to export ${mood} model. Check console for details.`);
    }
  };

  // AR support detection
  const getARSupport = () => {
    const isIPhone = /iPhone/.test(navigator.userAgent);
    const iOSVersion = parseInt(navigator.userAgent.match(/OS (\d+)_/)?.[1] || '0');
    const hasQuickLook = isIPhone && iOSVersion >= 12;
    const hasWebXR = 'xr' in navigator;
    const isHTTPS = window.location.protocol === 'https:';
    
    return {
      device: isIPhone ? 'iPhone' : 'Other',
      iOSVersion: isIPhone ? iOSVersion : null,
      quickLook: hasQuickLook,
      webXR: hasWebXR,
      protocol: window.location.protocol,
      httpsRequired: !isHTTPS && (hasQuickLook || hasWebXR),
      arSupported: (hasQuickLook || hasWebXR) && isHTTPS
    };
  };

  const arInfo = getARSupport();

  return (
    <div className="border-t border-white/20 pt-3 mt-3 space-y-3">
      {/* AR Support Info */}
      <div>
        <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">AR Support</div>
        <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
          <div>Device: {arInfo.device} {arInfo.iOSVersion && `(iOS ${arInfo.iOSVersion})`}</div>
          <div>Protocol: {arInfo.protocol}</div>
          <div>Quick Look: {arInfo.quickLook ? '✅' : '❌'}</div>
          <div>WebXR: {arInfo.webXR ? '✅' : '❌'}</div>
          <div className={arInfo.arSupported ? 'text-green-600' : 'text-red-600'}>
            AR Ready: {arInfo.arSupported ? '✅' : '❌'}
          </div>
          {arInfo.httpsRequired && (
            <div className="text-orange-600 text-xs mt-1">
              ⚠️ HTTPS required for AR on iOS
            </div>
          )}
        </div>
      </div>

      {/* Model Exporter */}
      <div>
        <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">Model Exporter</div>
        
        <div className="space-y-2">
          <button
            onClick={handleExportModels}
            className="w-full px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Export All Models
          </button>
          
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleExportSingleModel('happy')}
              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Happy
            </button>
            <button
              onClick={() => handleExportSingleModel('neutral')}
              className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Neutral
            </button>
            <button
              onClick={() => handleExportSingleModel('sad')}
              className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Sad
            </button>
            <button
              onClick={() => handleExportSingleModel('sleepy')}
              className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
              Sleepy
            </button>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Export 3D models as GLB files for AR
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelExporterDebug;