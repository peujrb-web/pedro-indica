'use client';

import { useEffect } from 'react';
import { Group } from '@/lib/types';
import { trackGroupCardView } from '@/lib/analytics';

interface AnalyticsTrackerProps {
  groups: Group[];
}

export function AnalyticsTracker({ groups }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Registra a visualização dos grupos no carregamento inicial da página
    groups.forEach((group) => {
      trackGroupCardView(group.id, group.title);
    });
  }, [groups]);

  return null;
}
