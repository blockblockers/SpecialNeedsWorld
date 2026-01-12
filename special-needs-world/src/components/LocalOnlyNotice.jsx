// LocalOnlyNotice.jsx - Privacy notice for local-only data storage
import { Shield, Smartphone } from 'lucide-react';

const LocalOnlyNotice = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-xs font-crayon">
        <Shield size={14} className="text-green-600" />
        <span>Stored on this device only (privacy protected)</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-green-50 rounded-xl border-2 border-green-200">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-green-100 rounded-lg">
          <Shield size={18} className="text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-crayon text-green-800 text-sm font-medium">
            🔒 Your Privacy is Protected
          </p>
          <p className="font-crayon text-green-700 text-xs mt-1">
            This data stays on your device only and is never uploaded to any server. 
            This protects your health information.
          </p>
          <div className="flex items-center gap-1 mt-2 text-green-600">
            <Smartphone size={12} />
            <span className="text-xs font-crayon">Device-only storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalOnlyNotice;
