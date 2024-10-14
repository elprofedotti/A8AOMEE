     from 
    from 
    from 
    from 
    from 
    from 

    from 
    from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ChatComponent } from 
  NotificationsComponent } from './notifications/notifications.component';
import { MapComponent } from './map/map.component';
import { AuthComponent } from './auth/auth.component';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { ChatService } from './services/chat.service';
import { NotificationService } from './services/notification.service';
import { GeolocationService } from './services/geolocation.service';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ProductListComponent,
    ProductDetailComponent,
    ChatComponent,
    NotificationsComponent,
    MapComponent,
    AuthComponent
  ],
  providers: [
    LanguageService,
    AuthService,
    ProductService,
    ChatService,
    NotificationService,
    GeolocationService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}