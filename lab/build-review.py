"""Build a portable review artefact from the actual shared modules/recipes."""
from pathlib import Path
import json
import re
root = Path(__file__).resolve().parents[1]
paths = ['rules/typography.js', 'rules/fitting.js', 'rules/list.js', 'lab/scaffold.js', 'app.js']
modules, exports = {}, {}
for name in paths:
    source = (root/name).read_text()
    exports[name] = re.findall(r'export (?:async )?(?:function|class|const) (\w+)', source)
    def convert(match):
        dependency = str((root/Path(name).parent/match[2]).resolve().relative_to(root))
        return 'const {'+match[1]+'}=modules['+json.dumps(dependency)+'];'
    source = re.sub(r'import \{([^}]+)\} from [\'\"]([^\'\"]+)[\'\"];', convert, source)
    modules[name] = source.replace('export ', '')
bundle = 'const modules={};\n'
for name in paths[:-1]:
    bundle += 'modules['+json.dumps(name)+']=(()=>{\n'+modules[name]+'\nreturn {'+','.join(exports[name])+'};})();\n'
bundle += modules['app.js']
data = {str(f.relative_to(root)):json.loads(f.read_text()) for f in (root/'recipes').rglob('*.json')}
html = (root/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">', '<style>'+(root/'styles.css').read_text()+'</style>')
html = html.replace('<script type="module" src="app.js"></script>', '<script id="lab-data" type="application/json">'+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+'</script><script type="module">'+bundle+'</script>')
(root/'review').mkdir(exist_ok=True)
(root/'review/list-proof.html').write_text(html)
(root/'review/bundle-check.mjs').write_text(bundle)
