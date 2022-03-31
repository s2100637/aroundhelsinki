import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MarkerService } from './marker.service';
import { TranslateModule , TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PopupComponent } from './popup/popup.component';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavigationComponent,
    PopupComponent,

  ],
  providers: [
    MarkerService,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
