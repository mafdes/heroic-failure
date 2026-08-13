export const CRITICAL_ASSETS = [
  "assets/icons/dice.jpg",
  "assets/images/challenges/agility-bg.jpg",
  "assets/images/challenges/constitution-bg.jpg",
  "assets/images/challenges/dexterity-bg.jpg",
  "assets/images/challenges/gold-coin.jpg",
  "assets/images/challenges/hero-emblem.jpg",
  "assets/images/challenges/intelligence-bg.jpg",
  "assets/images/challenges/strength-bg.jpg",
  "assets/images/challenges/trap-rune.jpg",
  "assets/images/ui/parchment.jpg",
  "assets/images/classes/dummy.svg",
  "assets/images/classes/knight.svg",
  "assets/images/classes/mage.svg",
  "assets/images/runes/rune-crown.svg",
  "assets/images/runes/rune-eye.svg",
  "assets/images/runes/rune-gem.svg",
  "assets/images/runes/rune-moon.svg",
  "assets/images/runes/rune-star.svg",
  "assets/images/runes/rune-sun.svg",
];

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = async () => {
      if (image.decode) {
        try {
          await image.decode();
        } catch {
          // Some browsers resolve onload before decode is useful; cache is enough here.
        }
      }
      resolve({ src, ok: true });
    };

    image.onerror = () => resolve({ src, ok: false });
    image.src = src;
  });
}

export async function preloadAssets(assets = CRITICAL_ASSETS, onProgress = () => {}) {
  let completed = 0;

  const results = await Promise.all(assets.map(async (src) => {
    const result = await loadImage(src);
    completed += 1;
    onProgress({
      completed,
      total: assets.length,
      progress: completed / assets.length,
      result,
    });
    return result;
  }));

  return {
    loaded: results.filter((result) => result.ok),
    failed: results.filter((result) => !result.ok),
  };
}
