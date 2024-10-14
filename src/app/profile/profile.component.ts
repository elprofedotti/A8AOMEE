import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application, SegmentedBar, SegmentedBarItem, ImageSource } from '@nativescript/core';
import { AuthService } from '../services/auth.service';
import { RouterExtensions } from '@nativescript/angular';
import * as imagepicker from '@nativescript/imagepicker';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('buttonState', [
      state('normal', style({
        backgroundColor: '#007AFF',
      })),
      state('pressed', style({
        backgroundColor: '#005BB5',
        transform: 'scale(0.98)',
      })),
      transition('normal => pressed', animate('100ms ease-in')),
      transition('pressed => normal', animate('100ms ease-out')),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isSeller: boolean = false;
  sellerInfo: any = {};
  userTypes: SegmentedBarItem[];
  selectedUserTypeIndex: number;
  membershipTypes: SegmentedBarItem[];
  selectedMembershipIndex: number;
  buttonState: string = 'normal';

  constructor(
    private authService: AuthService,
    private routerExtensions: RouterExtensions
  ) {
    this.userTypes = this.getSegmentedBarItems(['Comprador', 'Vendedor']);
    this.membershipTypes = this.getSegmentedBarItems(['Plata', 'Oro', 'Platino']);
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  async loadUserProfile() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.user = currentUser;
        // Load additional user info from your backend or Firestore
        // Set isSeller, sellerInfo, selectedUserTypeIndex, and selectedMembershipIndex based on the loaded data
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  getSegmentedBarItems(items: string[]): SegmentedBarItem[] {
    return items.map((item) => {
      let segmentedBarItem = new SegmentedBarItem();
      segmentedBarItem.title = item;
      return segmentedBarItem;
    });
  }

  onUserTypeChange(args: SegmentedBar) {
    this.isSeller = args.selectedIndex === 1;
  }

  onMembershipChange(args: SegmentedBar) {
    // Handle membership change
  }

  async onChangePhotoTap() {
    try {
      const context = imagepicker.create({
        mode: 'single'
      });
      const selection = await context.present();
      if (selection.length > 0) {
        const imageAsset = selection[0];
        const imageSource = await ImageSource.fromAsset(imageAsset);
        this.user.photoURL = imageSource.toBase64String('jpg');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }

  async onSaveChanges() {
    this.buttonState = 'pressed';
    try {
      // Update user profile in Firebase and your backend
      // Update this.user, this.sellerInfo, etc.
      await this.authService.updateUserProfile(this.user);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setTimeout(() => this.buttonState = 'normal', 200);
    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.routerExtensions.navigate(['/login'], { clearHistory: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}