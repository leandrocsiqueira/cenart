import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    public themeService: ThemeService
  ) {}

  logout(): void {
    const DIALOG_CONFIG = new MatDialogConfig();
    DIALOG_CONFIG.data = {
      message: 'Logout',
    };
    const DIALOG_REFERENCE = this.dialog.open(
      ConfirmationComponent,
      DIALOG_CONFIG
    );
    const RESPONSE =
      DIALOG_REFERENCE.componentInstance.onEmitStatusChange.subscribe(
        (response: any) => {
          DIALOG_REFERENCE.close();
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      );
  }

  changeTheme(color: any) {
    this.themeService.setTheme(color);
  }
}
