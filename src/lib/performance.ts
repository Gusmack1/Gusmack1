import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

declare global {
  interface Window {
    gtag?: (
      event: string,
      action: string,
      params: Record<string, number | string>
    ) => void;
  }
}

function sendToAnalytics(metric: Metric) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}


