import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MOCK_ACTIVITE_RECENTE,
  MOCK_DASHBOARD_STATS,
  MOCK_INSTITUTION
} from '../../assets/data/mock-data.admin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  readonly institution = MOCK_INSTITUTION;
  readonly stats = MOCK_DASHBOARD_STATS;
  readonly activiteRecente = MOCK_ACTIVITE_RECENTE;
}