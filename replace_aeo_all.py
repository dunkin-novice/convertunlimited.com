import os

replacements = {
    'zh': {
        '<h2>What this tool does</h2>': '<h2>此工具的用途</h2>',
        '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>所选输入会在浏览器中为此流程处理。公共网站可能加载广告和 analytics；隐私敏感流程请使用 privacy build。</p>'
    },
    'ja': {
        '<h2>What this tool does</h2>': '<h2>このツールでできること</h2>',
        '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>選択した入力は、このワークフローではブラウザ内で処理されます。公開サイトでは広告や analytics が読み込まれる場合があります。機密性の高い作業には privacy build を使用してください。</p>'
    },
    'ko': {
        '<h2>What this tool does</h2>': '<h2>이 도구의 기능</h2>',
        '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>선택한 입력은 이 워크플로에서 브라우저 안에서 처리됩니다. 공개 사이트는 광고와 analytics를 로드할 수 있으므로 민감한 작업에는 privacy build를 사용하세요.</p>'
    },
    'es': {
        '<h2>What this tool does</h2>': '<h2>Qué hace esta herramienta</h2>',
        '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>Las entradas seleccionadas se procesan en el navegador para este flujo. El sitio público puede cargar anuncios y analytics; usa la privacy build para flujos sensibles.</p>'
    },
    'fr': {
        '<h2>What this tool does</h2>': '<h2>Fonction de cet outil</h2>',
        '<p>Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.</p>': '<p>Les entrées sélectionnées sont traitées dans le navigateur pour ce flux. Le site public peut charger des annonces et analytics; utilisez la privacy build pour les flux sensibles.</p>'
    }
}

def process_dir(directory, replace_dict):
    count = 0
    if not os.path.exists(directory):
        return
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

for lang, r_dict in replacements.items():
    process_dir(lang, r_dict)
