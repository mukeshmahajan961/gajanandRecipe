// src/app/pages/frontend/frontend.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
export const FRONTEND_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'recipe', component: RecipeComponent },
            { path: 'recipe/:id', component: RecipeDetailComponent },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'contact',
                component: ContactComponent
            },
        ]
    },

];
