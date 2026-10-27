
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandLogo } from '../../../shared/ui/brand-logo';
import { BackButton } from '../../../shared/ui/back-button';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';

/**
 * Page « Besoin d'aide » plein ecran (Module 3 etudiant) : sans sidebar ni
 * navbar du dashboard, avec logo cliquable, bouton retour et mode sombre.
 */
@Component({
  selector: 'app-student-help',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandLogo, BackButton, ThemeToggle],
  templateUrl: './student-help.html',
  styleUrl: './student-help.css',
})
export class StudentHelp {}

