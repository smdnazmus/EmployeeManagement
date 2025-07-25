import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavBar } from "./components/nav-bar/nav-bar";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Sidebar } from "./components/sidebar/sidebar";
import { Header } from "./components/header/header";
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, Sidebar, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'employee-managementUI';
  //showNavbar = true;
  showLayout = true; // Controls sidebar, header and footer visibility

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getChildRoute(this.activatedRoute);
        this.showLayout = !currentRoute.snapshot.data['hideLayout'];
      });
  }

  // Helper to access deepest child route
  getChildRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }
}
