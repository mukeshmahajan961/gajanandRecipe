import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent {
  recipes = signal<Recipe[]>([]);
  constructor(private recipeService: RecipeService) {
    effect(() => {
      this.recipeService.getRecipe().subscribe(
        {

          next: (recipe: Recipe[]) => {
            this.recipes.set(recipe);
            console.log(recipe, 'recipes');

          },
          error: (err) => {
            console.log('Failed to load users', err);
          }
        }
      )
    })
  }
}
