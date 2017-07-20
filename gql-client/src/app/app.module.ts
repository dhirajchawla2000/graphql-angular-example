import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { PostComponent } from './post.component';
import { GraphqlService } from './app.service';
import { routes } from './routes';
import { provideClient } from './client';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PostComponent
  ],
  entryComponents: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ApolloModule.forRoot(provideClient)
  ],
  providers: [GraphqlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
