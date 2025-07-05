import { mapCategoryToDisplayCategory } from '../csvCategoriesService';

describe('mapCategoryToDisplayCategory', () => {
  it('maps known categories correctly', () => {
    expect(mapCategoryToDisplayCategory('decentralized finance')).toBe('DeFi');
    expect(mapCategoryToDisplayCategory('smart contract platform')).toBe('Layer 1');
    expect(mapCategoryToDisplayCategory('gaming')).toBe('Gaming & Metaverse');
  });

  it('falls back to capitalized input when mapping is missing', () => {
    expect(mapCategoryToDisplayCategory('unknown category')).toBe('Unknown Category');
  });
});
