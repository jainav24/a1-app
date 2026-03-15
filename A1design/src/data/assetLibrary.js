import Pillar1 from '../../assets/integrate/pillar/pillar1.svg';
import Patti1 from '../../assets/integrate/patti/patti1.svg';
import Chaat1 from '../../assets/integrate/chaat/chaat1.svg';
import Bg1 from '../../assets/integrate/background/bg1.svg';

export const ASSET_LIBRARY = {
  pillar: [
    { id: 'pillar1', name: 'Temple Pillar', component: Pillar1 }
  ],
  patti: [
    { id: 'patti1', name: 'Golden Patti', component: Patti1 }
  ],
  chaat: [
    { id: 'chaat1', name: 'Classic Chaat', component: Chaat1 }
  ],
  background: [
    { id: 'bg1', name: 'Marble Floor', component: Bg1 }
  ]
};

export const ASSET_CATEGORIES = [
  { id: 'pillar', name: 'Pillar', icon: 'pillar' },
  { id: 'patti', name: 'Patti', icon: 'border-bottom-variant' },
  { id: 'chaat', name: 'Chaat', icon: 'texture-box' },
  { id: 'background', name: 'Background', icon: 'image-filter-hdr' },
];
