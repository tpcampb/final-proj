import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GameScreenComponent} from './game-screen/game-screen.component';
import {FormsModule} from '@angular/forms';
import {InspirationPaneComponent} from './inspiration-pane/inspiration-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    GameScreenComponent,
    InspirationPaneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
