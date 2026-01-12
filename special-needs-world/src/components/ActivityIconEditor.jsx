// ActivityIconEditor.jsx - Custom icon editor for Visual Schedule activities
import { useState, useRef } from 'react';
import { X, Upload, Camera, Trash2, Check, Image, Edit3 } from 'lucide-react';
import { compressImage } from '../services/storage';

const ActivityIconEditor = ({ 
  activity, 
  onSave, 
  onClose 
}) => {
  const [previewImage, setPreviewImage] = useState(activity?.customImage || null);
  const [customName, setCustomName] = useState(activity?.name || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 200, 200, 0.8);
      setPreviewImage(compressed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSave = () => {
    onSave({
      customImage: previewImage,
      customName: customName !== activity.name ? customName : null,
    });
    onClose();
  };
  
  const handleRemoveImage = () => {
    setPreviewImage(null);
  };
  
  const IconComponent = activity?.icon;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E63B2E]">
        {/* Header */}
        <div className="bg-[#E63B2E] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Edit3 size={24} />
            Customize Activity
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Current Activity Preview */}
          <div className="text-center">
            <p className="font-crayon text-sm text-gray-600 mb-3">Current Icon:</p>
            <div 
              className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center border-4 shadow-crayon overflow-hidden"
              style={{ 
                backgroundColor: activity?.color || '#9B59B6', 
                borderColor: activity?.color || '#9B59B6' 
              }}
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={customName}
                  className="w-full h-full object-cover"
                />
              ) : IconComponent ? (
                <IconComponent size={40} className="text-white" />
              ) : (
                <span className="text-4xl">⭐</span>
              )}
            </div>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="mt-3 w-full text-center font-display text-lg bg-transparent border-b-2 border-dashed border-gray-300 focus:border-[#E63B2E] focus:outline-none px-2 py-1"
              placeholder="Activity name"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="font-crayon text-sm text-gray-600 block mb-2">
              Custom Photo:
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fileInputRef.current?.removeAttribute('capture');
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className="flex-1 p-4 rounded-xl border-3 border-dashed border-[#4A9FD4] bg-[#4A9FD4]/10 hover:bg-[#4A9FD4]/20 transition-colors"
              >
                {isUploading ? (
                  <div className="w-6 h-6 border-3 border-[#4A9FD4] border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-[#4A9FD4] mb-1" />
                    <span className="font-crayon text-sm text-[#4A9FD4]">Upload</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  fileInputRef.current?.setAttribute('capture', 'environment');
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className="flex-1 p-4 rounded-xl border-3 border-dashed border-[#5CB85C] bg-[#5CB85C]/10 hover:bg-[#5CB85C]/20 transition-colors"
              >
                <Camera size={24} className="mx-auto text-[#5CB85C] mb-1" />
                <span className="font-crayon text-sm text-[#5CB85C]">Camera</span>
              </button>
            </div>
          </div>
          
          {/* Preview with remove option */}
          {previewImage && (
            <div className="p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-crayon text-sm text-gray-600">Custom Image</span>
                <button
                  onClick={handleRemoveImage}
                  className="text-[#E63B2E] font-crayon text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-20 h-20 rounded-xl object-cover mx-auto"
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon flex items-center justify-center gap-2"
          >
            <Check size={20} /> Save Changes
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-600 rounded-xl font-crayon"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityIconEditor;
