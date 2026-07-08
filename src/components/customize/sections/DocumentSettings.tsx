import React from 'react';
import Card from '../ui/Card.jsx';
import SelectInput from '../ui/SelectInput.jsx';
import type { CustomizeSectionProps } from '../../../types';

export default function DocumentSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const doc = customize.document || {};
  return (
    <Card id="document" title="Document Settings">
      <SelectInput
        label="Language"
        value={doc.language || 'English (UK)'}
        options={[
          { value: 'English (UK)', label: 'English (UK)' },
          { value: 'English (US)', label: 'English (US)' },
          { value: 'Spanish', label: 'Spanish' },
          { value: 'French', label: 'French' },
          { value: 'German', label: 'German' },
        ]}
        onChange={v => updateCustomize('document', { language: v })}
      />
      <SelectInput
        label="Date Format"
        value={doc.dateFormat || 'DD MMM YYYY'}
        options={[
          { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
          { value: 'MMM YYYY', label: 'MMM YYYY' },
          { value: 'MM/YYYY', label: 'MM/YYYY' },
          { value: 'YYYY-MM', label: 'YYYY-MM' },
        ]}
        onChange={v => updateCustomize('document', { dateFormat: v })}
      />
      <SelectInput
        label="Page Format"
        value={doc.pageFormat || 'A4'}
        options={[
          { value: 'A4', label: 'A4' },
          { value: 'Letter', label: 'Letter (US)' },
          { value: 'A5', label: 'A5' },
        ]}
        onChange={v => updateCustomize('document', { pageFormat: v })}
      />
    </Card>
  );
}
