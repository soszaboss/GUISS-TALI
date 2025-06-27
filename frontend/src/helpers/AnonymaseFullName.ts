 export function anonymizeName(fullName: string): string {
  const maskWord = (word: string): string => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  };

  return fullName
    .split(/\s+/)
    .map(maskWord)
    .join(' ');
}