import { Component, OnInit, Renderer2, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'Barun Ghosh - Full Stack Developer';
  isDarkTheme = false;
  isMenuOpen = false;
  currentYear = new Date().getFullYear();
  isBrowser: boolean;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Only access localStorage and window in browser environment
    if (this.isBrowser) {
      // Check for saved theme preference or default to system preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkTheme = savedTheme === 'dark';
      } else {
        // Check system preference
        this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.updateTheme();

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.isDarkTheme = e.matches;
          this.updateTheme();
        }
      });
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
    this.updateTheme();
  }

  private updateTheme() {
    if (this.isDarkTheme) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string) {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.isMenuOpen = false;
      }
    }
  }
}
