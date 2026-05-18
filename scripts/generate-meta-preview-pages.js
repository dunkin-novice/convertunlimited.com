const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';
const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'Meta Preview Checker - SERP & Social Preview Tool | ConvertUnlimited',
    description: 'Preview page titles, meta descriptions, Google-style search snippets, Open Graph cards, and X/Twitter cards manually in your browser.',
    hero: 'Meta Preview Checker', sub: 'Preview search and social snippets before you publish.',
    eyebrow: 'Manual SERP and social preview', panelTitle: 'Build a preview from your metadata.',
    panelText: 'Enter a title, description, URL, image URL, and site name. This tool does not scrape websites; it renders a local approximation for review.',
    fields: ['Page title', 'Meta description', 'URL', 'Image URL', 'Site name'],
    placeholders: ['A practical page title', 'A concise page summary that helps people understand the page.', 'https://example.com/page', 'https://example.com/image.jpg', 'Example Site'],
    sample: 'Fill sample', clear: 'Clear', copy: 'Copy preview text',
    google: 'Google-style preview', social: 'Open Graph-style card', twitter: 'X/Twitter-style card',
    titleCount: 'Title characters', descCount: 'Description characters',
    guidanceTitle: 'Length guidance', guidance: 'Title: around 50-60 characters is usually safer. Description: around 120-160 characters is usually safer. Google and social platforms may rewrite or cache previews.',
    trustTitle: 'Local and manual', trustOne: '<b>No scraping.</b> The page does not fetch external URLs.', trustTwo: '<b>No storage.</b> Inputs stay in your browser session.',
    articleTitle: 'Why preview metadata?', articleP1: 'A title and meta description shape how a page may appear in search results and shared links. Previewing them helps catch truncation, vague copy, and missing context before publishing.',
    articleP2: 'This tool shows approximations, not guarantees. Search engines may rewrite snippets, and social platforms may cache Open Graph data for a period of time.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['Does this tool fetch my website?', 'No. It is a manual preview checker, so it does not scrape or request external URLs.'],
      ['Is the Google preview exact?', 'No. It is an approximate visual preview. Google may rewrite titles or descriptions.'],
      ['What title length is best?', 'Around 50-60 characters is usually safer, but clarity matters more than hitting an exact number.'],
      ['What description length is best?', 'Around 120-160 characters is often practical. Keep it useful and specific.'],
      ['Can I preview social cards?', 'Yes. Add an image URL and site name to preview Open Graph and X/Twitter-style cards.'],
    ],
    privacyTitle: 'Privacy Policy', privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this metadata preview flow. Entered metadata is rendered locally in your browser.',
    termsTitle: 'Terms of Use', terms: 'ConvertUnlimited is provided as is. Preview layouts are approximate and should be checked against each publishing platform when accuracy matters.',
  },
  th: {
    title: 'ตัวตรวจพรีวิวเมตา - ดูตัวอย่าง SERP และโซเชียล | ConvertUnlimited',
    description: 'ดูตัวอย่าง title, meta description, Google snippet, Open Graph และการ์ด X/Twitter แบบกรอกเองในเบราว์เซอร์',
    hero: 'ตัวตรวจพรีวิวเมตา', sub: 'ดูตัวอย่างผลค้นหาและการ์ดโซเชียลก่อนเผยแพร่',
    eyebrow: 'พรีวิว SERP และโซเชียลแบบกรอกเอง', panelTitle: 'สร้างพรีวิวจากเมตาดาต้าของคุณ',
    panelText: 'กรอกชื่อหน้า คำอธิบาย URL รูปภาพ และชื่อเว็บไซต์ เครื่องมือนี้ไม่ดึงข้อมูลเว็บไซต์ แต่แสดงตัวอย่างในเครื่อง',
    fields: ['ชื่อหน้า', 'Meta description', 'URL', 'URL รูปภาพ', 'ชื่อเว็บไซต์'],
    placeholders: ['ชื่อหน้าที่ชัดเจน', 'สรุปหน้าสั้นๆ ที่ช่วยให้คนเข้าใจเนื้อหา', 'https://example.com/page', 'https://example.com/image.jpg', 'เว็บไซต์ตัวอย่าง'],
    sample: 'ใส่ตัวอย่าง', clear: 'ล้าง', copy: 'คัดลอกข้อความพรีวิว',
    google: 'พรีวิวแบบ Google', social: 'การ์ดแบบ Open Graph', twitter: 'การ์ดแบบ X/Twitter',
    titleCount: 'จำนวนตัวอักษรชื่อ', descCount: 'จำนวนตัวอักษรคำอธิบาย',
    guidanceTitle: 'คำแนะนำความยาว', guidance: 'ชื่อประมาณ 50-60 ตัวอักษรมักปลอดภัยกว่า คำอธิบายประมาณ 120-160 ตัวอักษรมักเหมาะสม Google และแพลตฟอร์มโซเชียลอาจเขียนใหม่หรือแคชพรีวิว',
    trustTitle: 'ทำงานในเครื่องและแบบกรอกเอง', trustOne: '<b>ไม่ดึงข้อมูลเว็บ</b> หน้าเว็บนี้ไม่ fetch URL ภายนอก', trustTwo: '<b>ไม่จัดเก็บ</b> ข้อมูลอยู่ในเบราว์เซอร์ของคุณ',
    articleTitle: 'ทำไมต้องพรีวิวเมตาดาต้า?', articleP1: 'Title และ meta description มีผลต่อการแสดงหน้าในผลค้นหาและลิงก์แชร์ การพรีวิวช่วยจับข้อความที่ยาวเกินไป คลุมเครือ หรือขาดบริบท',
    articleP2: 'เครื่องมือนี้เป็นเพียงการประมาณ ไม่ใช่ผลจริงเสมอไป Search engine อาจเขียน snippet ใหม่ และโซเชียลอาจแคชข้อมูล Open Graph',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [['เครื่องมือนี้ดึงเว็บไซต์ของฉันไหม?', 'ไม่ เป็นเครื่องมือพรีวิวแบบกรอกเอง จึงไม่ scrape หรือเรียก URL ภายนอก'], ['พรีวิว Google ตรงเป๊ะไหม?', 'ไม่ เป็นตัวอย่างโดยประมาณ Google อาจเขียนชื่อหรือคำอธิบายใหม่'], ['ชื่อควรยาวเท่าไร?', 'ประมาณ 50-60 ตัวอักษรมักปลอดภัย แต่ความชัดเจนสำคัญกว่าตัวเลขเป๊ะ'], ['คำอธิบายควรยาวเท่าไร?', 'ประมาณ 120-160 ตัวอักษรมักใช้งานได้ดี ควรเฉพาะเจาะจงและมีประโยชน์'], ['พรีวิวการ์ดโซเชียลได้ไหม?', 'ได้ เพิ่ม URL รูปภาพและชื่อเว็บไซต์เพื่อดูการ์ด Open Graph และ X/Twitter']],
    privacyTitle: 'นโยบายความเป็นส่วนตัว', privacy: 'เราไม่เก็บ ไม่จัดเก็บ ไม่อัปโหลด และไม่ scrape เมตาดาต้าที่คุณกรอก การพรีวิวเกิดในเบราว์เซอร์',
    termsTitle: 'ข้อกำหนดการใช้งาน', terms: 'ConvertUnlimited ให้บริการตามสภาพจริง รูปแบบพรีวิวเป็นการประมาณ และควรตรวจบนแพลตฟอร์มจริงเมื่อความแม่นยำสำคัญ',
  },
  vi: {
    title: 'Trình xem trước meta - SERP & Social Preview | ConvertUnlimited',
    description: 'Xem trước title, meta description, snippet Google, Open Graph và thẻ X/Twitter thủ công ngay trong trình duyệt.',
    hero: 'Trình xem trước meta', sub: 'Xem trước kết quả tìm kiếm và chia sẻ trước khi xuất bản.',
    eyebrow: 'Xem trước SERP và social thủ công', panelTitle: 'Tạo bản xem trước từ metadata.',
    panelText: 'Nhập tiêu đề, mô tả, URL, URL hình ảnh và tên site. Công cụ không quét website; chỉ hiển thị mô phỏng cục bộ.',
    fields: ['Tiêu đề trang', 'Meta description', 'URL', 'URL hình ảnh', 'Tên site'],
    placeholders: ['Một tiêu đề rõ ràng', 'Tóm tắt ngắn giúp người đọc hiểu trang.', 'https://example.com/page', 'https://example.com/image.jpg', 'Trang mẫu'],
    sample: 'Điền mẫu', clear: 'Xóa', copy: 'Sao chép preview',
    google: 'Xem trước kiểu Google', social: 'Thẻ kiểu Open Graph', twitter: 'Thẻ kiểu X/Twitter',
    titleCount: 'Ký tự tiêu đề', descCount: 'Ký tự mô tả',
    guidanceTitle: 'Gợi ý độ dài', guidance: 'Tiêu đề khoảng 50-60 ký tự thường an toàn hơn. Mô tả khoảng 120-160 ký tự thường thực tế. Google và mạng xã hội có thể viết lại hoặc cache preview.',
    trustTitle: 'Cục bộ và thủ công', trustOne: '<b>Không quét web.</b> Trang không gọi URL bên ngoài.', trustTwo: '<b>Không lưu trữ.</b> Dữ liệu ở trong phiên trình duyệt của bạn.',
    articleTitle: 'Vì sao nên xem trước metadata?', articleP1: 'Title và meta description ảnh hưởng cách trang có thể xuất hiện trong tìm kiếm và liên kết chia sẻ. Xem trước giúp phát hiện nội dung bị cắt hoặc thiếu ngữ cảnh.',
    articleP2: 'Đây là mô phỏng, không phải đảm bảo. Công cụ tìm kiếm có thể viết lại snippet và nền tảng social có thể cache Open Graph.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [['Công cụ có lấy dữ liệu website không?', 'Không. Đây là công cụ nhập thủ công, không scrape hoặc gọi URL bên ngoài.'], ['Preview Google có chính xác tuyệt đối không?', 'Không. Đây là mô phỏng trực quan. Google có thể viết lại title hoặc description.'], ['Title dài bao nhiêu là tốt?', 'Khoảng 50-60 ký tự thường an toàn, nhưng sự rõ ràng quan trọng hơn số chính xác.'], ['Description dài bao nhiêu là tốt?', 'Khoảng 120-160 ký tự thường thực tế. Hãy viết cụ thể và hữu ích.'], ['Có xem trước social card không?', 'Có. Thêm URL hình ảnh và tên site để xem Open Graph và X/Twitter.']],
    privacyTitle: 'Chính sách quyền riêng tư', privacy: 'Chúng tôi không thu thập, lưu trữ, tải lên hoặc quét metadata bạn nhập. Preview chạy cục bộ trong trình duyệt.',
    termsTitle: 'Điều khoản sử dụng', terms: 'ConvertUnlimited được cung cấp nguyên trạng. Giao diện preview là mô phỏng và nên kiểm tra trên nền tảng thật khi cần chính xác.',
  },
  zh: {
    title: 'Meta 预览检查器 - SERP 与社交预览工具 | ConvertUnlimited',
    description: '在浏览器中手动预览页面标题、meta 描述、Google 样式摘要、Open Graph 卡片和 X/Twitter 卡片。',
    hero: 'Meta 预览检查器', sub: '发布前预览搜索和社交分享片段。',
    eyebrow: '手动 SERP 与社交预览', panelTitle: '用你的元数据生成预览。',
    panelText: '输入标题、描述、URL、图片 URL 和站点名称。本工具不抓取网站，只在本地渲染近似预览。',
    fields: ['页面标题', 'Meta 描述', 'URL', '图片 URL', '站点名称'],
    placeholders: ['清晰实用的页面标题', '帮助用户理解页面内容的简短摘要。', 'https://example.com/page', 'https://example.com/image.jpg', '示例网站'],
    sample: '填入示例', clear: '清空', copy: '复制预览文本',
    google: 'Google 样式预览', social: 'Open Graph 样式卡片', twitter: 'X/Twitter 样式卡片',
    titleCount: '标题字符数', descCount: '描述字符数',
    guidanceTitle: '长度建议', guidance: '标题通常 50-60 个字符较稳妥。描述通常 120-160 个字符较实用。Google 和社交平台可能重写或缓存预览。',
    trustTitle: '本地且手动', trustOne: '<b>不抓取。</b> 页面不会请求外部 URL。', trustTwo: '<b>不存储。</b> 输入只留在浏览器会话中。',
    articleTitle: '为什么要预览元数据？', articleP1: '标题和 meta 描述会影响页面在搜索结果和分享链接中的呈现。预览能帮助发现截断、表达模糊或缺少上下文的问题。',
    articleP2: '本工具显示的是近似效果，不是保证。搜索引擎可能重写摘要，社交平台也可能缓存 Open Graph 数据。',
    faqTitle: '常见问题',
    faq: [['这个工具会抓取我的网站吗？', '不会。它是手动预览工具，不会抓取或请求外部 URL。'], ['Google 预览完全准确吗？', '不完全。它是近似视觉预览，Google 可能重写标题或描述。'], ['标题多长比较好？', '通常 50-60 个字符较稳妥，但清晰度比精确数字更重要。'], ['描述多长比较好？', '通常 120-160 个字符比较实用。请保持具体且有帮助。'], ['可以预览社交卡片吗？', '可以。添加图片 URL 和站点名称即可预览 Open Graph 和 X/Twitter 样式卡片。']],
    privacyTitle: '隐私政策', privacy: '我们不会收集、存储、上传或抓取你输入的元数据。预览在浏览器本地完成。',
    termsTitle: '使用条款', terms: 'ConvertUnlimited 按原样提供。预览布局为近似效果，如需精确请在实际发布平台检查。',
  },
  ja: {
    title: 'メタプレビュー確認 - SERP・SNS プレビューツール | ConvertUnlimited',
    description: 'ページタイトル、メタディスクリプション、Google 風スニペット、Open Graph、X/Twitter カードをブラウザ内で手動プレビュー。',
    hero: 'メタプレビュー確認', sub: '公開前に検索結果とソーシャル共有をプレビュー。',
    eyebrow: '手動 SERP・SNS プレビュー', panelTitle: 'メタデータからプレビューを作成。',
    panelText: 'タイトル、説明、URL、画像 URL、サイト名を入力します。このツールはサイトを取得せず、ローカルで近似表示します。',
    fields: ['ページタイトル', 'メタディスクリプション', 'URL', '画像 URL', 'サイト名'],
    placeholders: ['実用的なページタイトル', 'ページ内容が伝わる短い要約。', 'https://example.com/page', 'https://example.com/image.jpg', 'サンプルサイト'],
    sample: 'サンプル入力', clear: 'クリア', copy: 'プレビューテキストをコピー',
    google: 'Google 風プレビュー', social: 'Open Graph 風カード', twitter: 'X/Twitter 風カード',
    titleCount: 'タイトル文字数', descCount: '説明文字数',
    guidanceTitle: '長さの目安', guidance: 'タイトルは 50〜60 文字程度が扱いやすいことが多いです。説明文は 120〜160 文字程度が実用的です。Google や SNS は表示を書き換えたりキャッシュしたりする場合があります。',
    trustTitle: 'ローカルで手動', trustOne: '<b>スクレイピングなし。</b> 外部 URL は取得しません。', trustTwo: '<b>保存なし。</b> 入力はブラウザセッション内に留まります。',
    articleTitle: 'メタデータをプレビューする理由', articleP1: 'タイトルとメタディスクリプションは、検索結果や共有リンクでの見え方に影響します。公開前のプレビューで、省略や曖昧な表現を確認できます。',
    articleP2: 'これは近似表示であり保証ではありません。検索エンジンはスニペットを書き換えることがあり、SNS は Open Graph データをキャッシュすることがあります。',
    faqTitle: 'よくある質問',
    faq: [['このツールはサイトを取得しますか？', 'いいえ。手動プレビューなので、外部 URL をスクレイピングまたはリクエストしません。'], ['Google プレビューは正確ですか？', 'いいえ。近似の視覚プレビューです。Google はタイトルや説明を書き換える場合があります。'], ['タイトルの長さは？', '50〜60 文字程度が扱いやすいことが多いですが、正確な文字数より分かりやすさが重要です。'], ['説明文の長さは？', '120〜160 文字程度が実用的です。具体的で役立つ内容にしてください。'], ['SNS カードもプレビューできますか？', 'はい。画像 URL とサイト名を追加すると Open Graph と X/Twitter 風カードを確認できます。']],
    privacyTitle: 'プライバシーポリシー', privacy: '入力したメタデータを収集、保存、アップロード、スクレイピングしません。プレビューはブラウザ内で実行されます。',
    termsTitle: '利用規約', terms: 'ConvertUnlimited は現状のまま提供されます。プレビューは近似表示のため、正確性が必要な場合は各プラットフォームで確認してください。',
  },
  ko: {
    title: '메타 미리보기 검사기 - SERP 및 소셜 미리보기 | ConvertUnlimited',
    description: '브라우저에서 페이지 제목, 메타 설명, Google 스타일 스니펫, Open Graph 카드, X/Twitter 카드를 수동으로 미리 봅니다.',
    hero: '메타 미리보기 검사기', sub: '게시 전에 검색 및 소셜 스니펫을 미리 봅니다.',
    eyebrow: '수동 SERP 및 소셜 미리보기', panelTitle: '메타데이터로 미리보기를 만드세요.',
    panelText: '제목, 설명, URL, 이미지 URL, 사이트 이름을 입력하세요. 이 도구는 웹사이트를 스크랩하지 않고 로컬 근사 미리보기만 렌더링합니다.',
    fields: ['페이지 제목', '메타 설명', 'URL', '이미지 URL', '사이트 이름'],
    placeholders: ['실용적인 페이지 제목', '페이지를 이해하는 데 도움이 되는 간결한 요약.', 'https://example.com/page', 'https://example.com/image.jpg', '예시 사이트'],
    sample: '샘플 입력', clear: '지우기', copy: '미리보기 텍스트 복사',
    google: 'Google 스타일 미리보기', social: 'Open Graph 스타일 카드', twitter: 'X/Twitter 스타일 카드',
    titleCount: '제목 글자 수', descCount: '설명 글자 수',
    guidanceTitle: '길이 가이드', guidance: '제목은 보통 50-60자가 안전합니다. 설명은 120-160자가 실용적입니다. Google과 소셜 플랫폼은 미리보기를 다시 쓰거나 캐시할 수 있습니다.',
    trustTitle: '로컬 및 수동', trustOne: '<b>스크래핑 없음.</b> 외부 URL을 가져오지 않습니다.', trustTwo: '<b>저장 없음.</b> 입력은 브라우저 세션에만 남습니다.',
    articleTitle: '왜 메타데이터를 미리 볼까요?', articleP1: '제목과 메타 설명은 검색 결과와 공유 링크에서 보이는 방식에 영향을 줍니다. 미리보기는 잘림, 모호한 문구, 부족한 맥락을 확인하는 데 도움이 됩니다.',
    articleP2: '이 도구는 근사치를 보여줄 뿐 보장하지 않습니다. 검색 엔진은 스니펫을 다시 쓸 수 있고 소셜 플랫폼은 Open Graph 데이터를 캐시할 수 있습니다.',
    faqTitle: '자주 묻는 질문',
    faq: [['이 도구가 내 웹사이트를 가져오나요?', '아니요. 수동 미리보기 도구이므로 외부 URL을 스크랩하거나 요청하지 않습니다.'], ['Google 미리보기가 정확한가요?', '아니요. 근사 시각 미리보기입니다. Google은 제목이나 설명을 다시 쓸 수 있습니다.'], ['제목 길이는 어느 정도가 좋나요?', '보통 50-60자가 안전하지만 정확한 숫자보다 명확성이 더 중요합니다.'], ['설명 길이는 어느 정도가 좋나요?', '보통 120-160자가 실용적입니다. 구체적이고 유용하게 작성하세요.'], ['소셜 카드도 미리 볼 수 있나요?', '네. 이미지 URL과 사이트 이름을 추가하면 Open Graph 및 X/Twitter 스타일 카드를 볼 수 있습니다.']],
    privacyTitle: '개인정보 처리방침', privacy: '입력한 메타데이터를 수집, 저장, 업로드 또는 스크랩하지 않습니다. 미리보기는 브라우저에서 로컬로 렌더링됩니다.',
    termsTitle: '이용 약관', terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 미리보기 레이아웃은 근사치이며 정확성이 중요하면 각 플랫폼에서 확인하세요.',
  },
  es: {
    title: 'Comprobador de meta preview - SERP y social | ConvertUnlimited',
    description: 'Previsualiza títulos, meta descripciones, snippets estilo Google, tarjetas Open Graph y X/Twitter manualmente en tu navegador.',
    hero: 'Comprobador de meta preview', sub: 'Previsualiza snippets de búsqueda y redes antes de publicar.',
    eyebrow: 'Vista previa manual de SERP y social', panelTitle: 'Crea una vista previa desde tus metadatos.',
    panelText: 'Introduce título, descripción, URL, imagen y sitio. Esta herramienta no rastrea webs; renderiza una aproximación local.',
    fields: ['Título de página', 'Meta descripción', 'URL', 'URL de imagen', 'Nombre del sitio'],
    placeholders: ['Un título de página práctico', 'Un resumen conciso que ayude a entender la página.', 'https://example.com/page', 'https://example.com/image.jpg', 'Sitio de ejemplo'],
    sample: 'Rellenar ejemplo', clear: 'Limpiar', copy: 'Copiar texto',
    google: 'Vista estilo Google', social: 'Tarjeta estilo Open Graph', twitter: 'Tarjeta estilo X/Twitter',
    titleCount: 'Caracteres del título', descCount: 'Caracteres de descripción',
    guidanceTitle: 'Guía de longitud', guidance: 'Título: unas 50-60 letras suele ser más seguro. Descripción: unas 120-160 suele ser práctico. Google y redes pueden reescribir o cachear vistas.',
    trustTitle: 'Local y manual', trustOne: '<b>Sin scraping.</b> La página no solicita URLs externas.', trustTwo: '<b>Sin almacenamiento.</b> Los datos quedan en tu sesión del navegador.',
    articleTitle: '¿Por qué previsualizar metadatos?', articleP1: 'El título y la meta descripción influyen en cómo una página puede aparecer en resultados y enlaces compartidos. Previsualizar ayuda a detectar cortes y textos vagos.',
    articleP2: 'La herramienta muestra aproximaciones, no garantías. Los buscadores pueden reescribir snippets y las redes pueden cachear Open Graph.',
    faqTitle: 'Preguntas frecuentes',
    faq: [['¿Esta herramienta consulta mi web?', 'No. Es una herramienta manual y no rastrea ni solicita URLs externas.'], ['¿La vista de Google es exacta?', 'No. Es una aproximación visual. Google puede reescribir títulos o descripciones.'], ['¿Qué longitud de título es mejor?', 'Unas 50-60 letras suele ser más seguro, pero la claridad importa más que un número exacto.'], ['¿Qué longitud de descripción es mejor?', 'Unas 120-160 letras suele funcionar bien. Hazla útil y específica.'], ['¿Puedo previsualizar tarjetas sociales?', 'Sí. Añade imagen y nombre del sitio para ver tarjetas Open Graph y X/Twitter.']],
    privacyTitle: 'Política de privacidad', privacy: 'No recopilamos, almacenamos, subimos ni rastreamos los metadatos que introduces. La vista se renderiza localmente.',
    termsTitle: 'Términos de uso', terms: 'ConvertUnlimited se proporciona tal cual. Las vistas son aproximadas y deben comprobarse en cada plataforma cuando importe la exactitud.',
  },
  fr: {
    title: 'Vérificateur de méta aperçu - SERP et social | ConvertUnlimited',
    description: 'Prévisualisez titres, méta descriptions, extraits Google, cartes Open Graph et X/Twitter manuellement dans votre navigateur.',
    hero: 'Vérificateur de méta aperçu', sub: 'Prévisualisez les extraits de recherche et sociaux avant publication.',
    eyebrow: 'Aperçu manuel SERP et social', panelTitle: 'Créer un aperçu depuis vos métadonnées.',
    panelText: 'Saisissez titre, description, URL, image et nom du site. Cet outil ne scrape pas les sites; il affiche une approximation locale.',
    fields: ['Titre de page', 'Méta description', 'URL', 'URL d’image', 'Nom du site'],
    placeholders: ['Un titre de page pratique', 'Un résumé concis qui aide à comprendre la page.', 'https://example.com/page', 'https://example.com/image.jpg', 'Site d’exemple'],
    sample: 'Remplir un exemple', clear: 'Effacer', copy: 'Copier le texte',
    google: 'Aperçu style Google', social: 'Carte style Open Graph', twitter: 'Carte style X/Twitter',
    titleCount: 'Caractères du titre', descCount: 'Caractères de description',
    guidanceTitle: 'Conseils de longueur', guidance: 'Titre: environ 50-60 caractères est souvent plus sûr. Description: environ 120-160 caractères est souvent pratique. Google et les plateformes sociales peuvent réécrire ou mettre en cache les aperçus.',
    trustTitle: 'Local et manuel', trustOne: '<b>Pas de scraping.</b> La page ne récupère pas d’URL externe.', trustTwo: '<b>Pas de stockage.</b> Les saisies restent dans votre session navigateur.',
    articleTitle: 'Pourquoi prévisualiser les métadonnées ?', articleP1: 'Le titre et la méta description influencent l’apparence possible d’une page dans les résultats et liens partagés. L’aperçu aide à repérer les textes tronqués ou vagues.',
    articleP2: 'Cet outil affiche des approximations, pas des garanties. Les moteurs peuvent réécrire les extraits et les réseaux peuvent cacher Open Graph.',
    faqTitle: 'Foire aux questions',
    faq: [['L’outil récupère-t-il mon site ?', 'Non. C’est un aperçu manuel; il ne scrape pas et ne demande pas d’URL externe.'], ['L’aperçu Google est-il exact ?', 'Non. C’est une approximation visuelle. Google peut réécrire titres ou descriptions.'], ['Quelle longueur de titre choisir ?', 'Environ 50-60 caractères est souvent plus sûr, mais la clarté compte plus qu’un nombre exact.'], ['Quelle longueur de description choisir ?', 'Environ 120-160 caractères est souvent pratique. Restez utile et précis.'], ['Puis-je prévisualiser des cartes sociales ?', 'Oui. Ajoutez une URL d’image et un nom de site pour voir Open Graph et X/Twitter.']],
    privacyTitle: 'Politique de confidentialité', privacy: 'Nous ne collectons, stockons, envoyons ni ne scrappons les métadonnées saisies. L’aperçu est rendu localement dans le navigateur.',
    termsTitle: 'Conditions d’utilisation', terms: 'ConvertUnlimited est fourni tel quel. Les aperçus sont approximatifs et doivent être vérifiés sur chaque plateforme si la précision compte.',
  },
};

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const route = (l) => `${l.prefix ? `/${l.prefix}` : ''}/meta-preview-checker/`;
const home = (l) => l.prefix ? `/${l.prefix}/` : '/';
const abs = (l) => `${BASE_URL}${route(l)}`;
const link = (l, slug) => `${l.prefix ? `/${l.prefix}` : ''}${slug ? `/${slug}/` : '/'}`;
const alternates = () => `${LOCALES.map((l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${abs(l)}">`).join('\n')}\n    <link rel="alternate" hreflang="x-default" href="${abs(LOCALES[0])}">`;

function page(locale) {
  const t = TEXT[locale.code];
  const fields = t.fields;
  const placeholders = t.placeholders;
  return `<!DOCTYPE html>
<html lang="${locale.hreflang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(t.title)}</title>
    <meta name="description" content="${esc(t.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
    <meta name="google-adsense-account" content="${ADSENSE}">
    <link rel="canonical" href="${abs(locale)}">

${alternates()}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    ${schemaScripts(t, locale, { url: abs(locale) })}
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home"><span class="mark" aria-hidden="true"></span><span class="word"><b>Convert</b><span>Unlimited</span></span></a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                <details class="tools-dropdown"><summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="dropdown-menu" role="menu"><div class="dropdown-section">SEO Tools</div><a href="${link(locale, 'qr-generator')}">QR Generator</a><a href="${link(locale, 'meta-preview-checker')}" aria-current="page">Meta Preview Checker</a><div class="dropdown-section">Image Tools</div><a href="${link(locale, 'avif-converter')}">AVIF Converter</a><a href="${link(locale, 'image-compressor')}">Image Compressor</a></div></details>
                <details class="lang-switcher"><summary aria-label="Language"><span aria-hidden="true">🌐</span> ${locale.label}</summary><div class="lang-menu" role="menu">
${LOCALES.map((l) => `                        <a href="${route(l)}" hreflang="${l.hreflang}" lang="${l.hreflang}"${l.code === locale.code ? ' aria-current="page"' : ''}>${l.name}</a>`).join('\n')}
                    </div></details>
            </nav>
        </header>
        <main>
            <section class="hero"><h1 class="hero-title">${esc(t.hero)}</h1><p class="sub hero-sub">${esc(t.sub)}</p></section>
            <div class="grid" id="layout">
                <section class="bg-tool" aria-label="${esc(t.hero)}">
                    <div class="bg-tool-head"><div><p class="section-eyebrow">${esc(t.eyebrow)}</p><h2>${esc(t.panelTitle)}</h2><p>${esc(t.panelText)}</p></div></div>
                    <div class="bg-workbench">
                        <div class="bg-panel">
                            <div class="bg-controls">
                                <label class="range-field" for="meta-title"><span>${esc(fields[0])}</span><input id="meta-title" type="text" maxlength="180" placeholder="${esc(placeholders[0])}"></label>
                                <label class="range-field" for="meta-description"><span>${esc(fields[1])}</span><textarea id="meta-description" rows="4" maxlength="320" placeholder="${esc(placeholders[1])}" style="width:100%;resize:vertical;"></textarea></label>
                                <label class="range-field" for="meta-url"><span>${esc(fields[2])}</span><input id="meta-url" type="url" placeholder="${esc(placeholders[2])}"></label>
                                <label class="range-field" for="meta-image"><span>${esc(fields[3])}</span><input id="meta-image" type="url" placeholder="${esc(placeholders[3])}"></label>
                                <label class="range-field" for="meta-site"><span>${esc(fields[4])}</span><input id="meta-site" type="text" maxlength="80" placeholder="${esc(placeholders[4])}"></label>
                                <button class="btn btn-accent" id="meta-fill-sample" type="button">${esc(t.sample)}</button>
                                <button class="btn btn-ghost" id="meta-clear" type="button">${esc(t.clear)}</button>
                                <button class="btn btn-ghost" id="meta-copy" type="button">${esc(t.copy)}</button>
                            </div>
                            <p class="bg-status" id="meta-copy-status">${esc(t.guidance)}</p>
                        </div>
                        <div class="bg-panel">
                            <div class="meta-preview-stack">
                                <div class="meta-preview-card google-preview"><div class="category-title">${esc(t.google)}</div><div id="google-url" class="meta-url-line"></div><h3 id="google-title"></h3><p id="google-description"></p></div>
                                <div class="meta-preview-card social-preview"><div class="category-title">${esc(t.social)}</div><div id="og-image" class="meta-image-box">OG</div><div class="meta-social-body"><span id="og-site"></span><h3 id="og-title"></h3><p id="og-description"></p><small id="og-url"></small></div></div>
                                <div class="meta-preview-card social-preview"><div class="category-title">${esc(t.twitter)}</div><div id="x-image" class="meta-image-box">X</div><div class="meta-social-body"><h3 id="x-title"></h3><p id="x-description"></p><small id="x-url"></small></div></div>
                            </div>
                        </div>
                    </div>
                    <section class="article" style="margin-top:24px;"><h2>${esc(t.guidanceTitle)}</h2><p><b>${esc(t.titleCount)}:</b> <span id="meta-title-count" class="mono num">0</span> · <span id="meta-title-hint"></span></p><p><b>${esc(t.descCount)}:</b> <span id="meta-description-count" class="mono num">0</span> · <span id="meta-description-hint"></span></p><p>${esc(t.guidance)}</p></section>
                    <div class="banner-ad"><span class="ad-label">Ad</span><ins class="adsbygoogle ad-below" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_META_BELOW_TOOL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div>
                </section>
                <aside class="rail" aria-label="Sidebar"><div class="ad-slot"><span class="ad-label">Ad</span><div class="ad-body"><ins class="adsbygoogle ad-rail" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="REPLACE_META_RAIL_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins></div><div class="ad-foot"></div></div><div class="rail-card trust"><h3>${esc(t.trustTitle)}</h3><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>${t.trustOne}</div></div><div class="item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div>${t.trustTwo}</div></div></div></aside>
            </div>
${aeoSummary(t, esc)}
            <section id="how" class="article"><h2>${esc(t.articleTitle)}</h2><p>${esc(t.articleP1)}</p><p>${esc(t.articleP2)}</p></section>
            <section id="faq" class="article"><h2>${esc(t.faqTitle)}</h2>
${t.faq.map(([q, a]) => `                <h3>${esc(q)}</h3>\n                <p>${esc(a)}</p>`).join('\n')}
            </section>
            <section id="privacy" class="article"><h2>${esc(t.privacyTitle)}</h2><p>${esc(t.privacy)}</p></section>
            <section id="terms" class="article"><h2>${esc(t.termsTitle)}</h2><p>${esc(t.terms)}</p></section>
<!-- RELATED_TOOLS_START -->
<!-- RELATED_TOOLS_END -->
        </main>
        <footer class="footer"><div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — runs entirely in your browser.</div><nav class="links" aria-label="Footer"><a href="${link(locale, 'tools')}">Tools</a><a href="${route(locale)}#how">Guide</a><a href="${route(locale)}#faq">FAQ</a><a href="${route(locale)}#privacy">Privacy</a><a href="${route(locale)}#terms">Terms</a></nav></footer>
    </div>
    <script src="/meta-preview-checker/meta-preview-checker.js"></script>
</body>
</html>
`;
}

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'meta-preview-checker');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}
console.log('Generated localized meta preview checker pages');
