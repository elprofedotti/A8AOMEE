import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient, private socket: Socket) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`);
  }

  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.put<Notification>(`${environment.apiUrl}/notifications/${notificationId}/read`, {});
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/notifications/${notificationId}`);
  }

  subscribeToNotifications(userId: string) {
    this.socket.emit('subscribe_to_notifications', userId);
  }

  unsubscribeFromNotifications(userId: string) {
    this.socket.emit('unsubscribe_from_notifications', userId);
  }

  onNewNotification(): Observable<Notification> {
    return this.socket.fromEvent<Notification>('new_notification');
  }
}