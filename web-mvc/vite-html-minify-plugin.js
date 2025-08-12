// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';
//import { minify as terserMinify } from 'terser'; // Import Terser

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: {
        compress: true,
        mangle: true,
    },
    sortAttributes: true,
    sortClassName: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: false,
    decodeEntities: true,
    html5: true,
    keepClosingSlash: false,
    removeTagWhitespace: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    trimCustomFragments: true,
    processConditionalComments: true,
    removeEmptyAttributes: true,
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin', // Tên plugin
        // hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng cho các file mà bạn muốn minify HTML
            // Điều chỉnh đường dẫn regex cho phù hợp với cấu trúc project của bạn
            if (id.includes('web-mvc/backend/views') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;
                const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const fullMatch = match[0];
                    const htmlContent = match[1]; // Nội dung bên trong backticks

                    try {
                        // Thêm .trim() vào đây để loại bỏ khoảng trắng ở hai đầu
                        const trimmedHtmlContent = htmlContent.trim();
                        const minifiedHtml = await htmlMinifier(trimmedHtmlContent, defaultMinifyOptions);
                        
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `/* html */\`${minifiedHtml}\``);
                    } catch (e) {
                        this.warn(`Failed to minify HTML in ${id}: ${e.message}`);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null
                };
            }
            return null;
        }
    };
}