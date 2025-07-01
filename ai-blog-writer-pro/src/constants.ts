import { Tab, TabId } from './types';

export const TABS: Tab[] = [
  { id: TabId.CONTENT, label: 'Content', icon: 'edit' },
  { id: TabId.SEO, label: 'SEO', icon: 'trending-up' },
  { id: TabId.KEYWORDS, label: 'Keywords', icon: 'key' },
  { id: TabId.SUMMARY, label: 'Summary', icon: 'clipboard-document-list' },
];
