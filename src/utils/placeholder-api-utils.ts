export const generatePlaceholderUrl = (text: string): string => {
  // Bright, pleasant background colors
  const bgColors = [
    "FF6B6B", // coral red
    "FFD93D", // golden yellow
    "6BCB77", // soft green
    "4D96FF", // bright blue
    "FF6F91", // pink
    "845EC2", // purple
    "00C9A7", // aqua
    "FF9671", // orange
    "FFC75F", // warm yellow-orange
    "0081CF", // bold blue
  ];

  // Text colors that ensure contrast
  const textColors = ["ffffff", "f7f7f7", "fafafa", "e0e0e0"];

  const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
  const fg = textColors[Math.floor(Math.random() * textColors.length)];

  const encodedText = encodeURIComponent(text);

  return `https://placehold.co/600x400/${bg}/${fg}?text=${encodedText}`;
};
