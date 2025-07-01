import React from 'react';
import { Modal } from './ui/Modal';
import { Icon } from './ui/Icon';
import { Accordion } from './ui/Accordion';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plugin Help & FAQs">
      <div className="text-sm text-slate-600 dark:text-slate-300 space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-100">Tab Overview</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Icon name="edit" className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-semibold">Content Tab:</span> Your main creation hub. Generate anything from blog post titles and outlines to full articles. Use the detailed controls for word count, keywords, and structure to craft content that perfectly fits your needs.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="trending-up" className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-semibold">SEO Tab:</span> Analyze your written content against a focus keyword. It provides scores and actionable suggestions for your title, meta description, readability, and keyword density to help you rank better.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="key" className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-semibold">Keywords Tab:</span> Stuck for ideas? Enter a topic to discover related keywords. It provides estimated search volume and a difficulty score to help you choose the best keywords to target.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="clipboard-document-list" className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-semibold">Summary Tab:</span> Get a high-level, AI-powered report of your post. This tab gives you an overall SEO score, identifies main keywords, checks readability, and offers actionable insights to improve your work.
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-100">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-2">
            <Accordion title="Why aren't the AI features working?">
              <p>The most common reason is a missing or invalid API key. This is a "Bring Your Own Key" plugin, so it requires a Google Gemini API key to function. Please ensure you have set a valid API key in the WordPress admin settings page for this plugin. You should also check your internet connection.</p>
            </Accordion>
            <Accordion title="Is this plugin free? How much does it cost?">
               <p>The plugin itself is free. However, it uses the Google Gemini API, which has its own usage-based pricing. You are responsible for any costs incurred from your API usage. Please check Google's official pricing for the Gemini models for more details.</p>
            </Accordion>
            <Accordion title="Does this plugin store my content or API key on its servers?">
              <p>No. Your privacy and security are paramount. Your post content is sent directly from your browser to the Google Gemini API (via your server) for processing and is not stored long-term. Your API key is stored securely in your WordPress database, on your own server. It is never sent to our servers.</p>
            </Accordion>
            <Accordion title="What does the 'Difficulty' score on the Keywords tab mean?">
              <p>Difficulty (from 0-100) is an estimate of how hard it is to rank on the first page of Google for that keyword. A lower score (e.g., 0-30) suggests it's easier to rank for, while a higher score (e.g., 70+) indicates very high competition from established sites.</p>
            </Accordion>
            <Accordion title="How do I use the 'Accept' button in the Content tab?">
              <p>When content is generated, clicking "Accept" will insert the new AI-written text into your post in the main editor. This allows you to build a full article piece by piece, for example by generating an outline, then an intro, then expanding each section.</p>
            </Accordion>
            <Accordion title="The AI gave me a bad result. What can I do?">
              <p>AI is not perfect! If you get a result you don't like, try clicking "Regenerate". You can also try making your topic/instruction more specific, or adjusting the "Creativity" slider. A "Focused" setting gives more predictable results, while "Creative" can sometimes produce more interesting, but less accurate, content.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal;
