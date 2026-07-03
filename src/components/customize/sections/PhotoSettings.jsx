import React from 'react';
import Card from '../ui/Card.jsx';
import SelectInput from '../ui/SelectInput.jsx';
import { useActiveTemplate } from '../../../hooks/index.js';

export default function PhotoSettings({ customize, updateCustomize }) {
  const { meta } = useActiveTemplate();
  const supports = meta?.supports || {};
  const photo = customize.photo || {};
  if (!supports.photo) return <Card id="photo" title="Photo"><p style={{ color: '#999', fontSize: 13 }}>Not supported by this template.</p></Card>;
  return (
    <Card id="photo" title="Photo">
      <SelectInput
        label="Shape"
        value={photo.shape || 'circle'}
        options={[
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
          { value: 'rounded', label: 'Rounded' },
        ]}
        onChange={v => updateCustomize('photo', { shape: v })}
      />
      <SelectInput
        label="Size"
        value={photo.size || 'medium'}
        options={[
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ]}
        onChange={v => updateCustomize('photo', { size: v })}
      />
    </Card>
  );
}
