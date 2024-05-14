import wrap from 'word-wrap';

export const wrapTextMultiline = (text: string, width = 59, maxLines = 3): string[] => {
  const fullWidthComma = '，';
  const encoded = encodeHTML(text);
  const isChinese = encoded.includes(fullWidthComma);

  let wrapped = [];

  if (isChinese) {
    wrapped = encoded.split(fullWidthComma); // Chinese full punctuation
  } else {
    wrapped = wrap(encoded, {
      width,
    }).split('\n'); // Split wrapped lines to get an array of lines
  }
  const lines = wrapped.map((line) => line.trim()).slice(0, maxLines);
  if (wrapped.length > maxLines) {
    lines[maxLines - 1] += '...';
  }

  const multiLineText = lines.filter(Boolean);
  return multiLineText;
};

const encodeHTML = (str: string) => {
  return str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => {
      return '&#' + i.charCodeAt(0) + ';';
    })
    .replace(/\u0008/gim, '');
};
