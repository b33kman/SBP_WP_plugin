<?php
/**
 * Plugin Name:       AI Blog Writer Pro
 * Description:       Integrates Google's Gemini AI into the WordPress editor for content generation, SEO analysis, and more.
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Version:           1.2.0
 * Author:            Your Name Here
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ai-blog-writer-pro
 * Plugin URI:        https://example.com/
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// === A. ADD A "SETTINGS" LINK TO THE PLUGINS PAGE FOR EASY ACCESS ===
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'aibwp_add_settings_link' );
function aibwp_add_settings_link( $links ) {
    $settings_link = '<a href="' . admin_url( 'options-general.php?page=ai_blog_writer_pro' ) . '">' . __( 'Settings' ) . '</a>';
    array_unshift( $links, $settings_link );
    return $links;
}

// === B. CREATE THE SETTINGS PAGE FOR THE API KEY ===
// 1. Add the page under the main "Settings" menu in the WordPress admin
add_action('admin_menu', 'aibwp_add_admin_menu');
function aibwp_add_admin_menu() {
    add_options_page(
        'AI Blog Writer Pro Settings', // Page Title
        'AI Blog Writer Pro',          // Menu Title
        'manage_options',              // Capability required
        'ai_blog_writer_pro',          // Menu Slug
        'aibwp_options_page_html'      // Function to render the page
    );
}

// 2. Register the setting so WordPress can save it securely
add_action('admin_init', 'aibwp_settings_init');
function aibwp_settings_init() {
    register_setting('aibwp_settings', 'aibwp_api_key', ['sanitize_callback' => 'sanitize_text_field']);
    add_settings_section('aibwp_api_key_section', 'API Key Settings', 'aibwp_api_key_section_callback', 'aibwp_settings');
    add_settings_field('aibwp_api_key_field', 'Google Gemini API Key', 'aibwp_api_key_field_render', 'aibwp_settings', 'aibwp_api_key_section');
}

function aibwp_api_key_section_callback() {
    echo '<p>Enter your Google Gemini API key below. Your key is stored securely in your WordPress database. You can get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</p>';
}

function aibwp_api_key_field_render() {
    $api_key = get_option('aibwp_api_key');
    echo '<input type="password" name="aibwp_api_key" value="' . esc_attr($api_key) . '" class="regular-text" placeholder="Enter your API key">';
}

// 3. Render the full HTML for the settings page
function aibwp_options_page_html() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('aibwp_settings');
            do_settings_sections('aibwp_settings');
            submit_button('Save Settings');
            ?>
        </form>
    </div>
    <?php
}

// === C. LOAD THE REACT APP IN THE EDITOR (This is the fix for "wp is not defined") ===
add_action('enqueue_block_editor_assets', 'aibwp_enqueue_editor_scripts');
function aibwp_enqueue_editor_scripts() {
    $plugin_url = plugin_dir_url( __FILE__ );
    $script_handle = 'ai-blog-writer-pro-script';

    // 1. Enqueue the main script, declaring its dependencies. This tells WordPress to load its libraries FIRST.
    wp_enqueue_script(
        $script_handle,
        $plugin_url . 'index.tsx', // The path to your main JS file
        ['wp-element', 'wp-blocks', 'wp-data', 'wp-components', 'wp-i18n'], // This makes the 'wp' object available
        filemtime(plugin_dir_path(__FILE__) . 'index.tsx'), // Versioning
        true // Load in footer
    );

    // 2. Add the importmap to the head. This is the modern way to handle external libraries without a build step.
    $import_map = [
        'imports' => [
            "react" => "https://esm.sh/react@18.2.0",
            "react-dom/client" => "https://esm.sh/react-dom@18.2.0/client",
            "marked" => "https://esm.sh/marked@13.0.0"
        ]
    ];
    wp_add_inline_script(
        'wp-element', // Hook into a core script that is guaranteed to be there.
        sprintf(
            '<script type="importmap">%s</script>',
            wp_json_encode($import_map)
        ),
        'before'
    );

    // 3. Make the script a module so it can use 'import'.
    add_filter('script_loader_tag', function($tag, $handle, $src) use ($script_handle) {
        if ($handle === $script_handle) {
            return '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '-js"></script>';
        }
        return $tag;
    }, 10, 3);
    
    // 4. Pass data from PHP to our JavaScript app.
    $api_key = get_option('aibwp_api_key');
    wp_add_inline_script(
        $script_handle,
        sprintf('const aibwp_data = %s;', wp_json_encode([
            'api_url'        => rest_url('aibwp/v1'),
            'nonce'          => wp_create_nonce('wp_rest'),
            'is_api_key_set' => !empty($api_key)
        ])),
        'before'
    );
}


// === D. CREATE THE SECURE BACKEND API PROXY ===
add_action('rest_api_init', 'aibwp_register_rest_routes');
function aibwp_register_rest_routes() {
    register_rest_route('aibwp/v1', '/generate', [
        'methods'             => 'POST',
        'callback'            => 'aibwp_handle_generate_request',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ]);
}

// The main function that handles requests from our React app
function aibwp_handle_generate_request(WP_REST_Request $request) {
    $api_key = get_option('aibwp_api_key');
    if (empty($api_key)) {
        return new WP_Error('no_api_key', 'The Google Gemini API key has not been configured.', ['status' => 400]);
    }

    $body = $request->get_json_params();
    $prompt = isset($body['prompt']) ? sanitize_textarea_field($body['prompt']) : '';
    $config = isset($body['config']) ? $body['config'] : [];
    
    if (empty($prompt)) {
        return new WP_Error('no_prompt', 'A prompt is required to generate content.', ['status' => 400]);
    }

    $model = 'gemini-2.5-flash-preview-04-17';
    $gemini_api_url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent?key=' . $api_key;
    
    $gemini_request_body = ['contents' => [['parts' => [['text' => $prompt]]]]];
    if (!empty($config)) {
        $gemini_request_body['generationConfig'] = $config;
    }
    
    $response = wp_remote_post($gemini_api_url, [
        'method'  => 'POST',
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode($gemini_request_body),
        'timeout' => 90,
    ]);

    if (is_wp_error($response)) {
        return new WP_Error('api_request_failed', $response->get_error_message(), ['status' => 500]);
    }

    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);
    $response_data = json_decode($response_body, true);

    if ($response_code !== 200) {
        $error_message = $response_data['error']['message'] ?? 'An unknown error occurred with the Gemini API.';
        return new WP_Error('gemini_api_error', $error_message, ['status' => $response_code]);
    }

    $generated_text = $response_data['candidates'][0]['content']['parts'][0]['text'] ?? '';
    
    return new WP_REST_Response(['text' => $generated_text], 200);
}