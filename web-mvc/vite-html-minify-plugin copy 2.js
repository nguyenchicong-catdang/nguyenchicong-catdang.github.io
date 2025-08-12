// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

// Tùy chọn minify HTML mặc định
const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true, // Use default Terser options for JS in HTML
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
    removeEmptyAttributes: true, // Thường được bật
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        // 'configResolved' hook để kiểm tra nếu đây là lệnh build
        configResolved(config) {
            this.isProduction = config.command === 'build';
        },
        // hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ chạy plugin này trong môi trường production build
            if (!this.isProduction) {
                return null;
            }

            // Chỉ áp dụng cho các file mà bạn muốn minify HTML
            // Điều chỉnh đường dẫn regex cho phù hợp với cấu trúc project của bạn
            // Ví dụ: chỉ các file trong thư mục `backend/views` hoặc những file bạn biết chứa HTML string
            if (id.includes('server') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex để tìm các template literals được đánh dấu là /* html */`...`
                const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const fullMatch = match[0]; // Toàn bộ phần /* html */`...`
                    const htmlContent = match[1]; // Nội dung bên trong backticks

                    try {
                        // Minify nội dung HTML với các tùy chọn
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                        // Thay thế chuỗi HTML gốc bằng chuỗi đã minify, giữ nguyên /* html */``
                        // Đảm bảo escape các ký tự đặc biệt trong chuỗi để RegEx không bị lỗi
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `/* html */\`${minifiedHtml}\``);
                    } catch (e) {
                        this.warn(`Failed to minify HTML in ${id}: ${e.message}`);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null // Để đơn giản, không tạo sourcemap cho phần này
                };
            }
            return null; // Trả về null nếu không muốn xử lý file này
        }
    };
}