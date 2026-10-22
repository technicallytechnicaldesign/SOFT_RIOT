                                                                                                  
                                                                                                                     
                                                                                                          
export const sections = [
  { id: 'hairpiece', label: 'Hairpiece', short: 'HEAD', from: 0, to: .205 },
  { id: 'top', label: 'Top', short: 'TORSO', from: .205, to: .38 },
  { id: 'bottoms', label: 'Bottoms', short: 'LEGS', from: .38, to: .77 },
  { id: 'accessory', label: 'Accessory', short: 'EXTRAS', from: .77, to: 1 },
];
const data = await (await fetch('./garments.json?v=20260920-soft-riot')).json();
export const activeAudience = localStorage.getItem('soft-riot-audience') === 'youngling' ? 'youngling' : 'adult';
const describe = g => g.status === 'needs-touch' ? 'Hand-knit, photographed, cutout still being cleaned' : 'Hand-knit, photographed';
                                                                                                
                                                                                               
export const pieces = sections.flatMap((s, row) => data.garments.filter(g => !g.placeholder && (g.audience || 'adult') === activeAudience && g.slot === s.id).map((g, variant) => ({
  id: g.id, section: s.id, row, variant, name: g.name, description: describe(g),
  asset: `./${g.file}`, px: g.px, fit: g.fit, placeholder: !!g.placeholder, audience: g.audience || 'adult',
  color: ['#3d77ff', '#b241ff', '#17e5db'][variant % 3],
})));
export const counts = sections.map(s => pieces.filter(p => p.section === s.id).length);
