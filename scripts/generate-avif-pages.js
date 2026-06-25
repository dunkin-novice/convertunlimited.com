const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://convertunlimited.com';
const ADSENSE = 'ca-pub-2823470980745945';

const LOCALES = require('./data/locales');
const { aeoSummary, schemaScripts } = require('./data/page-helpers');

const TEXT = {
  en: {
    title: 'AVIF Converter - Convert JPG, PNG & WebP to AVIF Online | ConvertUnlimited',
    description: 'Convert JPG, PNG, and WebP images to AVIF in your browser. Supported AVIF conversion runs locally when the browser provides AVIF encoding.',
    hero: 'AVIF Converter',
    sub: 'Create modern, lightweight AVIF images in your browser.',
    eyebrow: 'Local-first AVIF conversion',
    panelTitle: 'Convert images to AVIF.',
    panelText: 'Upload JPG, PNG, WebP, or AVIF images and export AVIF files for modern websites. Selected file contents are processed locally in your browser when your browser supports local conversion.',
    dropTitle: 'Drop images here',
    dropHint: 'JPG, PNG, WebP, or AVIF where supported · processed on your device',
    quality: 'AVIF Quality',
    convert: 'Convert All',
    download: 'Download All (ZIP)',
    status: 'Images are converted in your browser when AVIF encoding is supported. ConvertUnlimited does not provide a server-side upload endpoint for this flow.',
    unsupported: 'AVIF encoding support varies by browser. The tool will show a message if local AVIF export is unavailable.',
    trustTitle: 'Why it is private',
    trustOne: '<b>Browser-based.</b> Images are decoded and encoded locally.',
    trustTwo: '<b>No signup.</b> Convert as many images as your browser can handle.',
    articleTitle: 'When should you use AVIF?',
    articleP1: 'AVIF is a modern image format built for efficient web delivery. It can produce small files while preserving detail, especially for photos and rich graphics.',
    articleP2: 'Use AVIF for websites, landing pages, product images, and performance-sensitive pages where modern browser support is acceptable. Keep JPG, PNG, or WebP fallbacks for older browsers or workflows that do not support AVIF yet.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      ['What is AVIF?', 'AVIF is a modern image format based on AV1 compression. It is designed to deliver high-quality images with smaller file sizes for the web.'],
      ['Is AVIF smaller than WebP?', 'Often, yes, but not always. Results depend on the image and quality setting, so compare the output before replacing production assets.'],
      ['Are my images sent to ConvertUnlimited servers?', 'No server-side upload endpoint is used for this AVIF conversion flow. The browser decodes and encodes images locally when AVIF encoding is supported.'],
      ['Why does AVIF conversion not work in some browsers?', 'Some browsers can display AVIF but cannot export AVIF through Canvas yet. In that case the page shows a friendly unsupported-browser message.'],
      ['Can I convert multiple images at once?', 'Yes. Add multiple files, convert them together, then download each AVIF file or a ZIP archive.'],
    ],
    privacyTitle: 'Privacy Policy',
    privacy: 'ConvertUnlimited does not provide a server-side upload endpoint for this AVIF conversion flow. Selected image contents are processed locally in your browser when supported.',
    termsTitle: 'Terms of Use',
    terms: 'ConvertUnlimited is provided as is. You are responsible for the files you process and for checking browser compatibility before publishing AVIF images.',
  },
  th: {
    title: 'ตัวแปลง AVIF - แปลง JPG, PNG และ WebP เป็น AVIF | ConvertUnlimited',
    description: 'แปลงภาพ JPG, PNG และ WebP เป็น AVIF ออนไลน์ในเบราว์เซอร์ ฟรี ไม่ต้องสมัคร และไม่อัปโหลดไฟล์เมื่อเบราว์เซอร์รองรับการแปลง AVIF',
    hero: 'ตัวแปลง AVIF',
    sub: 'สร้างภาพ AVIF ที่ทันสมัยและขนาดเล็กในเบราว์เซอร์ของคุณ',
    eyebrow: 'แปลง AVIF แบบทำงานในเครื่อง',
    panelTitle: 'แปลงภาพเป็น AVIF',
    panelText: 'อัปโหลด JPG, PNG, WebP หรือ AVIF แล้วส่งออกเป็นไฟล์ AVIF สำหรับเว็บไซต์ยุคใหม่ ไฟล์อยู่บนอุปกรณ์ของคุณเมื่อเบราว์เซอร์รองรับการแปลงในเครื่อง',
    dropTitle: 'วางรูปภาพที่นี่',
    dropHint: 'JPG, PNG, WebP หรือ AVIF เมื่อรองรับ · ประมวลผลบนอุปกรณ์ของคุณ',
    quality: 'คุณภาพ AVIF',
    convert: 'แปลงทั้งหมด',
    download: 'ดาวน์โหลดทั้งหมด (ZIP)',
    status: 'รูปภาพถูกแปลงในเบราว์เซอร์ ไฟล์ไม่ถูกอัปโหลด',
    unsupported: 'การเข้ารหัส AVIF รองรับไม่เท่ากันในแต่ละเบราว์เซอร์ เครื่องมือนี้จะแจ้งหากไม่สามารถส่งออก AVIF ในเครื่องได้',
    trustTitle: 'ทำไมจึงเป็นส่วนตัว',
    trustOne: '<b>ทำงานในเบราว์เซอร์</b> ภาพถูกอ่านและเข้ารหัสในเครื่อง',
    trustTwo: '<b>ไม่ต้องสมัคร</b> แปลงได้เท่าที่เบราว์เซอร์ของคุณรองรับ',
    articleTitle: 'ควรใช้ AVIF เมื่อใด',
    articleP1: 'AVIF เป็นฟอร์แมตรูปภาพสมัยใหม่ที่ออกแบบมาเพื่อส่งภาพบนเว็บอย่างมีประสิทธิภาพ ให้ไฟล์ขนาดเล็กพร้อมรักษารายละเอียดได้ดี',
    articleP2: 'ใช้ AVIF กับเว็บไซต์ หน้าแลนดิ้ง รูปสินค้า และหน้าที่ต้องการความเร็ว แต่ควรเตรียม JPG, PNG หรือ WebP สำรองสำหรับเบราว์เซอร์เก่าหรือระบบที่ยังไม่รองรับ',
    faqTitle: 'คำถามที่พบบ่อย',
    faq: [
      ['AVIF คืออะไร?', 'AVIF เป็นฟอร์แมตรูปภาพสมัยใหม่ที่ใช้การบีบอัด AV1 เพื่อให้ภาพคุณภาพดีและไฟล์เล็กสำหรับเว็บ'],
      ['AVIF เล็กกว่า WebP หรือไม่?', 'มักจะเล็กกว่า แต่ไม่เสมอไป ผลลัพธ์ขึ้นกับรูปและค่าคุณภาพ จึงควรเปรียบเทียบไฟล์ก่อนใช้งานจริง'],
      ['รูปภาพของฉันถูกอัปโหลดหรือไม่?', 'ไม่ เครื่องมือนี้ใช้เบราว์เซอร์ของคุณแปลงภาพในเครื่องเมื่อรองรับการเข้ารหัส AVIF'],
      ['ทำไมบางเบราว์เซอร์แปลง AVIF ไม่ได้?', 'บางเบราว์เซอร์แสดง AVIF ได้แต่ยังส่งออก AVIF ผ่าน Canvas ไม่ได้ หน้าจะแสดงข้อความแจ้งอย่างชัดเจน'],
      ['แปลงหลายภาพพร้อมกันได้ไหม?', 'ได้ เพิ่มหลายไฟล์ แปลงพร้อมกัน แล้วดาวน์โหลดทีละไฟล์หรือเป็น ZIP'],
    ],
    privacyTitle: 'นโยบายความเป็นส่วนตัว',
    privacy: 'เราไม่เก็บ ไม่จัดเก็บ และไม่ส่งรูปภาพที่คุณประมวลผล การแปลงทำงานในเบราว์เซอร์เมื่อรองรับ',
    termsTitle: 'ข้อกำหนดการใช้งาน',
    terms: 'ConvertUnlimited ให้บริการตามสภาพจริง คุณต้องรับผิดชอบไฟล์ที่ประมวลผลและตรวจสอบความเข้ากันได้ของ AVIF ก่อนเผยแพร่',
  },
  vi: {
    title: 'Trình chuyển đổi AVIF - Chuyển JPG, PNG & WebP sang AVIF | ConvertUnlimited',
    description: 'Chuyển ảnh JPG, PNG và WebP sang AVIF trong trình duyệt. Miễn phí, không cần đăng ký, không tải tệp lên máy chủ khi trình duyệt hỗ trợ.',
    hero: 'Trình chuyển đổi AVIF',
    sub: 'Tạo ảnh AVIF hiện đại, nhẹ hơn ngay trong trình duyệt.',
    eyebrow: 'Chuyển AVIF cục bộ',
    panelTitle: 'Chuyển ảnh sang AVIF.',
    panelText: 'Tải JPG, PNG, WebP hoặc AVIF lên và xuất tệp AVIF cho website hiện đại. Tệp ở lại trên thiết bị khi trình duyệt hỗ trợ chuyển đổi cục bộ.',
    dropTitle: 'Thả ảnh vào đây',
    dropHint: 'JPG, PNG, WebP hoặc AVIF khi hỗ trợ · xử lý trên thiết bị',
    quality: 'Chất lượng AVIF',
    convert: 'Chuyển tất cả',
    download: 'Tải tất cả (ZIP)',
    status: 'Ảnh được chuyển trong trình duyệt. Tệp không được tải lên.',
    unsupported: 'Khả năng mã hóa AVIF khác nhau theo trình duyệt. Công cụ sẽ báo nếu không thể xuất AVIF cục bộ.',
    trustTitle: 'Vì sao riêng tư',
    trustOne: '<b>Chạy trong trình duyệt.</b> Ảnh được đọc và mã hóa cục bộ.',
    trustTwo: '<b>Không cần đăng ký.</b> Chuyển đổi theo khả năng của trình duyệt.',
    articleTitle: 'Khi nào nên dùng AVIF?',
    articleP1: 'AVIF là định dạng ảnh hiện đại cho web, giúp tạo tệp nhỏ trong khi vẫn giữ chi tiết tốt, nhất là với ảnh chụp và đồ họa phong phú.',
    articleP2: 'Dùng AVIF cho website, trang đích, ảnh sản phẩm và trang cần hiệu năng cao. Hãy giữ JPG, PNG hoặc WebP dự phòng cho trình duyệt cũ.',
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      ['AVIF là gì?', 'AVIF là định dạng ảnh hiện đại dựa trên nén AV1, được thiết kế cho ảnh web chất lượng cao với dung lượng nhỏ.'],
      ['AVIF có nhỏ hơn WebP không?', 'Thường là có, nhưng không phải lúc nào cũng vậy. Kết quả phụ thuộc vào ảnh và mức chất lượng.'],
      ['Ảnh của tôi có được tải lên không?', 'Không. Công cụ dùng trình duyệt để giải mã và mã hóa ảnh cục bộ khi hỗ trợ AVIF.'],
      ['Vì sao một số trình duyệt không chuyển được AVIF?', 'Một số trình duyệt xem được AVIF nhưng chưa xuất được AVIF qua Canvas. Khi đó trang sẽ hiển thị thông báo rõ ràng.'],
      ['Có thể chuyển nhiều ảnh cùng lúc không?', 'Có. Thêm nhiều tệp, chuyển cùng lúc rồi tải từng tệp AVIF hoặc tải ZIP.'],
    ],
    privacyTitle: 'Chính sách quyền riêng tư',
    privacy: 'Chúng tôi không thu thập, lưu trữ hoặc truyền ảnh bạn xử lý. Việc chuyển đổi chạy cục bộ trong trình duyệt khi được hỗ trợ.',
    termsTitle: 'Điều khoản sử dụng',
    terms: 'ConvertUnlimited được cung cấp nguyên trạng. Bạn chịu trách nhiệm về tệp xử lý và kiểm tra tương thích AVIF trước khi xuất bản.',
  },
  zh: {
    title: 'AVIF 转换器 - 在线将 JPG、PNG 和 WebP 转为 AVIF | ConvertUnlimited',
    description: '在浏览器中将 JPG、PNG 和 WebP 图片转换为 AVIF。免费、无需注册，浏览器支持时无需上传到服务器。',
    hero: 'AVIF 转换器',
    sub: '在浏览器中创建现代、轻量的 AVIF 图片。',
    eyebrow: '本地优先 AVIF 转换',
    panelTitle: '将图片转换为 AVIF。',
    panelText: '上传 JPG、PNG、WebP 或 AVIF 图片，导出适合现代网站的 AVIF 文件。浏览器支持本地转换时，文件会留在你的设备上。',
    dropTitle: '将图片拖到这里',
    dropHint: 'JPG、PNG、WebP 或支持时的 AVIF · 在设备上处理',
    quality: 'AVIF 质量',
    convert: '全部转换',
    download: '全部下载 (ZIP)',
    status: '图片会在浏览器中转换，不会上传文件。',
    unsupported: '不同浏览器对 AVIF 编码支持不同。如果无法本地导出 AVIF，工具会显示提示。',
    trustTitle: '为什么更私密',
    trustOne: '<b>基于浏览器。</b> 图片在本地解码和编码。',
    trustTwo: '<b>无需注册。</b> 可按浏览器能力批量转换。',
    articleTitle: '什么时候适合使用 AVIF？',
    articleP1: 'AVIF 是面向高效网页传输的现代图片格式。它通常能在保留细节的同时生成较小文件，尤其适合照片和复杂图形。',
    articleP2: '适合用于网站、落地页、商品图和重视性能的页面。对于旧浏览器或不支持 AVIF 的流程，请保留 JPG、PNG 或 WebP 备用。',
    faqTitle: '常见问题',
    faq: [
      ['AVIF 是什么？', 'AVIF 是基于 AV1 压缩的现代图片格式，设计目标是在网页上以较小体积提供高质量图片。'],
      ['AVIF 比 WebP 更小吗？', '很多情况下是，但不绝对。结果取决于图片内容和质量设置，建议先比较输出。'],
      ['我的图片会上传吗？', '不会。浏览器支持 AVIF 编码时，工具会在本地解码和编码图片。'],
      ['为什么某些浏览器不能转换 AVIF？', '有些浏览器可以显示 AVIF，但还不能通过 Canvas 导出 AVIF。此时页面会显示友好提示。'],
      ['可以一次转换多张图片吗？', '可以。添加多个文件后统一转换，再逐个下载或下载 ZIP。'],
    ],
    privacyTitle: '隐私政策',
    privacy: '我们不会收集、存储或传输你处理的图片。浏览器支持时，转换会在本地完成。',
    termsTitle: '使用条款',
    terms: 'ConvertUnlimited 按原样提供。你需对处理的文件负责，并在发布 AVIF 图片前确认浏览器兼容性。',
  },
  ja: {
    title: 'AVIF 変換ツール - JPG、PNG、WebP を AVIF に変換 | ConvertUnlimited',
    description: 'JPG、PNG、WebP 画像をブラウザ内で AVIF に変換。無料、登録不要。対応ブラウザではサーバーアップロードなしで処理します。',
    hero: 'AVIF 変換ツール',
    sub: 'ブラウザ内でモダンで軽量な AVIF 画像を作成します。',
    eyebrow: 'ローカル優先の AVIF 変換',
    panelTitle: '画像を AVIF に変換。',
    panelText: 'JPG、PNG、WebP、または対応している AVIF をアップロードし、現代的な Web 向けの AVIF ファイルを書き出します。対応ブラウザではファイルは端末内に留まります。',
    dropTitle: 'ここに画像をドロップ',
    dropHint: 'JPG、PNG、WebP、対応時は AVIF · 端末上で処理',
    quality: 'AVIF 品質',
    convert: 'すべて変換',
    download: 'すべてダウンロード (ZIP)',
    status: '画像はブラウザ内で変換されます。ファイルはアップロードされません。',
    unsupported: 'AVIF エンコード対応はブラウザによって異なります。ローカル書き出しが使えない場合はメッセージを表示します。',
    trustTitle: 'プライバシーについて',
    trustOne: '<b>ブラウザ内で処理。</b> 画像の読み込みとエンコードはローカルで行われます。',
    trustTwo: '<b>登録不要。</b> ブラウザが扱える範囲でまとめて変換できます。',
    articleTitle: 'AVIF はいつ使うべき？',
    articleP1: 'AVIF は効率的な Web 配信のための現代的な画像形式です。写真やリッチな画像で、細部を保ちながら小さなファイルを作りやすい形式です。',
    articleP2: 'Web サイト、ランディングページ、商品画像、速度を重視するページに向いています。古いブラウザ向けには JPG、PNG、WebP の代替も用意してください。',
    faqTitle: 'よくある質問',
    faq: [
      ['AVIF とは？', 'AVIF は AV1 圧縮をベースにした現代的な画像形式で、Web 向けに高品質で小さな画像を届けるために作られています。'],
      ['AVIF は WebP より小さいですか？', '多くの場合は小さくなりますが、常にそうとは限りません。画像と品質設定によって結果は変わります。'],
      ['画像はアップロードされますか？', 'いいえ。AVIF エンコードに対応したブラウザでは、画像のデコードとエンコードはローカルで行われます。'],
      ['一部のブラウザで AVIF 変換できないのはなぜ？', 'AVIF 表示はできても Canvas から AVIF を書き出せないブラウザがあります。その場合は明確なメッセージを表示します。'],
      ['複数画像を一度に変換できますか？', 'はい。複数ファイルを追加してまとめて変換し、個別または ZIP でダウンロードできます。'],
    ],
    privacyTitle: 'プライバシーポリシー',
    privacy: '処理する画像を収集、保存、送信しません。対応ブラウザでは変換はローカルで実行されます。',
    termsTitle: '利用規約',
    terms: 'ConvertUnlimited は現状のまま提供されます。処理するファイルと AVIF 公開前の互換性確認は利用者の責任です。',
  },
  ko: {
    title: 'AVIF 변환기 - JPG, PNG, WebP를 AVIF로 변환 | ConvertUnlimited',
    description: '브라우저에서 JPG, PNG, WebP 이미지를 AVIF로 변환하세요. 무료, 가입 없음, 지원 브라우저에서는 서버 업로드 없이 처리됩니다.',
    hero: 'AVIF 변환기',
    sub: '브라우저에서 현대적이고 가벼운 AVIF 이미지를 만듭니다.',
    eyebrow: '로컬 우선 AVIF 변환',
    panelTitle: '이미지를 AVIF로 변환하세요.',
    panelText: 'JPG, PNG, WebP 또는 지원되는 AVIF 이미지를 업로드하고 최신 웹사이트용 AVIF 파일로 내보냅니다. 지원 브라우저에서는 파일이 기기에 남아 있습니다.',
    dropTitle: '이미지를 여기에 놓기',
    dropHint: 'JPG, PNG, WebP 또는 지원 시 AVIF · 기기에서 처리',
    quality: 'AVIF 품질',
    convert: '전체 변환',
    download: '전체 다운로드 (ZIP)',
    status: '이미지는 브라우저에서 변환됩니다. 파일은 업로드되지 않습니다.',
    unsupported: 'AVIF 인코딩 지원은 브라우저마다 다릅니다. 로컬 AVIF 내보내기를 사용할 수 없으면 안내 메시지가 표시됩니다.',
    trustTitle: '개인정보가 보호되는 이유',
    trustOne: '<b>브라우저 기반.</b> 이미지는 로컬에서 디코딩되고 인코딩됩니다.',
    trustTwo: '<b>가입 없음.</b> 브라우저가 처리할 수 있는 만큼 변환하세요.',
    articleTitle: 'AVIF는 언제 사용하면 좋나요?',
    articleP1: 'AVIF는 효율적인 웹 전송을 위한 최신 이미지 형식입니다. 사진과 복잡한 그래픽에서 작은 파일 크기와 좋은 디테일을 기대할 수 있습니다.',
    articleP2: '웹사이트, 랜딩 페이지, 제품 이미지, 성능이 중요한 페이지에 적합합니다. 오래된 브라우저를 위해 JPG, PNG 또는 WebP 대체 파일도 유지하세요.',
    faqTitle: '자주 묻는 질문',
    faq: [
      ['AVIF란 무엇인가요?', 'AVIF는 AV1 압축 기반의 최신 이미지 형식으로, 웹에서 고품질 이미지를 작은 파일로 제공하도록 설계되었습니다.'],
      ['AVIF가 WebP보다 작나요?', '대체로 그런 경우가 많지만 항상 그렇지는 않습니다. 이미지와 품질 설정에 따라 결과가 달라집니다.'],
      ['이미지가 업로드되나요?', '아니요. AVIF 인코딩을 지원하는 브라우저에서는 이미지 디코딩과 인코딩이 로컬에서 실행됩니다.'],
      ['일부 브라우저에서 AVIF 변환이 안 되는 이유는?', '일부 브라우저는 AVIF를 표시할 수 있지만 Canvas로 AVIF를 내보내지는 못합니다. 이 경우 안내 메시지를 표시합니다.'],
      ['여러 이미지를 한 번에 변환할 수 있나요?', '네. 여러 파일을 추가하고 함께 변환한 뒤 개별 파일이나 ZIP으로 다운로드할 수 있습니다.'],
    ],
    privacyTitle: '개인정보 처리방침',
    privacy: '처리하는 이미지를 수집, 저장 또는 전송하지 않습니다. 지원 브라우저에서는 변환이 로컬에서 실행됩니다.',
    termsTitle: '이용 약관',
    terms: 'ConvertUnlimited는 있는 그대로 제공됩니다. 처리하는 파일과 AVIF 게시 전 호환성 확인은 사용자 책임입니다.',
  },
  es: {
    title: 'Convertidor AVIF - Convierte JPG, PNG y WebP a AVIF | ConvertUnlimited',
    description: 'Convierte imágenes JPG, PNG y WebP a AVIF en tu navegador. Gratis, sin registro y sin subir archivos al servidor cuando tu navegador lo permite.',
    hero: 'Convertidor AVIF',
    sub: 'Crea imágenes AVIF modernas y ligeras en tu navegador.',
    eyebrow: 'Conversión AVIF local',
    panelTitle: 'Convierte imágenes a AVIF.',
    panelText: 'Sube imágenes JPG, PNG, WebP o AVIF y exporta archivos AVIF para sitios web modernos. Tus archivos permanecen en tu dispositivo cuando el navegador permite la conversión local.',
    dropTitle: 'Suelta imágenes aquí',
    dropHint: 'JPG, PNG, WebP o AVIF si es compatible · procesado en tu dispositivo',
    quality: 'Calidad AVIF',
    convert: 'Convertir todo',
    download: 'Descargar todo (ZIP)',
    status: 'Las imágenes se convierten en tu navegador. Los archivos no se suben.',
    unsupported: 'La codificación AVIF depende del navegador. La herramienta avisará si la exportación AVIF local no está disponible.',
    trustTitle: 'Por qué es privado',
    trustOne: '<b>Basado en navegador.</b> Las imágenes se decodifican y codifican localmente.',
    trustTwo: '<b>Sin registro.</b> Convierte tantas imágenes como tu navegador pueda manejar.',
    articleTitle: '¿Cuándo conviene usar AVIF?',
    articleP1: 'AVIF es un formato de imagen moderno creado para una entrega web eficiente. Puede producir archivos pequeños manteniendo buen detalle, especialmente en fotos y gráficos ricos.',
    articleP2: 'Úsalo en sitios web, landing pages, imágenes de producto y páginas donde el rendimiento importa. Mantén alternativas JPG, PNG o WebP para navegadores antiguos.',
    faqTitle: 'Preguntas frecuentes',
    faq: [
      ['¿Qué es AVIF?', 'AVIF es un formato de imagen moderno basado en compresión AV1, diseñado para ofrecer imágenes web de alta calidad con menor tamaño.'],
      ['¿AVIF es más pequeño que WebP?', 'A menudo sí, pero no siempre. Depende de la imagen y del ajuste de calidad, así que compara el resultado antes de reemplazar recursos.'],
      ['¿Mis imágenes se suben?', 'No. Esta herramienta usa tu navegador para decodificar y codificar imágenes localmente cuando AVIF es compatible.'],
      ['¿Por qué AVIF no funciona en algunos navegadores?', 'Algunos navegadores pueden mostrar AVIF pero no exportarlo mediante Canvas. En ese caso la página muestra un mensaje claro.'],
      ['¿Puedo convertir varias imágenes a la vez?', 'Sí. Añade varios archivos, conviértelos juntos y descarga cada AVIF o un archivo ZIP.'],
    ],
    privacyTitle: 'Política de privacidad',
    privacy: 'No recopilamos, almacenamos ni transmitimos las imágenes que procesas. La conversión se ejecuta localmente en el navegador cuando es compatible.',
    termsTitle: 'Términos de uso',
    terms: 'ConvertUnlimited se proporciona tal cual. Eres responsable de los archivos que procesas y de comprobar la compatibilidad de AVIF antes de publicar.',
  },
  fr: {
    title: 'Convertisseur AVIF - Convertir JPG, PNG et WebP en AVIF | ConvertUnlimited',
    description: 'Convertissez des images JPG, PNG et WebP en AVIF dans votre navigateur. Gratuit, sans inscription et sans téléversement serveur lorsque le navigateur le prend en charge.',
    hero: 'Convertisseur AVIF',
    sub: 'Créez des images AVIF modernes et légères dans votre navigateur.',
    eyebrow: 'Conversion AVIF locale',
    panelTitle: 'Convertir des images en AVIF.',
    panelText: 'Importez des images JPG, PNG, WebP ou AVIF et exportez des fichiers AVIF pour les sites modernes. Vos fichiers restent sur votre appareil lorsque le navigateur prend en charge la conversion locale.',
    dropTitle: 'Déposez vos images ici',
    dropHint: 'JPG, PNG, WebP ou AVIF si compatible · traité sur votre appareil',
    quality: 'Qualité AVIF',
    convert: 'Tout convertir',
    download: 'Tout télécharger (ZIP)',
    status: 'Les images sont converties dans votre navigateur. Les fichiers ne sont pas envoyés.',
    unsupported: 'La prise en charge de l’encodage AVIF varie selon le navigateur. L’outil affiche un message si l’export AVIF local est indisponible.',
    trustTitle: 'Pourquoi c’est privé',
    trustOne: '<b>Basé sur le navigateur.</b> Les images sont décodées et encodées localement.',
    trustTwo: '<b>Sans inscription.</b> Convertissez autant d’images que votre navigateur peut gérer.',
    articleTitle: 'Quand utiliser AVIF ?',
    articleP1: 'AVIF est un format d’image moderne conçu pour une diffusion web efficace. Il peut produire de petits fichiers tout en conservant les détails, surtout pour les photos et visuels riches.',
    articleP2: 'Utilisez AVIF pour les sites web, landing pages, images produit et pages sensibles aux performances. Conservez des versions JPG, PNG ou WebP pour les navigateurs plus anciens.',
    faqTitle: 'Foire aux questions',
    faq: [
      ['Qu’est-ce qu’AVIF ?', 'AVIF est un format d’image moderne basé sur la compression AV1, pensé pour fournir des images web de qualité avec des fichiers plus petits.'],
      ['AVIF est-il plus petit que WebP ?', 'Souvent oui, mais pas toujours. Le résultat dépend de l’image et du réglage de qualité. Comparez la sortie avant de remplacer vos fichiers.'],
      ['Mes images sont-elles envoyées ?', 'Non. Cet outil utilise votre navigateur pour décoder et encoder les images localement lorsque l’encodage AVIF est pris en charge.'],
      ['Pourquoi AVIF ne fonctionne-t-il pas dans certains navigateurs ?', 'Certains navigateurs affichent AVIF mais ne peuvent pas l’exporter via Canvas. Dans ce cas, la page affiche un message clair.'],
      ['Puis-je convertir plusieurs images à la fois ?', 'Oui. Ajoutez plusieurs fichiers, convertissez-les ensemble, puis téléchargez chaque AVIF ou une archive ZIP.'],
    ],
    privacyTitle: 'Politique de confidentialité',
    privacy: 'Nous ne collectons, ne stockons ni ne transmettons les images traitées. La conversion s’exécute localement dans le navigateur lorsque c’est compatible.',
    termsTitle: 'Conditions d’utilisation',
    terms: 'ConvertUnlimited est fourni tel quel. Vous êtes responsable des fichiers traités et de la vérification de la compatibilité AVIF avant publication.',
  },
};

const htmlEscape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const route = (locale) => `${locale.prefix ? `/${locale.prefix}` : ''}/avif-converter/`;
const home = (locale) => locale.prefix ? `/${locale.prefix}/` : '/';
const absolute = (locale) => `${BASE_URL}${route(locale)}`;

const toolsDropdown = (locale) => {
  const p = locale.prefix ? `/${locale.prefix}` : '';
  const link = (slug) => `${p}${slug ? `/${slug}/` : '/'}`;
  return `<details class="tools-dropdown">
                    <summary aria-label="Tools">Tools <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px; opacity: 0.5;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
                    <div class="dropdown-menu" role="menu">
                        <div class="dropdown-section">Image Tools</div>
                        <a href="${link('')}">Image Converter</a>
                        <a href="${link('background-remover')}">Background Remover</a>
                        <a href="${link('image-compressor')}">Image Compressor</a>
                        <a href="${link('image-resizer')}">Image Resizer</a>
                        <a href="${link('metadata-remover')}">Metadata Remover</a>
                        <a href="${link('heic-to-jpg')}">HEIC to JPG</a>
                        <a href="${link('avif-converter')}" aria-current="page">AVIF Converter</a>
                        <div class="dropdown-section">PDF Tools</div>
                        <a href="${link('images-to-pdf')}">Images to PDF</a>
                        <a href="${link('pdf-to-images')}">PDF to Images</a>
                        <a href="${link('merge-pdf')}">Merge PDF</a>
                        <a href="${link('split-pdf')}">Split PDF</a>
                        <a href="${link('compress-pdf')}">Compress PDF</a>
                    </div>
                </details>`;
};

const languageSwitcher = (current) => `<details class="lang-switcher">
                    <summary aria-label="Language"><span aria-hidden="true">🌐</span> ${current.label}</summary>
                    <div class="lang-menu" role="menu">
${LOCALES.map((locale) => `                        <a href="${route(locale)}" hreflang="${locale.hreflang}" lang="${locale.hreflang}"${locale.code === current.code ? ' aria-current="page"' : ''}>${locale.name}</a>`).join('\n')}
                    </div>
                </details>`;

const alternates = () => `${LOCALES.map((locale) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${absolute(locale)}">`).join('\n')}
    <link rel="alternate" hreflang="x-default" href="${absolute(LOCALES[0])}">`;

const page = (locale) => {
  const text = TEXT[locale.code];
  return `<!DOCTYPE html>
<html lang="${locale.hreflang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${htmlEscape(text.title)}</title>
    <meta name="description" content="${htmlEscape(text.description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#3aa17e">
<link rel="canonical" href="${absolute(locale)}">

${alternates()}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">

    ${schemaScripts(text, locale, { url: absolute(locale), applicationCategory: 'MultimediaApplication' })}
</head>
<body>
    <div class="app">
        <header class="topbar">
            <a href="${home(locale)}" class="brand" aria-label="ConvertUnlimited home">
                <span class="mark" aria-hidden="true"></span>
                <span class="word"><b>Convert</b><span>Unlimited</span></span>
            </a>
            <nav class="topnav" aria-label="Primary">
                <span class="pill"><span class="dot"></span>100% free, no signup</span>
                ${toolsDropdown(locale)}
                ${languageSwitcher(locale)}
            </nav>
        </header>

        <main>
            <section class="hero">
                <h1 class="hero-title">${htmlEscape(text.hero)}</h1>
                <p class="sub hero-sub">${htmlEscape(text.sub)}</p>
            </section>

            <div class="grid" id="layout">
                <section class="bg-tool" aria-label="${htmlEscape(text.hero)}">
                    <div class="bg-tool-head">
                        <div>
                            <p class="section-eyebrow">${htmlEscape(text.eyebrow)}</p>
                            <h2>${htmlEscape(text.panelTitle)}</h2>
                            <p>${htmlEscape(text.panelText)}</p>
                        </div>
                    </div>

                    <div class="bg-workbench">
                        <div class="bg-drop" id="avif-dropzone" tabindex="0" role="button" aria-label="${htmlEscape(text.dropTitle)}">
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            </div>
                            <div class="title">${htmlEscape(text.dropTitle)}</div>
                            <div class="hint">${htmlEscape(text.dropHint)}</div>
                            <input type="file" id="avif-file-input" accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif" multiple hidden>
                        </div>

                        <div class="bg-panel">
                            <div class="bg-controls">
                                <label class="range-field" for="avif-quality">
                                    <span>${htmlEscape(text.quality)}</span>
                                    <input id="avif-quality" type="range" min="30" max="95" value="75">
                                    <span class="mono num" id="avif-quality-value">75%</span>
                                </label>
                                <button class="btn btn-accent" id="avif-convert-all-btn" disabled>${htmlEscape(text.convert)}</button>
                                <button class="btn btn-ghost" id="avif-download-all-btn" disabled>${htmlEscape(text.download)}</button>
                            </div>
                            <p class="bg-status" id="avif-status">${htmlEscape(text.status)}</p>
                            <p class="bg-status" id="avif-unsupported" hidden>${htmlEscape(text.unsupported)}</p>
                        </div>
                    </div>


                    <div id="avif-file-list" class="file-list" style="margin-top: 24px;"></div>
                </section>

                <aside class="rail" aria-label="Sidebar">

                    <div class="rail-card trust">
                        <h3>${htmlEscape(text.trustTitle)}</h3>
                        <div class="item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <div>${text.trustOne}</div>
                        </div>
                        <div class="item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <div>${text.trustTwo}</div>
                        </div>
                    </div>
                </aside>
            </div>

${aeoSummary(text, htmlEscape)}
            <section id="how" class="article">
                <h2>${htmlEscape(text.articleTitle)}</h2>
                <p>${htmlEscape(text.articleP1)}</p>
                <p>${htmlEscape(text.articleP2)}</p>
            </section>

            <section id="faq" class="article">
                <h2>${htmlEscape(text.faqTitle)}</h2>
${text.faq.map(([question, answer]) => `                <h3>${htmlEscape(question)}</h3>\n                <p>${htmlEscape(answer)}</p>`).join('\n')}
            </section>

            <section id="privacy" class="article">
                <h2>${htmlEscape(text.privacyTitle)}</h2>
                <p>${htmlEscape(text.privacy)}</p>
            </section>

            <section id="terms" class="article">
                <h2>${htmlEscape(text.termsTitle)}</h2>
                <p>${htmlEscape(text.terms)}</p>
            </section>

<!-- RELATED_TOOLS_START -->
<!-- RELATED_TOOLS_END -->
        </main>


        <footer class="footer">
            <div>© <span id="copyright-year">2026</span> ConvertUnlimited.com — ${locale.footerProcessing || 'supported processing runs in your browser'}.</div>
            <nav class="links" aria-label="Footer">
                <a href="${home(locale)}">Image Converter</a>
                <a href="${route(locale)}">${htmlEscape(text.hero)}</a>
                <a href="${locale.prefix ? `/${locale.prefix}/tools/` : '/tools/'}">Tools</a>
                <a href="${route(locale)}#how">AVIF guide</a>
                <a href="${route(locale)}#faq">${locale.faqLabel || 'FAQ'}</a>
                <a href="${route(locale)}#privacy">${locale.privacyLabel || 'Privacy'}</a>
                <a href="${route(locale)}#terms">${locale.termsLabel || 'Terms'}</a>
            </nav>
        </footer>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="/avif-converter/avif-converter.js"></script>
</body>
</html>
`;
};

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale.prefix || '', 'avif-converter');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale), 'utf8');
}

console.log('Generated localized AVIF converter pages');
