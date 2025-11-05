import React, { useState, useMemo } from 'react';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import { ImageIcon, DownloadIcon, WandSparklesIcon, EyeIcon } from './components/icons';
import { MontageMode } from './types';
import { createMontage } from './services/geminiService';
import PreviewModal from './components/PreviewModal';

const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [characterToReplace, setCharacterToReplace] = useState<string>('');
  const [montageMode, setMontageMode] = useState<MontageMode>('insert');
  const [optionalDetails, setOptionalDetails] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  
  const isFormValid = useMemo(() => {
    return characterImage && sceneImage && characterToReplace.trim() !== '';
  }, [characterImage, sceneImage, characterToReplace]);

  const handleGenerateMontage = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await createMontage(
        characterImage!,
        sceneImage!,
        characterToReplace,
        montageMode,
        optionalDetails
      );
      setGeneratedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'montage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 uppercase tracking-wider">
              Character
            </h1>
            <p className="mt-1 text-2xl sm:text-3xl text-slate-300">
              into the scene
            </p>
          </div>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Blend characters into new scenes. Replace existing figures or recreate entire worlds with AI.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader id="character-upload" label="1. Upload Character (with white background)" onImageUpload={setCharacterImage} />
                <ImageUploader id="scene-upload" label="2. Upload Scene" onImageUpload={setSceneImage} />
            </div>

            <div>
              <label htmlFor="character-replace" className="block text-sm font-medium text-slate-300 mb-2">3. Character to Replace</label>
              <input
                type="text"
                id="character-replace"
                value={characterToReplace}
                onChange={(e) => setCharacterToReplace(e.target.value)}
                placeholder="e.g., 'the man in the red suit'"
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="montage-mode" className="block text-sm font-medium text-slate-300 mb-2">4. Montage Mode</label>
              <select
                id="montage-mode"
                value={montageMode}
                onChange={(e) => setMontageMode(e.target.value as MontageMode)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="insert">Insert into original scene</option>
                <option value="recreate">Recreate scene with character</option>
              </select>
            </div>

            <div>
              <label htmlFor="optional-details" className="block text-sm font-medium text-slate-300 mb-2">5. Optional Details (Posture, Expression)</label>
              <textarea
                id="optional-details"
                value={optionalDetails}
                onChange={(e) => setOptionalDetails(e.target.value)}
                rows={3}
                placeholder="e.g., 'make the character look surprised'"
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <button
              onClick={handleGenerateMontage}
              disabled={!isFormValid || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out"
            >
              {isLoading ? 'Generating...' : 'Create Montage'}
              <WandSparklesIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col justify-center items-center min-h-[400px] lg:min-h-full">
            {isLoading && (
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-slate-400">AI is crafting your image... Please wait.</p>
                </div>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {!isLoading && !error && generatedImage && (
              <div className="w-full text-center">
                <img src={generatedImage} alt="Generated Montage" className="max-w-full max-h-[500px] object-contain rounded-md mx-auto" />
                <div className="mt-4 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md transition"
                  >
                    <EyeIcon className="w-5 h-5" />
                    Preview
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Download Image
                  </button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && !generatedImage && (
                <div className="text-center text-slate-500">
                    <ImageIcon className="w-20 h-20 mx-auto" />
                    <p className="mt-4 text-lg">Your generated montage will appear here.</p>
                </div>
            )}
          </div>
        </main>
        
        {isPreviewOpen && generatedImage && (
            <PreviewModal imageUrl={generatedImage} onClose={() => setIsPreviewOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default App;