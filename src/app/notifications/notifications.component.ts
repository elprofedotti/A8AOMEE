import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  async loadNotifications() {
    try {
      const scheduledIds = await this.notificationService.getScheduledNotifications();
      // In a real app, you'd fetch notification details from your backend
      this.notifications = scheduledIds.map(id => ({
        id: id,
        title: 'Notification Title',
        body: 'Notification Body',
        date: new Date()
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
}