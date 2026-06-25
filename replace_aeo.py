import os

th_dir = 'th'
vi_dir = 'vi'

th_replace = {
    '<h2>What this tool does</h2>': '<h2>เครื่องมือนี้ทำอะไร</h2>',
    '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>ข้อมูลที่เลือกจะถูกประมวลผลในเบราว์เซอร์ของคุณสำหรับขั้นตอนนี้ เว็บไซต์สาธารณะอาจโหลดโฆษณาและการวิเคราะห์ข้อมูล ควรใช้บิลด์ส่วนตัวสำหรับขั้นตอนที่ต้องการความเป็นส่วนตัวสูง</p>'
}

vi_replace = {
    '<h2>What this tool does</h2>': '<h2>Công cụ này làm gì</h2>',
    '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>Dữ liệu đã chọn được xử lý cục bộ trên trình duyệt của bạn cho quy trình này. Trang web công khai có thể tải quảng cáo và phân tích; hãy sử dụng bản dựng riêng tư cho các quy trình yêu cầu bảo mật cao.</p>'
}

def process_dir(directory, replace_dict):
    count = 0
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith('.html'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                original_content = content
                for old, new in replace_dict.items():
                    content = content.replace(old, new)
                
                if content != original_content:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(content)
                    count += 1
    print(f"Updated {count} files in {directory}/")

process_dir(th_dir, th_replace)
process_dir(vi_dir, vi_replace)
