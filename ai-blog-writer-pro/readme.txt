
=== AI Blog Writer Pro ===
Contributors: your-name-here
Tags: ai, content, editor, gutenberg, gemini, blog, writer, seo
Requires at least: 6.0
Tested up to: 6.5
Stable tag: 1.2.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Plugin URI: https://example.com/plugins/ai-blog-writer-pro/

A WordPress plugin that uses the Gemini API to provide AI-powered content generation, SEO analysis, and writing assistance directly within the block editor.

== Description ==

AI Blog Writer Pro integrates the power of Google's Gemini AI directly into the WordPress editor. This plugin provides a suite of tools to help you streamline your content creation process, from generating ideas and outlines to analyzing your writing for SEO best practices.

This is a "Bring Your Own Key" (BYOK) plugin. You must obtain your own Google Gemini API key for the plugin to function. This plugin works with **no build step required**.

**Features**

*   **AI Content Generation:** Create blog post titles, outlines, intros, or full articles.
*   **SEO Analysis:** Analyze your post content for SEO metrics and get suggestions for improvement.
*   **Keyword Research:** Discover related keywords for your topic.
*   **Post Summary:** Get a quick, AI-powered summary of your post's SEO score, structure, and tone.
*   **Secure:** Your API key is stored securely in your WordPress database. All API calls are routed through your server to protect your key.


== Installation ==

**There are NO build steps or commands to run!**

1.  Create a `.zip` file containing all the plugin files (including `ai-blog-writer-pro.php`, `index.tsx`, `readme.txt`, and the `src` folder).
2.  In your WordPress admin dashboard, navigate to `Plugins` > `Add New`.
3.  Click `Upload Plugin` and choose the `.zip` file you just created.
4.  Activate the plugin through the 'Plugins' menu in WordPress.
5.  Go to `Settings` > `AI Blog Writer Pro` in your admin menu (or click the "Settings" link under the plugin's name on the Plugins page).
6.  Enter your Google Gemini API key and save changes.
7.  Open a new or existing post in the editor. The AI Assistant will now be visible and fully functional.

== Frequently Asked Questions ==

*   **Is this plugin free?**
    The plugin is free, but it requires a Google Gemini API key, which is a paid service based on usage. You are responsible for all costs associated with your API key.

*   **Where do I get an API Key?**
    You can get a Google Gemini API key from the Google AI Studio website.

*   **Is my API key secure?**
    Yes. Your key is stored in your site's database and is never exposed publicly or in the browser's source code. All communication with the AI is handled through your server.

== Changelog ==

= 1.2.0 =
* MAJOR FIX: Re-architected the plugin to remove the need for any command-line build steps. The plugin now uses ES modules and an import map to load the React application directly in the browser.
* FIX: Created the main `ai-blog-writer-pro.php` file to act as the plugin engine.
* FIX: Populated the empty `index.tsx` file to correctly initialize the React app.
* Project: Removed the obsolete and confusing `build/` folder and `index.html`.

= 1.1.0 =
* Attempted a pre-compiled version of the plugin.

= 1.0.0 =
* Initial project structure with uncompiled source code.