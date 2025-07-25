import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../models/recipe';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent {
   recipe = signal<Recipe | null>(null);
  constructor(private recipesService: RecipeService, private route: ActivatedRoute) {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const recipeId = parseInt(id, 10);
        this.recipesService.getRecipeById(recipeId).subscribe({
          next: (data: Recipe) => this.recipe.set(data),
          error: (err) => console.error('Failed to load recipe', err)
        });
      }
    })
  }
}
