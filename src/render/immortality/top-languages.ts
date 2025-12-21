import path from 'path';
import { renderSvgFragment } from '../../assets';
import { IRender } from '../../types/render';
import { ILanguage } from '../../types/stats';

/**
 * 将编程语言名称简化为最多 4 个字符的缩写
 */
const shortenLanguageName = (name: string): string => {
  const languageMap: Record<string, string> = {
    'TypeScript': 'TS',
    'JavaScript': 'JS',
    'Python': 'Py',
    'Java': 'Java',
    'C++': 'C++',
    'C#': 'C#',
    'C': 'C',
    'Go': 'Go',
    'Rust': 'Rust',
    'PHP': 'PHP',
    'Ruby': 'Ruby',
    'Swift': 'Swft',
    'Kotlin': 'Kt',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'Shell': 'Sh',
    'Dart': 'Dart',
    'Vue': 'Vue',
    'Objective-C': 'ObjC',
    'Scala': 'Scla',
    'R': 'R',
    'Perl': 'Perl',
    'Lua': 'Lua',
    'Haskell': 'Hskl',
    'Elixir': 'Elxr',
    'Clojure': 'Cljr',
    'Vim Script': 'Vim',
    'Vim script': 'Vim',
    'Emacs Lisp': 'Emcs',
    'Assembly': 'Asm',
    'MATLAB': 'Mtlb',
    'Groovy': 'Grvy',
    'PowerShell': 'PS',
    'SCSS': 'SCSS',
    'SASS': 'SASS',
    'Less': 'Less',
    'Markdown': 'Md',
    'JSON': 'JSON',
    'YAML': 'YAML',
    'XML': 'XML',
    'SQL': 'SQL',
    'Makefile': 'Make',
    'Dockerfile': 'Dock',
    'OCaml': 'OCml',
    'F#': 'F#',
    'Erlang': 'Erlg',
    'Julia': 'Jula',
    'Solidity': 'Sol',
    'Fortran': 'Fort',
    'VHDL': 'VHDL',
    'Verilog': 'Verlg',
    'Zig': 'Zig',
    'Nim': 'Nim',
    'Crystal': 'Crst',
    'Racket': 'Rckt',
    'Scheme': 'Schm',
    'Common Lisp': 'Lisp',
    'Lisp': 'Lisp',
  };

  // 如果有预定义的缩写，使用它
  if (languageMap[name]) {
    return languageMap[name];
  }

  // 否则取前四个字符（大写）
  return name.slice(0, 4).toUpperCase();
};

export const renderTopLanguages = (render: IRender, languages: ILanguage[]): string => {
  // 如果没有语言数据，不渲染
  if (!languages || languages.length === 0) {
    return '';
  }

  const radius = 0; // 剑阵半径
  const centerX = 382; // 圆心 X 坐标
  const centerY = 124; // 圆心 Y 坐标
  const amount = Math.min(6, languages.length);
  const angleStep = 360 / amount; // 每把剑之间的角度

  let template = '';
  for (let i = 0; i < amount; i++) {
    if (i >= languages.length) {
      break;
    }
    template += renderLanguage(languages[i], i * angleStep, radius);
  }

  return `
    ${renderSvgFragment(path.resolve(__dirname, '../../assets/immortality/light/sword.svg'))}
    <g transform="translate(${centerX}, ${centerY})" class="fade-in" style="animation-delay: 2s">
      <g>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0"
          to="360"
          dur="30s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="scale"
          values="1;1.3;1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
        />
        ${template}
      </g>
    </g>
  `;
};

const renderLanguage = (language: ILanguage, angle: number, radius: number): string => {
  const shortName = shortenLanguageName(language.name).toUpperCase();
  // 剑指向圆心，先旋转到指定角度，再沿 Y 轴正方向平移半径距离
  return `
  <g transform="rotate(${angle}) translate(0, ${radius})">
    <use href="#e-sword" transform="scale(0.3)" />
    <text text-anchor="middle" fill="#4d4947" font-size="4" font-weight="600" transform="translate(9, 23)">
      ${shortName}
    </text>
  </g>
  `;
};
