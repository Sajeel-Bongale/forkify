import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SECONDS } from './config';

const controlRecipe = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    // 1. Loading the recipe
    await model.loadRecipe(id);

    // 2. Rendering the recipe
    recipeView.render(model.state.recipe);

    // 3. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (e) {
    recipeView.renderError();
    console.log(e);
  }
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. Get search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage(model.state.search.page));
    paginationView.render(model.state.search);
  } catch (e) {
    console.log(e);
  }
};

const controlPagination = function(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServing = function(newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // 1 Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display  Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }


};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  console.log("Application initialized Successfully!");
};

init();