import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MOCK_ACTIVITE_RECENTE_MINESUP,
  MOCK_NATIONAL_STATS,
  MOCK_VERIFICATIONS_CURVE,
  MOCK_VERIFICATIONS_SUSPECTES
} from '../../assets/data/mock-data-superadmin';

@Component({
  selector: 'app-dashboard-superadmin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.css'
})
export class DashboardSuperadmin {
  readonly stats = MOCK_NATIONAL_STATS;
  readonly activiteRecente = MOCK_ACTIVITE_RECENTE_MINESUP;
  readonly verificationsSuspectes = MOCK_VERIFICATIONS_SUSPECTES;
  readonly curve = MOCK_VERIFICATIONS_CURVE;

  private readonly chartWidth = 640;
  private readonly chartHeight = 160;
  private readonly padding = 8;

  // Points normalisés du graphique, calculés une seule fois (données mock statiques).
  readonly points = computed(() => {
    const values = this.curve.map(p => p.total);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const stepX = (this.chartWidth - this.padding * 2) / (this.curve.length - 1);

    return this.curve.map((point, i) => {
      const x = this.padding + i * stepX;
      const normalized = (point.total - min) / range;
      const y = this.chartHeight - this.padding - normalized * (this.chartHeight - this.padding * 2);
      return { x, y, mois: point.mois, total: point.total };
    });
  });

  readonly polylinePoints = computed(() =>
    this.points().map(p => `${p.x},${p.y}`).join(' ')
  );

  readonly areaPath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) {
      return '';
    }
    const line = pts.map(p => `${p.x},${p.y}`).join(' L ');
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `M ${first.x},${this.chartHeight - this.padding} L ${line} L ${last.x},${this.chartHeight - this.padding} Z`;
  });
}