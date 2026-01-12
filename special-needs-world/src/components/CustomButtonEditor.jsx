// CustomButtonEditor.jsx - Edit AAC button icons with custom images
import { useState, useRef } from 'react';
import { X, Upload, Camera, Trash2, Check, Image, Edit3 } from 'lucide-react';
import { imageStorage, compressImage } from '../services/storage';

const CustomButtonEditor = ({ 
  button, 
  customImage, 
  onSave, 
  onRemove, 
  onClose 
}) => {
  const [previewImage, setPreviewImage] = useState(customImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [customText, setCustomText] = useState(button?.text || '');
  const fileInputRef = useRef(null);
  
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Compress image
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
      buttonId: button.id,
      customImage: previewImage,
      customText: customText !== button.text ? customText : null,
    });
    onClose();
  };
  
  const handleRemoveCustom = () => {
    setPreviewImage(null);
    setCustomText(button.text);
    onRemove(button.id);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8E6BBF]">
        {/* Header */}
        <div className="bg-[#8E6BBF] text-white p-4 flex items-center justify-between">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Edit3 size={24} />
            Customize Button
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Current Button Preview */}
          <div className="text-center">
            <p className="font-crayon text-sm text-gray-600 mb-3">Current Button:</p>
            <div 
              className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center border-4 shadow-crayon"
              style={{ backgroundColor: button.color, borderColor: button.color }}
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={customText}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl">{button.emoji}</span>
              )}
            </div>
            <p className="font-display text-lg mt-2 text-gray-800">{customText}</p>
          </div>
          
          {/* Custom Text */}
          <div>
            <label className="font-crayon text-sm text-gray-600 block mb-2">
              Button Text:
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 rounded-xl border-3 border-gray-300 font-crayon focus:border-[#8E6BBF] focus:outline-none"
              placeholder="What should this button say?"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="font-crayon text-sm text-gray-600 block mb-2">
              Custom Image:
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 p-4 rounded-xl border-3 border-dashed border-[#4A9FD4] bg-[#4A9FD4]/10 hover:bg-[#4A9FD4]/20 transition-colors"
              >
                {isUploading ? (
                  <div className="w-6 h-6 border-3 border-[#4A9FD4] border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-[#4A9FD4] mb-1" />
                    <span className="font-crayon text-sm text-[#4A9FD4]">Upload Photo</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  const input = fileInputRef.current;
                  if (input) {
                    input.setAttribute('capture', 'environment');
                    input.click();
                  }
                }}
                disabled={isUploading}
                className="flex-1 p-4 rounded-xl border-3 border-dashed border-[#5CB85C] bg-[#5CB85C]/10 hover:bg-[#5CB85C]/20 transition-colors"
              >
                <Camera size={24} className="mx-auto text-[#5CB85C] mb-1" />
                <span className="font-crayon text-sm text-[#5CB85C]">Take Photo</span>
              </button>
            </div>
          </div>
          
          {/* Preview */}
          {previewImage && (
            <div className="p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-crayon text-sm text-gray-600">Preview</span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-[#E63B2E] font-crayon text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
              <img 
                src={previewImage} 
                alt="Preview" 
                className="mt-2 w-20 h-20 rounded-xl object-cover mx-auto"
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 space-y-2">
          {(previewImage || customText !== button.text) && (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#5CB85C] text-white rounded-xl font-crayon flex items-center justify-center gap-2"
            >
              <Check size={20} /> Save Changes
            </button>
          )}
          
          {customImage && (
            <button
              onClick={handleRemoveCustom}
              className="w-full py-3 bg-[#E63B2E] text-white rounded-xl font-crayon flex items-center justify-center gap-2"
            >
              <Trash2 size={20} /> Remove Customization
            </button>
          )}
          
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

export default CustomButtonEditor;
