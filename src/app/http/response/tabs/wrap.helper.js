export default function wrap(apply) {
  return `
    text-wrap: ${apply ? 'wrap' : 'revert'};
    word-wrap: ${apply ? 'anywhere' : 'revert'};
  `
}
