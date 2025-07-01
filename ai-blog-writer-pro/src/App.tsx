import React, { useState, useCallback, useEffect } from 'react';
import AIBlogWriterSidebar from './components/AIBlogWriterSidebar';
import { Icon } from './components/ui/Icon';

declare const wp: any;

function App() {
  const [postContent, setPostContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get post content from the editor
  useEffect(() => {
    // Using wp.data.subscribe is the recommended, most efficient way to listen for editor changes.
    const updateContent = () => {
      if (wp?.data?.select) {
        const { getBlocks } = wp.data.select('core/block-editor') || {};
        if (getBlocks) {
          // Recreate post content from blocks' inner HTML or content attributes
          const allContent = getBlocks().map((block: any) => block.attributes.content || '').join('\n\n');
          setPostContent(allContent);
        }
      }
    };
    
    const unsubscribe = wp?.data?.subscribe(updateContent);
    // Initial load
    updateContent();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };

  }, []);

  const handleAcceptContent = useCallback((content: string) => {
    if (wp?.blocks?.createBlock && wp?.data?.dispatch) {
      // Use WordPress core functions to insert content
      const { createBlock } = wp.blocks;
      const { insertBlocks } = wp.data.dispatch('core/block-editor');
      
      // Split content by double newlines to respect paragraph breaks from markdown
      const paragraphs = content.split(/\n{2,}/).filter(p => p.trim() !== '');
      
      // Create a separate paragraph block for each segment
      const blocks = paragraphs.map(p => createBlock('core/paragraph', { content: p.trim() }));
      
      if (blocks.length > 0) {
        insertBlocks(blocks);
      }
    }
  }, []);

  return (
    <div className="font-sans text-slate-800 dark:text-slate-200">
      {/* Floating Action Button to toggle sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-8 right-8 z-[99999] w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
        aria-label="Toggle AI Assistant"
      >
        <Icon name="sparkles" className="w-8 h-8"/>
      </button>

      {/* AI Sidebar */}
      <AIBlogWriterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        postContent={postContent}
        onAcceptContent={handleAcceptContent}
      />
    </div>
  );
}

export default App;
