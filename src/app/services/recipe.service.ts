import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  api_url = "https://localhost:7196/api/Recipe";
  constructor(private http: HttpClient) { }

  getRecipe(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.api_url);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(this.api_url + "/" + id);
  }

  addRecipe(recipe: Recipe): Observable<number> {
    return this.http.post<number>(this.api_url, recipe);
  }

  updateRecipe(id: number, recipe: Recipe): Observable<boolean> {
    return this.http.put<boolean>(this.api_url + "/" + id, recipe)
  }

  deleteRecipe(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.api_url + "/" + id);
  }
}
